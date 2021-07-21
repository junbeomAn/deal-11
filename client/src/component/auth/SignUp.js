import Component from '../../core/Component';
import Button from '../shared/Button';
import NavBar from '../shared/NavBar';
import Input from '../shared/Input';
import { $router } from '../../lib/router';
import { inputChangeHandler, focusoutHandler } from './utils';
import promise from '../../lib/api';
import '../../scss/signup.scss';

export default class SignUpWrapper extends Component {
  template() {
    return `
            <div class="signup-wrapper">
            </div>
        `;
  }
  mounted() {
    const $signUp = this.$target.querySelector('.signup-wrapper');
    new SignUp($signUp, {}, this.store);
  }
}

class SignUp extends Component {
  setEvent() {
    this.$target
      .querySelector('.form-signup')
      .addEventListener('submit', (e) => {
        if (this.$state.debounce) return;
        this.$state.debounce = true;
        e.preventDefault();
        const header = {
          'Content-Type': 'application/json',
        };
        const body = {
          username: e.target.username.value,
          location: [e.target.location.value],
        };
        document.querySelector(
          '.signup-button-wrapper > button'
        ).disabled = true;
        promise(API_ENDPOINT + '/auth/signup', 'POST', header, body)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            document.querySelector(
              '.signup-button-wrapper > button'
            ).disabled = false;
            console.log(this);
            $router.push('/signin');
          });
      });
  }
  setup() {
    this.$state = {
      debounce: false,
    };
  }
  template() {
    return `  
        <div class="navbar-wrapper"></div>
        <form class="form-signup"></form>
        `;
  }

  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    const $form = this.$target.querySelector('.form-signup');
    new NavBar(
      $navbar,
      {
        background: 'grey',
        title: '회원가입',
      },
      this.store
    );
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
      <div class="username-input-box">
        <label for="username">아이디</label>
        <div class="input-wrapper">
        </div>
      </div>
      <div class="location-input-box"> 
        <label for="location">우리 동네</label>
        <div class="input-wrapper">
        </div>
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
  mounted() {
    this.childReRender([
      {
        childClass: Input,
        selector: '.username-input-box .input-wrapper',
        props: {
          placeholder: '영문, 숫자 조합 20자 이하',
          id: 'username',
          eventTarget: '.signup-wrapper',
          onChange: inputChangeHandler(this.store, 'username'),
          onFocusout: focusoutHandler,
        },
      },
      {
        childClass: Input,
        selector: '.location-input-box .input-wrapper',
        props: {
          placeholder: '시, 구 제외, 동만 입력',
          id: 'location',
          eventTarget: '.signup-wrapper',
          onChange: inputChangeHandler(this.store, 'location'),
          onFocusout: focusoutHandler,
        },
      },
      {
        childClass: Button,
        selector: '.signup-button-wrapper',
        props: {
          color: 'secondary',
          size: 'large',
          text: '회원가입',
          rectangle: true,
          eventTarget: '.signup-wrapper',
          type: 'submit',
          onClick: (e) => {
            e.preventDefault();
          },
        },
      },
    ]);
  }
}
