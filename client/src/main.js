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
 *   - 비동기로 처리하려면 넣으려면 async 값을 true로 넣어주어야 합니다.
 *   - testPromise를 middleware로 넣으면 1초 후, false 값을 resolve하고, myinfo로 push합니다.
 * - redirect: string
 *   - redirect로 바로 이동합니다.
 * - $router 객체를 이용해서 push 할 수 있습니다.
 */
const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/myinfo', component: MyInfo },
];
const routeEvent = new CustomEvent('route');
const $app = document.querySelector('#app');
const scrollBar = document.querySelector('#custom-scroll-bar');
let scrollHeight = 0;
let remainScroll = 0;
let scrollRange = 0;
let scrollTimeOut = null;

function setScrollBar() {
  $app.scrollTo(0, 0);
  const pageRootElem = document.querySelector('#app > *');
  const { height } = pageRootElem.getBoundingClientRect();
  if (height) scrollHeight = window.innerHeight * (window.innerHeight / height);
  remainScroll = window.innerHeight - scrollHeight;
  scrollRange = height - window.innerHeight;
  scrollBar.style.height = `${scrollHeight}px`;
}
function scrollHandler() {
  scrollBar.style.transform = `translateY(${
    remainScroll * ($app.scrollTop / scrollRange)
  }px)`;
  if (scrollTimeOut) {
    clearTimeout(scrollTimeOut);
  } else {
    scrollBar.setAttribute('class', 'fade-in');
  }
  scrollTimeOut = setTimeout(() => {
    scrollBar.setAttribute('class', 'fade-out');
    scrollTimeOut = null;
  }, 1000);
}

$app.addEventListener('route', () => {
  setScrollBar();
});
$app.addEventListener('scroll', () => {
  scrollHandler();
});
async function init() {
  initRouter({ $app, routes, routeEvent });
}
init();
