import Component from '../../core/Component';
import { $router } from '../../lib/router';
import Modal from './Modal';
import ToggleMenu from './ToggleMenu';
import ProductList from '../menu/ProductList';

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
    const user = this.store.getState('user');
    const text = user.username ? user.location[0] : '로그인 해주세요';
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
    /**
     * 만약 필터 있으면 그냥 렌더링 및 필터 지움, 없으면 데이터 요청 후 렌더링.
     */
    const filter = this.store.getState('filter');
    if (filter) {
      this.childReRender([
        {
          childClass: ProductList,
          selector: '.product-list-wrapper',
          props: {
            listType: '',
            emptyMessage: '등록된 상품이 없습니다',
            onClick: () => {},
          },
        },
      ]);
      this.store.dispatch('setProductFilter', '');
    } else {
      const url = `${BASE_URL}/product`;
      api.fetch(url).then((res) => {
        this.store.dispatch('setProducts', res.result);
        this.childReRender([
          {
            childClass: ProductList,
            selector: '.product-list-wrapper',
            props: {
              listType: '',
              emptyMessage: '등록된 상품이 없습니다',
              onClick: (e) => {
                if (!e.target.closest('.product-list .list-item')) return;

                const item = e.target.closest('.list-wrapper .list-item');
                const url = `${BASE_URL}/product/${item.id}`;
                api.fetch(url).then((res) => {
                  this.store.dispatch('setCurrentProduct', res.result);
                  $router.push('/product');
                });
              },
            },
          },
        ]);
      });
    }
  }
  setup() {
    this.store.dispatch('modalChange', false);
    this.$state = {
      login: this.store.getState('isLogin'),
      location: this.store.getState('location')[0],
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

    this.addEvent('click', '.location-btn', () => {
      const toggleMenuWrapper = this.$target.querySelector(
        '.toggle-menu-wrapper'
      );
      const toggleMenu = toggleMenuWrapper.querySelector('.toggle-menu');
      if (this.$state.login && !toggleMenu) {
        this.childReRender([
          {
            childClass: ToggleMenu,
            selector: '.toggle-menu-wrapper',
            props: {
              location: this.$state.location,
            },
          },
        ]);
      } else if (this.$state.login && toggleMenu) {
        toggleMenu.classList.add('off');
        setTimeout(() => {
          while (toggleMenuWrapper.hasChildNodes()) {
            toggleMenuWrapper.removeChild(toggleMenuWrapper.lastChild);
          }
        }, 300);
      }
    });

    this.addEvent('click', '.home-wrapper', (e) => {
      const toggleMenuWrapper = this.$target.querySelector(
        '.toggle-menu-wrapper'
      );
      const toggleMenu = toggleMenuWrapper.querySelector('.toggle-menu');
      if (!e.target.closest('.center') && toggleMenu) {
        toggleMenu.classList.add('off');
        setTimeout(() => {
          while (toggleMenuWrapper.hasChildNodes()) {
            toggleMenuWrapper.removeChild(toggleMenuWrapper.lastChild);
          }
        }, 300);
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

  shouldComponentUpdate(prevState, nextState) {
    if (prevState.login !== nextState.login) {
      const text = nextState.login ? nextState.location : '로그인 해주세요';
      this.childReRender([
        {
          childClass: Location,
          selector: '.location-btn',
          props: {
            login: nextState.login,
            text,
          },
        },
      ]);
    }
    return false;
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
