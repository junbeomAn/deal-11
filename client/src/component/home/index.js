import Component from '../../core/Component';
import { $router } from '../../lib/router';
import Modal from './Modal';
import ToggleMenu from './ToggleMenu';
import promise from '../../lib/api';

import categoryI from '../../assets/category.svg';
import accountI from '../../assets/account.svg';
import menuI from '../../assets/menu.svg';
import locationI from '../../assets/location.svg';
import '../../scss/home.scss';
import { BASE_URL } from '../../utils';

const api = {
  getToken: function () {
    return localStorage.getItem('token');
  },
  fetchWithToken: function (url) {
    return fetch(url, {
      headers: {
        token: this.getToken(),
      },
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));
  },
  fetch: function (url) {
    return fetch(url)
      .then((res) => res.json())
      .catch((err) => console.error(err));
  },
};

export default class HomeWrapper extends Component {
  template() {
    return `
    <div class="home-wrapper"></div>
    `;
  }
  mounted() {
    new Home(
      this.$target.querySelector('.home-wrapper'),
      this.$props,
      this.store
    );
  }
}

class Home extends Component {
  template() {
    return `
      <nav class="home-nav">
        <div class="left nav-btn-container">
          <button class="category-btn"><img src=${categoryI}></button>
        </div>
        <div class="center">
          <button class="location-btn">
          </button>
          <div class="toggle-menu-wrapper">
          </div>
        </div>
        <div class="right nav-btn-container">
          <button class="my-info-btn"><img src=${accountI}></button>
          <button class="menu-btn"><img src=${menuI}></button>
        </div>
      </nav>
      <div class="nav-occupant"></div>
      <div class="product-list-wrapper"></div>
      <button class="plus-btn">
        <svg viewBox="0 0 100 100">
          <line x1="50" y1="30" x2="50" y2="70"/>
          <line x1="30" y1="50" x2="70" y2="50"/>
        </svg>
      </button>
      <div class="modal-wrapper"></div>
    `;
  }
  mounted() {
    const text = this.$state.login
      ? this.store.getState('user').location[this.store.getState('selected')]
      : '로그인 해주세요';
    this.childReRender([
      {
        childClass: Location,
        selector: '.location-btn',
        props: {
          login: this.$state.login,
          text,
        },
      },
    ]);
    if (this.$state.login) {
      this.childReRender([
        {
          childClass: ToggleMenu,
          selector: '.toggle-menu-wrapper',
          props: {
            location: this.store.getState('user').location,
          },
        },
      ]);
    }
  }
  shouldComponentUpdate(prevState, nextState) {
    return false;
  }
  setup() {
    this.store.dispatch('modalChange', false);
    this.$state = {
      login: this.store.getState('isLogin'),
    };
  }
  setEvent() {
    this.addEvent('click', '.my-info-btn', () => {
      $router.push('/auth', 1);
    });
    this.addEvent('click', '.category-btn', () => {
      $router.push('/category', 2);
    });
    this.addEvent('click', '.plus-btn', () => {
      const modal = this.$target.querySelector('.modal-wrapper');
      let prevModalOn = this.store.getState('homeModal');
      this.store.dispatch('modalChange', !prevModalOn);
      this.$target.querySelector('.plus-btn').classList.toggle('exit-btn');
      if (prevModalOn && !modal.classList.contains('on')) {
        this.store.dispatch('modalChange', true);
        prevModalOn = false;
      }
      if (prevModalOn) {
        this.$target.querySelector('.modal > div').classList.add('down');
        setTimeout(() => {
          modal.classList.remove('on');
          while (modal.hasChildNodes()) modal.removeChild(modal.lastChild);
        }, 300);
      } else {
        modal.classList.add('on');
        this.childReRender([
          {
            childClass: Modal,
            selector: '.modal-wrapper',
          },
        ]);
      }
    });

    this.addEvent(
      'click',
      '.location-btn',
      (e) => {
        const toggleMenuWrapper = this.$target.querySelector(
          '.toggle-menu-wrapper'
        );
        const toggleMenu = toggleMenuWrapper.querySelector('.toggle-menu');
        if (this.$state.login && toggleMenu.classList.contains('off')) {
          e.stopPropagation();
          toggleMenu.classList.remove('off');
          const toggleMenuButtons = [...toggleMenu.children];
          const menuHeight = toggleMenuButtons.reduce((sum, child) => {
            const { height } = child.getBoundingClientRect();
            return sum + height;
          }, 0);
          toggleMenu.style.height = `${menuHeight}px`;
        }
      },
      true
    );
    this.addEvent('click', '.home-wrapper', (e) => {
      if (e.target.closest('.toggle-menu-wrapper')) return;
      if (!document.querySelector('.toggle-menu').classList.contains('off')) {
        this.toggleMenuOff();
        return;
      }
    });

    this.addEvent('click', '.menu-btn', (e) => {
      if (!e.target.closest('img')) return;
      if (!this.store.getState('isLogin')) return;

      const url = `${BASE_URL}/product/mine?page=1`;
      api.fetchWithToken(url).then((res) => {
        if (res.ok) {
          this.store.dispatch('setProducts', res.result);
          $router.push('/menu', 1);
        }
      });
    });
  }
  toggleMenuOff() {
    const toggleMenu = this.$target.querySelector('.toggle-menu');
    toggleMenu.style.height = `0px`;
    setTimeout(() => {
      toggleMenu.classList.add('off');
    }, 400);
  }
}

class Location extends Component {
  template() {
    return `
      ${this.$props.login ? `<img src=${locationI}>` : ''}
      <h2>${this.$props.text}</h2>
    `;
  }
}
