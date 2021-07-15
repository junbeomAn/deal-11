import Component from '../core/Component';
import categoryI from '../assets/category.svg';
import '../scss/home.scss';

export default class Home extends Component {
  template() {
    return `
      <div class="home-wrapper">
        <nav class="home-nav">
          <div class="left">
            <button class="category-btn"><img src=${categoryI}></button>
            <h1></h1>
            <h2>${this.$state.name}</h2>
          </div>
        </nav>
      </div>
    `;
  }
  mounted() {
    this.childReRender();
  }
  setup() {
    this.$state = {
      login: this.store.states.isLogin,
      name: 'woowa',
    };
  }
  shouldComponentUpdate(prevState, nextState) {
    if (prevState.name === nextState.name) return false;
  }
  setEvent() {
    this.addEvent('click', '.category-btn', () => {
      this.store.dispatch('loginTrue');
      this.setState({
        login: this.store.getState('isLogin'),
      });
      this.childReRender();
    });
  }
  childReRender() {
    new Head(
      document.querySelector('.left > h1'),
      {
        login: this.$state.login,
      },
      this.store
    );
  }
}

class Head extends Component {
  template() {
    return `${this.$props.login ? 'hi user' : 'please login'}`;
  }
}
