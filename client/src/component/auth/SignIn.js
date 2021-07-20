import Component from '../../core/Component';
import Button from '../shared/Button';
import NavBar from '../shared/NavBar';
import Input from '../shared/Input';
import { $router } from '../../lib/router';
import { inputChangeHandler, focusoutHandler } from './utils';
import { BASE_URL } from '../../utils';
import '../../scss/signin.scss';

const api = {
  signIn: (url, data) => {
    return fetch(url, {
      method: 'POST',
      // mode: 'cors',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
  },
  _signIn: () => {
    // test usage
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ ok: true });
      }, 800);
    });
  },
};

export default class SignInWrapper extends Component {
  template() {
    return `
        <div class="signin-wrapper">
        </div>
        `;
  }
  mounted() {
    const $signIn = this.$target.querySelector('.signin-wrapper');
    new SignIn($signIn, {}, this.store);
  }
}

class SignIn extends Component {
  template() {
    return `  
        <div class="navbar-wrapper"></div>
        <form class="form-signin"></form>
        `;
  }
  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    const $form = this.$target.querySelector('.form-signin');
    new NavBar($navbar, { background: 'grey', title: '로그인' }, this.store);
    new Form($form, {}, this.store);
  }
}

class Form extends Component {
  template() {
    const { error } = this.$state;
    return `
      <div class="error-message-wrapper ${error ? '' : 'hidden'}">
        ${error}
      </div> 
      <div class="input-wrapper">
      </div>
      <div class="signin-button-wrapper">
      </div>
      <div class="signup-button-wrapper">
      </div>
    `;
  }
  setup() {
    this.$state = {
      error: '',
    };
  }
  handleSignInClick(e) {
    e.preventDefault();
    if (!e.target.closest('.signin-button-wrapper button')) return;

    const username = this.store.getState('username');
    const url = `${BASE_URL}/auth/signin`;

    if (!username) {
      this.setState({ error: '아이디를 입력해주세요' });
      return;
    }

    api._signIn(url, { username }).then((res) => {
      if (res.ok === true) {
        // user 정보 저장?!, res.result
        const { result } = res;
        this.store.dispatch('inputValue', {
          inputName: 'username',
          value: '',
        });
        this.store.dispatch('setIsLogin', true);
        this.store.dispatch('setUserInfo', result);
        // store 로그인 상태 및 로딩 상태 변경 필요
        if (this.$state.error) {
          this.setState({ error: '' });
        }
        $router.redirect('/home');
      } else {
        this.setState({
          error: res.message || '잘못된 아이디 입니다.',
        });
      }
    });
  }

  mounted() {
    this.childReRender([
      {
        childClass: Input,
        selector: '.input-wrapper',
        props: {
          placeholder: '아이디를 입력하세요',
          eventTarget: '.signin-wrapper',
          onChange: inputChangeHandler(this.store, 'username'),
          onFocusout: focusoutHandler,
        },
      },
      {
        childClass: Button,
        selector: '.signin-button-wrapper',
        props: {
          color: 'primary',
          size: 'large',
          text: '로그인',
          rectangle: true,
          eventTarget: '.signin-wrapper',
          onClick: this.handleSignInClick.bind(this),
        },
      },
      {
        childClass: Button,
        selector: '.signup-button-wrapper',
        props: {
          color: 'transparent',
          size: 'large',
          text: '회원가입',
          eventTarget: '.signin-wrapper',
          onClick: (e) => {
            e.preventDefault();
            if (!e.target.closest('.signup-button-wrapper button')) return;

            $router.push('/signup', 1);
          },
        },
      },
    ]);
  }
}
