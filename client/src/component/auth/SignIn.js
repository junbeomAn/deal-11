import Component from '../../core/Component';
import Button from '../shared/Button';
import NavBar from '../shared/NavBar';
import Input from '../shared/Input';
import { $router } from '../../lib/router';
import { BASE_URL } from '../../utils';
import '../../scss/signin.scss';

import promise from '../../lib/api';

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
    this.$target
      .querySelector('.form-signin')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        if (username.value.length === 0) {
          username.parentNode.classList.add('error');
          return;
        }
        const header = {
          'Content-Type': 'application/json',
        };
        const data = {
          username: username.value,
        };
        promise(API_ENDPOINT + '/auth/signin', 'POST', header, data)
          .then((res) => {
            const { username, location, token } = res.result;
            this.store.dispatch('setIsLogin', true);
            this.store.dispatch('setUserInfo', {
              username,
              location,
            });
            localStorage.setItem('token', token);
            $router.redirect('/home');
          })
          .catch((err) => {
            console.log(err);
          });
      });
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
      <div class="signin-button-wrapper button-wrapper">
      </div>
      <div class="signup-button-wrapper button-wrapper">
      </div>
    `;
  }
  setup() {
    this.$state = {
      error: '',
    };
  }

  mounted() {
    this.childReRender([
      {
        childClass: Input,
        selector: '.input-wrapper',
        props: {
          placeholder: '아이디를 입력하세요',
          eventTarget: '.signin-wrapper',
          id: 'username',
          name: 'username',
          errormessage: '아이디가 입력되지 않았습니다.',
          onChange: () => {},
          onFocusout: () => {},
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
          type: 'submit',
          onClick: () => {},
        },
      },
      {
        childClass: Button,
        selector: '.signup-button-wrapper',
        props: {
          color: 'transparent',
          size: 'none',
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
