import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import ChatList from './ChatList';
import MyProduct from './MyProduct';
import MyLike from './MyLike';

import { $router } from '../../lib/router';
import socket from '../Chat/socket';

import 'moment/locale/ko';
import '../../scss/menu.scss';

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
    const { active } = this.$state;
    return `
      <div class="navbar-wrapper"></div>
      <div class="list-container">
        <div class="menu-tab-wrapper">
          <nav class="menu-tab">
            <ul class="tab-list">
              <li class="tab ${
                active === 'salelist' ? 'active' : ''
              }" id="salelist">판매목록</li>
              <li class="tab ${
                active === 'chatlist' ? 'active' : ''
              }" id="chatlist">채팅</li>
              <li class="tab ${
                active === 'likelist' ? 'active' : ''
              }" id="likelist">관심목록</li>
              <div class="pin"></div>
            </ul>
          </nav>
        </div>
        <div class="list-wrapper"></div>
      </div>
    `;
  }

  setup() {
    this.$state = {
      active: 'salelist',
      childClass: {
        salelist: MyProduct,
        chatlist: ChatList,
        likelist: MyLike,
      },
    };
  }
<<<<<<< HEAD
  pinMove() {
    const pin = this.$target.querySelector('.pin');
    const active = this.$target.querySelector('.active');
    const tabList = this.$target.querySelector('.tab-list');
    const pinLeft = tabList.getBoundingClientRect().left;
    const activeLeft = active.getBoundingClientRect().left;

    pin.style.transform = `translate3d(${activeLeft - pinLeft}px, 50%, 0)`;
=======

  getList(url, active) {
    if (active === 'chatlist') {
      this.setState({ active });
      return;
    }
    api.fetchWithToken(url).then((res) => {
      if (res.ok) {
        if (active === 'salelist' || active === 'likelist') {
          this.store.dispatch('setProducts', res.result);
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
    } else if (clicked === 'likelist') {
      url = `${BASE_URL}/like`;
    }

    this.getList(url, clicked);
  }

  getItem(url, active) {
    api.fetchWithToken(url).then((res) => {
      if (res.ok) {
        this.store.dispatch('setCurrentProduct', res.result);
        $router.push('/product');
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

  // handleChatRoomClick(e) {
  //   if (!e.target.closest('.chat-list .list-item')) return;

  //   const item = e.target.closest('.list-wrapper .list-item');
  //   const sender = item.querySelector('.sender-name').textContent;
  //   const url = `${BASE_URL}/chat/${item.id}`;
  //   const { active } = this.$state;

  //   this.setChatConnection(item.id);

  //   this.store.dispatch('setCurrentChatInfo', {
  //     room: item.id,
  //     chatTarget: sender,
  //   });
  //   this.getItem(url, active);
  // }

  handleLikeItemClick(e) {
    if (!e.target.closest('.product-list .list-item')) return;

    const item = e.target.closest('.list-wrapper .list-item');
    const url = `${BASE_URL}/product/${item.id}`;
    const { active } = this.$state;
    this.getItem(url, active);
  }

  setChatConnection(room) {
    socket.emit('joinRoom', { room });
>>>>>>> bad2edda547036a24e3e5e43e116bdf9b6b56929
  }
  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    new NavBar(
      $navbar,
      { title: '메뉴', background: 'grey', border: 'no-border' },
      this.store
    );
<<<<<<< HEAD
    this.pinMove();
    setTimeout(() => {
      this.$target.querySelector('.pin').style.transition = `0.3s`;
    }, 0);
    const { active, childClass } = this.$state;
    new childClass[active](
      this.$target.querySelector('.list-wrapper'),
      {},
      this.store
    );
  }
  setEvent() {
    this.addEvent('click', '.tab', (e) => {
      let current = e.target;
      while (!current.classList.contains('tab')) {
        current = current.parentNode;
      }
      this.$target.querySelector('.active').classList.remove('active');
      current.classList.add('active');
      this.pinMove();
      const id = current.getAttribute('id');
      this.$state.active = id;
      const { childClass } = this.$state;
      new childClass[id](
        this.$target.querySelector('.list-wrapper'),
        {},
        this.store
      );
    });
=======
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
>>>>>>> bad2edda547036a24e3e5e43e116bdf9b6b56929
  }
}
