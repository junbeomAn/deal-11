import Component from '../core/Component';
import categoryI from '../assets/category.svg';
import accountI from '../assets/account.svg';
import menuI from '../assets/menu.svg';
import locationI from '../assets/location.svg';
import '../scss/home.scss';

export default class Home extends Component {
  template() {
    return `
      <div class="home-wrapper">
        <nav class="home-nav">
          <div class="left nav-btn-container">
            <button class="category-btn"><img src=${categoryI}></button>
          </div>
          <div class="center">
            <button class="location-btn">
            </button>
          </div>
          <div class="right nav-btn-container">
            <button class="my-info-btn"><img src=${accountI}></button>
            <button class="menu-btn"><img src=${menuI}></button>
          </div>
        </nav>
      </div>
    `;
  }
  mounted() {
    const text = this.$state.login ? '동네' : '로그인 해주세요';
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
  }
  setup() {
    this.$state = {
      login: this.store.getState('isLogin'),
    };
  }
  setEvent() {
    this.addEvent('click', '.my-info-btn', () => {
      this.store.dispatch('loginReverse').then(() => {
        this.setState({
          login: this.store.getState('isLogin'),
        });
      });
    });
  }
  shouldComponentUpdate(prevState, nextState) {
    if (prevState.login !== nextState.login) {
      const text = nextState.login ? '동네' : '로그인 해주세요';
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
