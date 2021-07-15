import Component from '../core/Component';
import categoryI from '../assets/category.svg';
import accountI from '../assets/account.svg';
import menuI from '../assets/menu.svg';
import locationI from '../assets/location.svg';
import '../scss/home.scss';

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
    this.store.dispatch('modalChange', false);
    this.$state = {
      login: this.store.getState('isLogin'),
      location: this.store.getState('location')[0],
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

class ToggleMenu extends Component {
  template() {
    return `
      <div class="toggle-menu">
      </div>
    `;
  }
  mounted() {
    new ToggleMenuButtons(
      this.$target.querySelector('.toggle-menu'),
      this.$props,
      this.store
    );
  }
}
class ToggleMenuButtons extends Component {
  template() {
    return `
      <button class="reload-btn">${this.$props.location}</button>
      <button class="add-location-btn">내 동네 설정하기</button>
    `;
  }
}

class Modal extends Component {
  template() {
    return `
      <div class="modal">
      </div>
    `;
  }
  mounted() {
    new ModalButtons(this.$target.querySelector('.modal'), {}, this.store);
  }
}

class ModalButtons extends Component {
  template() {
    return `
      <div>
        <div class="modal-btn-container">
          <p>게시하기</p>
          <div><i class="fas fa-pencil-alt"></i></div>
        </div>
        <div class="modal-btn-container">
          <p>내 동네 추가하기</p>
          <div><i class="fas fa-building"></i></div>
        </div>
      </div>
    `;
  }
  setEvent() {
    this.addEvent('click', '.modal', (e) => {
      if (!e.target.closest('.modal-btn-container')) {
        this.store.dispatch('modalChange', false);
        const modal = this.$target.parentNode;

        document.querySelector('.plus-btn').classList.remove('exit-btn');
        this.$target.querySelector('div').classList.add('down');
        setTimeout(() => {
          modal.classList.remove('on');
          while (modal.hasChildNodes()) {
            modal.removeChild(modal.lastChild);
          }
        }, 300);
      }
    });
  }
}
