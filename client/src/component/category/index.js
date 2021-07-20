import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import { BASE_URL, combineWithQueryString } from '../../utils';
import { $router } from '../../lib/router';

import '../../scss/category.scss';

const api = {
  getProductByCategory: (url) => {
    return fetch(url).then((res) => res.json());
  },
  _getProductByCategory: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          ok: true,
          result: [
            { a: 1, b: 1 },
            { a: 1, b: 1 },
          ],
        });
      }, 1000);
    });
  },
};

export default class CategoryWrapper extends Component {
  template() {
    return `
      <div class="category-wrapper">
      </div>
    `;
  }
  mounted() {
    const $category = this.$target.querySelector('.category-wrapper');
    new Category($category, {}, this.store);
  }
}

class Category extends Component {
  template() {
    return `
      <div class="navbar-wrapper"></div>
      <div class="category-content"></div>
    `;
  }

  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    const $content = this.$target.querySelector('.category-content');
    new NavBar($navbar, { title: '카테고리', background: 'grey' }, this.store);
    new CategoryContents($content, {}, this.store);
  }
}

class CategoryContents extends Component {
  setup() {
    this.$state = {
      list: [
        '디지털기기',
        '생활가전',
        '가구/인테리어',
        '게임/취미',
        '생활/가공식품',
        '스포츠/레저',
        '여성패션/잡화',
        '남성패션/잡화',
        '유아동',
        '뷰티/미용',
        '반려동물',
        '도서/티켓/음반',
        '식물',
        '기타 중고물품',
      ],
    };
  }
  template() {
    return `
      <ul class="category-content">
      ${this.$state.list.reduce((acc, item, i) => {
        return (
          acc +
          `
        <li class="category-item" id="${i + 1}">
          <div class="image-box"></div>
          <div class="item-name">${item}</div>
        </li>
        `
        );
      }, '')}
      </ul>
    `;
  }
  handleCategoryClick(e) {
    if (!e.target.closest('.category-item')) return;

    const page = this.store.getState('page');
    const location = this.store.getState('location');
    const url = combineWithQueryString(BASE_URL, {
      page,
      location: location[0],
    });

    api._getProductByCategory(url).then((res) => {
      if (res.ok) {
        this.store.dispatch('setProducts', res.result);
        // console.log(this.store.getState('products'));
        $router.push('/home');
      }
    });
  }
  setEvent() {
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
    this.addEvent('click', '.category-content', this.handleCategoryClick);
  }
}