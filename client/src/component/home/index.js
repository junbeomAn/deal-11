import Component from '../../core/Component';
import { $router } from '../../lib/router';
import Modal from './Modal';
import ToggleMenu from './ToggleMenu';
import ProductPreview from '../shared/ProductPreview';
import promise from '../../lib/api';

import categoryI from '../../assets/category.svg';
import accountI from '../../assets/account.svg';
import menuI from '../../assets/menu.svg';
import locationI from '../../assets/location.svg';
import emptyImage from '../../assets/empty.jpeg';
import '../../scss/home.scss';

export default class HomeWrapper extends Component {
  template() {
    return `
    <div class="home-wrapper"></div>
    `;
  }
  mounted() {
    let url = API_ENDPOINT + '/api/v1/product';
    const categoryId = this.store.getState('categoryId');
    if (categoryId) url += `/category/${categoryId}`;
    if (this.store.getState('isLogin')) {
      url += `?location=${
        this.store.getState('user').location[this.store.getState('selected')]
      }`;
    }
    promise(url, 'GET')
      .then((res) => {
        if (res.ok) {
          new Home(
            document.querySelector('.home-wrapper'),
            {
              products: res.result,
            },
            this.store
          );
        } else {
          return new Error(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
    const productListElem = this.$target.querySelector('.product-list-wrapper');
    if (this.$props.products.length) {
      this.$props.products.forEach((product) => {
        new ProductPreview(productListElem, product, this.store);
      });
    } else {
      const emptyElem = document.createElement('img');
      const emptyText = document.createElement('p');
      emptyText.innerText = '물건이 아직 없네요.';
      emptyElem.src = emptyImage;
      productListElem.classList.add('not-product');
      productListElem.append(emptyElem, emptyText);
    }
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
        document.querySelector('#app').removeAttribute('style');
        setTimeout(() => {
          modal.classList.remove('on');
          while (modal.hasChildNodes()) modal.removeChild(modal.lastChild);
        }, 300);
      } else {
        modal.classList.add('on');
        document.querySelector('#app').style.overflow = 'hidden';
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
      if (
        document.querySelector('.toggle-menu') &&
        !document.querySelector('.toggle-menu').classList.contains('off')
      ) {
        this.toggleMenuOff();
        return;
      }
    });
    this.addEvent('click', '.product-list-wrapper', (e) => {
      if (
        document.querySelector('.toggle-menu') &&
        !document.querySelector('.toggle-menu').classList.contains('off')
      )
        return;
      if (!e.target.closest('.product-preview-wrapper')) return;
      let current = e.target;
      while (!current.classList.contains('product-preview-wrapper')) {
        current = current.parentNode;
      }
      this.store.setState('productId', current.dataset.pid);
      $router.push('/product', 3);
    });

    this.addEvent('click', '.menu-btn', (e) => {
      if (!e.target.closest('img')) return;
      $router.push('/menu', 1);
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
