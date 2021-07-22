import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import ChatList from './ChatList';
import MyProduct from './MyProduct';
import MyLike from './MyLike';

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
  pinMove() {
    const pin = this.$target.querySelector('.pin');
    const active = this.$target.querySelector('.active');
    const tabList = this.$target.querySelector('.tab-list');
    const pinLeft = tabList.getBoundingClientRect().left;
    const activeLeft = active.getBoundingClientRect().left;

    pin.style.transform = `translate3d(${activeLeft - pinLeft}px, 50%, 0)`;
  }
  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    new NavBar(
      $navbar,
      { title: '메뉴', background: 'grey', border: 'no-border' },
      this.store
    );
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
  }
}
