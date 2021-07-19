import { isClass } from '../utils.js';
import { routeEvent } from './event';
/**
 * **DO NOT MODIFY THIS FILE**
 */
class Router {
  $app = null;
  routes = null;
  store = null;
  routePush = false;
  moveHistory = [];
  constructor({ $app, routes, store }) {
    this.$app = $app;
    this.fallback = '/';
    this.store = store;
    this.generateRoutes(routes);
    this.initEvent();
  }
  generateRoutes(routes) {
    this.routes = {};
    routes.forEach((route) => {
      this.routes[route.path] = route;
    });
  }
  initEvent() {
    window.addEventListener('hashchange', () => this.onHashChangeHandler());
  }
  getRoute(path) {
    const route = this.routes[path];
    if (!route) throw new Error(`Not found route: ${path}`);
    return route;
  }
  hasRoute(path) {
    return typeof this.routes[path] !== 'undefined';
  }
  getComponent(route) {
    const component = route.component;
    return component;
  }
  render(route) {
    console.log(history.length);
    const component = this.getComponent(route);
    if (isClass(component)) {
      new component(this.$app, {}, this.store);
      this.$app.dispatchEvent(routeEvent);
    } else {
      throw new Error(`Invalid component`);
    }
  }
  redirect(path) {
    history.replaceState(null, '', '/#' + path);
    this.onHashChangeHandler();
  }
  onHashChangeHandler() {
    this.$app.innerHTML = '';
    const hash = window.location.hash;
    const path = hash.substr(1);
    const route = this.hasRoute(path)
      ? this.getRoute(path)
      : this.getRoute(this.fallback);
    if (route.redirect) {
      this.redirect(route.redirect);
      return;
    }
    if (route.middleware) {
      if (route.async) {
        new Promise(route.middleware).then((res) => {
          if (res) this.render(route);
        });
      } else {
        if (route.middleware()) this.render(route);
      }
    } else {
      this.render(route);
    }
  }
  push(path, moveTo = 0) {
    this.routePush = true;
    this.moveHistory.push(moveTo);
    window.location.hash = path;
  }
}
/**
 * - push(path: string): void - navigate
 */
export let $router;
/**
 * @param {{$app: HTMLElement, routes: Route[], fallback?: string}} options
 */
export function initRouter(options) {
  const router = new Router(options);
  $router = {
    push: (path) => router.push(path),
    redirect: (path) => router.redirect(path),
  };
  router.onHashChangeHandler();
}
