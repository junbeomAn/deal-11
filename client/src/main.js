import { initRouter, $router } from './lib/router.js';
import Home from './component/home';
import Auth from './component/auth';
import SignUp from './component/auth/SignUp';
import SignIn from './component/auth/SignIn';
import Category from './component/category';
import Menu from './component/menu';
import ChatDetail from './component/Chat/ChatDetail.js';
import Animation from './component/animation';
import Post from './component/post';

import './scss/app.scss';
import store from './store';
import promise from './lib/api';

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
  { path: '/', redirect: '/main' },
  { path: '/main', component: Animation },
  { path: '/home', component: Home },
  { path: '/auth', component: Auth, middleware: loginMiddleWare },
  { path: '/signin', component: SignIn },
  { path: '/signup', component: SignUp },
  { path: '/category', component: Category },
  { path: '/menu', component: Menu },
  { path: '/chatDetail', component: ChatDetail },
  { path: '/post', component: Post },
];
const $app = document.querySelector('#app');
const scrollBar = document.querySelector('#custom-scroll-bar');
let scrollHeight = 0;
let remainScroll = 0;
let scrollRange = 0;
let scrollTimeOut = null;

function loginMiddleWare() {
  if (!store.getState('isLogin')) {
    $router.redirect('/signin');
    return false;
  } else {
    return true;
  }
}
function setScrollBar() {
  const pageRootElem = document.querySelector('#app > *');
  if (!pageRootElem) return;
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
window.addEventListener('resize', () => {
  setScrollBar();
  scrollHandler();
});
$app.addEventListener('route', () => {
  $app.scrollTo(0, 0);
  setScrollBar();
});
$app.addEventListener('scroll', () => {
  scrollHandler();
});
function init() {
  promise(API_ENDPOINT + '/myinfo', 'GET')
    .then((res) => {
      console.log(res);
      const isLogin = res.login;
      store.dispatch('setIsLogin', isLogin);
      if (isLogin) {
        const user = res.user;
        store.setState('user', {
          id: user.userId,
          location: user.location,
          username: user.username,
        });
      }
      initRouter({ $app, routes, store });
    })
    .catch((err) => {
      console.log(err);
    });
}
init();
