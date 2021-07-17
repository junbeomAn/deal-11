import Component from '../../core/Component';
import SignIn from './SignIn';
import NavBar from '../shared/NavBar';

import '../../scss/auth.scss';

export default class Auth extends Component {
  template() {
    return `
      <div class="auth-wrapper">
      </div>
    `;
  }

  mounted() {
    const { isLogin } = this.store.states;
    const $auth = this.$target.querySelector('.auth-wrapper');
    if (!isLogin) {
      new Default($auth, {}, this.store);
    } else {
      new SignIn($auth, {}, this.store);
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

      </div>
    `;
  }
  mounted() {
    const $default = this.$target.querySelector('.auth-default');
    new NavBar($default, { title: '내 계정', backGround: 'grey' }, this.store);
  }
}
