import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import MenuTab from './MenuTab';
import ProductList from './ProductList';
import ChatList from './ChatList';

import { $router } from '../../lib/router';
import { BASE_URL, combineWithQueryString } from '../../utils';
import socket from '../Chat/socket';

import 'moment/locale/ko';
import '../../scss/menu.scss';

const products = [
  {
    title: '다용도 캐비닛',
    location: '역삼동',
    created_at: '1일전',
    price: '369,000원',
    chatCount: 1,
    likeCount: 1,
    like: false,
  },
  {
    title: '다용도 캐비닛',
    location: '역삼동',
    created_at: '1일전',
    price: '369,000원',
    chatCount: 1,
    likeCount: 1,
    like: true,
  },
  {
    title: '다용도 캐비닛',
    location: '역삼동',
    created_at: '1일전',
    price: '369,000원',
    chatCount: 1,
    likeCount: 1,
    like: false,
  },
];

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
  _fetch: (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ ok: true, result: products });
      }, 800);
    });
  },
};

export default class MenuWrapper extends Component {
  template() {
    return `
      <div class="menu-wrapper">
      </div>
    `;
  }
  mounted() {
    const $menu = this.$target.querySelector('.menu-wrapper');
    new Menu($menu, {}, this.store);
  }
}

class Menu extends Component {
  template() {
    return `
      <div class="navbar-wrapper"></div>
      <div class="list-container">
        <div class="menu-tab-wrapper"></div>
        <div class="list-wrapper"></div>
      </div>
    `;
  }

  setup() {
    this.$state = {
      active: 'salelist',
    };
  }

  getList(url, active) {
    api.fetchWithToken(url).then((res) => {
      if (res.ok) {
        if (active === 'salelist' || active === 'likelist') {
          this.store.dispatch('setProducts', res.result);
        } else if (active === 'chatlist') {
          this.store.dispatch('setRooms', res.rooms);
        }
        this.setState({ active });
      }
    });
  }

  handleTabClick(e) {
    const { active } = this.$state;
    if (!e.target.closest('.menu-tab-wrapper .tab')) return;
    if (active === e.target.id) return;

    let url = '';
    const clicked = e.target.id;

    if (clicked === 'salelist') {
      url = combineWithQueryString(`${BASE_URL}/product/mine`, {
        page: this.store.getState('page'),
      });
    } else if (clicked === 'chatlist') {
      url = `${BASE_URL}/chat`;
    } else if (clicked === 'likelist') {
      url = `${BASE_URL}/like`;
    }

    this.getList(url, clicked);
  }

  getItem(url, active) {
    let action = '';
    let next = '';

    if (active === 'salelist' || active === 'likelist') {
      action = 'setCurrentProduct';
      // next = `/product/${item.id}`;
      next = `/product`;
    } else if (active === 'chatlist') {
      action = 'setCurrentChatInfo';
      // next = `/chat/${item.id}`;
      next = `/chatDetail`;
    }
    api.fetchWithToken(url).then((res) => {
      if (res.ok) {
        if (active === 'salelist' || active === 'likelist') {
          this.store.dispatch(action, res.result);
        } else if (active === 'chatlist') {
          const { messages, product } = res;
          const chatInfo = this.store.getState('chatInfo');
          this.store.dispatch(action, { messages, product, ...chatInfo });
        }
        $router.push(next);
      }
    });
  }

  handleOptionClick(e) {
    if (!e.target.closest('.list-wrapper .option')) return;

    const $optionMenu = e.target.closest('.option').previousElementSibling;
    if ($optionMenu.classList.contains('hidden')) {
      $optionMenu.classList.remove('hidden');
    } else {
      $optionMenu.classList.add('hidden');
    }
  }

  handleSaleItemClick(e) {
    if (e.target.closest('.list-wrapper .option')) return;
    if (!e.target.closest('.product-list .list-item')) return;

    const item = e.target.closest('.list-wrapper .list-item');
    const url = `${BASE_URL}/product/${item.id}`;
    const { active } = this.$state;
    this.getItem(url, active);
  }

  handleChatRoomClick(e) {
    if (!e.target.closest('.chat-list .list-item')) return;

    const item = e.target.closest('.list-wrapper .list-item');
    const sender = item.querySelector('.sender-name').textContent;
    const url = `${BASE_URL}/chat/${item.id}`;
    const { active } = this.$state;

    this.setChatConnection(item.id);

    this.store.dispatch('setCurrentChatInfo', {
      room: item.id,
      chatTarget: sender,
    });
    this.getItem(url, active);
  }

  handleLikeItemClick(e) {
    if (!e.target.closest('.product-list .list-item')) return;

    const item = e.target.closest('.list-wrapper .list-item');
    const url = `${BASE_URL}/product/${item.id}`;
    const { active } = this.$state;
    this.getItem(url, active);
  }

  setChatConnection(room) {
    socket.emit('joinRoom', { room });
  }

  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    new NavBar(
      $navbar,
      { title: '메뉴', background: 'grey', border: 'no-border' },
      this.store
    );
    const { active } = this.$state;
    const children = [
      {
        childClass: MenuTab,
        selector: '.menu-tab-wrapper',
        props: {
          eventTarget: '.menu-wrapper',
          active,
          onClick: this.handleTabClick.bind(this),
        },
      },
    ];

    if (active === 'salelist') {
      children.push({
        childClass: ProductList,
        selector: '.list-wrapper',
        props: {
          eventTarget: '.menu-wrapper',
          active,
          listType: 'with-menu',
          emptyMesage: '등록한 상품이 없습니다.',
          onClick: this.handleSaleItemClick.bind(this),
          onOptionClick: this.handleOptionClick.bind(this),
        },
      });
    } else if (active === 'chatlist') {
      children.push({
        childClass: ChatList,
        selector: '.list-wrapper',
        props: {
          eventTarget: '.menu-wrapper',
          active,
          onClick: this.handleChatRoomClick.bind(this),
        },
      });
    } else if (active === 'likelist') {
      children.push({
        childClass: ProductList,
        selector: '.list-wrapper',
        props: {
          eventTarget: '.menu-wrapper',
          active,
          listType: 'no-menu',
          emptyMesage: '관심을 표시한 상품이 없습니다.',
          onClick: this.handleLikeItemClick.bind(this),
        },
      });
    }
    this.childReRender(children);
  }
}
