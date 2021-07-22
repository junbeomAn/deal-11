import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import Button from '../shared/Button';

import '../../scss/auth.scss';
import { $router } from '../../lib/router';

const api = {
  signOut: (url) => {
    return fetch(url).then((res) => res.json());
  },
  _signOut: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ ok: true });
      }, 800);
    });
  },
};

export default class Auth extends Component {
  template() {
    return `
      <div class="auth-wrapper">
      </div>
    `;
  }

  mounted() {
    const isLogin = this.store.getState('isLogin');
    const $auth = this.$target.querySelector('.auth-wrapper');
    const username = this.store.getState('username');
    if (isLogin) {
      new Default($auth, { username }, this.store);
    } else {
      $router.redirect('/signin');
    }
  }
  setup() {
    this.$state = {
      login: this.store.states.isLogin,
    };
  }
}

class Default extends Component {
  template() {
    return `
      <div class="auth-default">
        <div class="navbar-wrapper"></div>
        <section class="section-content">

        </section>
      </div>
    `;
  }
  mounted() {
    new NavBar(
      this.$target.querySelector('.navbar-wrapper'),
      { title: '내 계정', background: 'grey' },
      this.store
    );
    new Content(this.$target.querySelector('.section-content'), {}, this.store);
  }
}

class Content extends Component {
  template() {
    return `
      <div class="username">
      </div>
      <div class="button-wrapper">
      <div/>
    `;
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  handleLogout(e) {
    if (!e.target.closest('.button-wrapper button')) return;
    const url = `${API_ENDPOINT}/auth/signout`;

    this.removeToken();
    this.store.dispatch('setIsLogin', false);
    $router.push('/signin');
    // api._signOut(url).then((res) => {
    //   if (res.ok) {
    //     this.store.dispatch('setIsLogin', false);
    //     $router.push('/signin');
    //   }
    // });
  }
  mounted() {
    const { username } = this.store.getState('user');
    this.childReRender([
      {
        childClass: Username,
        selector: '.username',
        props: { username },
      },
      {
        childClass: Button,
        selector: '.button-wrapper',
        props: {
          color: 'primary',
          size: 'large',
          text: '로그아웃',
          rectangle: true,
          eventTarget: '.auth-wrapper',
          onClick: this.handleLogout.bind(this),
        },
      },
    ]);
  }
}

class Username extends Component {
  template() {
    return `
        ${this.$props.username}
    `;
  }
}
