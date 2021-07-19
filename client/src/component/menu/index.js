import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import MenuTab from './MenuTab';

import { $router } from '../../lib/router';
import { BASE_URL, combineWithQueryString } from '../../utils';

import moreIcon from '../../assets/more_vert.svg';
import chatBubbleIcon from '../../assets/chat_bubble_mini.svg';
import favoriteMiniIcon from '../../assets/favorite_border_mini.svg';
import favoriteEmptyIcon from '../../assets/favorite_border.svg';
import favoriteFullIcon from '../../assets/favorite.svg';

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
  getMyProducts: (url) => {
    return fetch(url).then((res) => res.json());
  },
  _getMyProducts: (url) => {
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

  getSaleList(e) {
    const url =
      `${BASE_URL}/product/mine` +
      combineWithQueryString({ page: this.store.getState('page') });
    // 재사용?
    api._getMyProducts(url).then((res) => {
      if (res.ok) {
        this.store.dispatch('setProducts', res.result);
        this.setState({ active: e.target.id });
      }
    });
  }

  getChatList(e) {}

  getLikeList(e) {
    // this.setState({ active: e.target.id });
  }

  handleTabClick(e) {
    const { active } = this.$state;
    if (!e.target.closest('.menu-tab-wrapper .tab')) return;
    if (active === e.target.id) return;

    if (e.target.id === 'salelist') {
      this.getSaleList(e);
    } else if (e.target.id === 'chatlist') {
      this.getChatList(e);
    } else if (e.target.id === 'likelist') {
      this.getLikeList(e);
    }
  }

  handleSaleItemClick(e) {
    if (!e.target.closest('.list-wrapper .list-item')) return;

    if (e.target.closest('.list-wrapper .option')) {
      const $optionMenu = e.target.closest('.option').previousElementSibling;
      if ($optionMenu.classList.contains('hidden')) {
        $optionMenu.classList.remove('hidden');
      } else {
        $optionMenu.classList.add('hidden');
      }
    } else {
      // data fetch
      $router.push(`/product/${e.target.id}`);
    }
  }

  handleLikeItemClick(e) {
    if (!e.target.closest('.list-wrapper .list-item')) return;
    // data fetch
    // $router.push(`/product/${e.target.id}`);
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
        },
      });
    } else if (active === 'chatlist') {
      children.push({});
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

class ProductList extends Component {
  setEvent() {
    const { onClick } = this.$props;
    this.addEvent('click', '.product-list', onClick);
  }
  template() {
    const { listType = 'with-menu', emptyMessage = '등록한 상품이 없습니다.' } =
      this.$props;
    const products = this.store.getState('products');
    return products.length === 0
      ? `<span class="empty-message">${emptyMessage}</span>`
      : `
      <ul class="product-list">
      ${products.reduce((acc, product) => {
        const {
          title,
          location,
          price,
          created_at,
          chatCount = 1,
          likeCount = 1,
          like,
        } = product;
        return (
          acc +
          `
            <li class="list-item">
              <div class="content-wrapper">
                <div class="image-box">
                </div>
                <div class="info-box">
                  <div class="title">${title}</div>
                  <div class="info">
                    <span>${location}</span>
                    ∙
                    <span>${created_at}</span>
                  </div>
                  <div class="price">${price}</div>
                </div>
                <div class="option-box">
                  ${
                    listType === 'with-menu'
                      ? `<div class="option-menu hidden">
                      <div class="modify option" role="button">
                        수정하기
                      </div>
                      <div class="delete option" role="button">
                        삭제하기
                      </div>
                    </div>`
                      : ''
                  }
                  <div class="option" role="button">
                    ${
                      listType === 'with-menu'
                        ? `<img class="more-icon" src="${moreIcon}" alt="more" />`
                        : `<img class="favorite-icon" src="${
                            like ? favoriteFullIcon : favoriteEmptyIcon
                          }" alt="favorite" />`
                    }
                  </div>
                  <div class="product-status">
                  ${
                    chatCount > 0
                      ? `<div class="chat-mini-wrapper">
                        <img class="chat-mini-icon" src="${chatBubbleIcon}" alt="chat-bubble-mini" />
                        &nbsp;&nbsp;
                        <span>${chatCount}</span>
                      </div>`
                      : ''
                  }
                  ${
                    likeCount > 0
                      ? `<div class="favorite-mini-wrapper">
                        <img class="favorite-mini-icon" src="${favoriteMiniIcon}" alt="favorite-border-mini" />
                        &nbsp;&nbsp;
                        <span>${likeCount}</span>
                      </div>`
                      : ''
                  }
                  <div>
                </div>
              </div>
            </li>
          `
        );
      }, '')}
      </ul>
    `;
  }
}
