import { initRouter, $router } from './lib/router.js';
import Home from './pages/Home.js';
import MyInfo from './pages/MyInfo.js';
import './scss/app.scss';

/**
 * route
 * - path: string
 * - component: Component Class를 넣어주어야 합니다.
 * - middleware: [() => boolean | () => Promise<boolean>]
 *   - 함수 호출 결과가 true이면, 페이지를 이동하고 false 이면, 페이지를 이동하지 않습니다.
 *   - Promise 객체를 넣으려면 asyncMiddleware 값을 true로 넣어주어야 합니다.
 *   - testPromise를 middleware로 넣으면 1초 후, false 값을 resolve하고, myinfo로 push합니다.
 * - redirect: string
 *   - redirect로 바로 이동합니다.
 * - $router 객체를 이용해서 push 할 수 있습니다.
 */
const testPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    $router.push('/myinfo');
    resolve(false);
  }, 1000);
});
const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    component: Home,
    middleware: testPromise,
    asyncMiddleware: true,
  },
  { path: '/myinfo', component: MyInfo },
];
const $app = document.querySelector('#app');
async function init() {
  initRouter({ $app, routes });
}
init();
