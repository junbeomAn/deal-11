import { isClass } from '../utils.js';
/**
 * **DO NOT MODIFY THIS FILE**
 */
class Router {
  $app = null;
  routes = null;
  routeEvent = null;
  store = null;
  constructor({ $app, routes, routeEvent, store }) {
    this.$app = $app;
    this.fallback = '/';
    this.routeEvent = routeEvent;
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
    const component = this.getComponent(route);
    if (isClass(component)) {
      new component(this.$app, {}, this.store);
      this.$app.dispatchEvent(this.routeEvent);
    } else {
      throw new Error(`Invalid component`);
    }
  }

  onHashChangeHandler() {
    this.$app.innerHTML = '';
    const hash = window.location.hash;
    const path = hash.substr(1);
    const route = this.hasRoute(path)
      ? this.getRoute(path)
      : this.getRoute(this.fallback);
    if (route.redirect) {
      this.push(route.redirect);
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
  push(path) {
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
  };
  router.onHashChangeHandler();
}
