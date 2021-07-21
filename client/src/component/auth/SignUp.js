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
        e.preventDefault();
        if (this.$state.debounce) return;
        const errorElem = e.target.querySelector('.error-message-wrapper');
        errorElem.classList.add('hidden');
        if (username.value.length === 0) {
          username.parentNode.classList.add('error');
          return;
        } else {
          username.parentNode.classList.remove('error');
        }

        if (myLocation.value.length === 0) {
          myLocation.parentNode.classList.add('error');
          return;
        } else {
          myLocation.parentNode.classList.remove('error');
        }

        this.$state.debounce = true;
        e.preventDefault();
        const header = {
          'Content-Type': 'application/json',
        };
        const body = {
          username: username.value,
          location: [myLocation.value],
        };
        promise(API_ENDPOINT + '/auth/signup', 'POST', header, body)
          .then((res) => {
            if (res.ok) {
              $router.redirect('/signin');
            } else {
              return new Error(res);
            }
          })
          .catch((err) => {
            if (err.message === '409') {
              errorElem.innerText = '이미 존재하는 사용자입니다.';
              errorElem.classList.remove('hidden');
            } else {
              console.log(err);
            }
          })
          .finally(() => {
            this.$state.debounce = false;
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
    return `
      <div class="error-message-wrapper hidden">
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
  mounted() {
    this.childReRender([
      {
        childClass: Input,
        selector: '.username-input-box .input-wrapper',
        props: {
          placeholder: '영문, 숫자 조합 20자 이하',
          id: 'username',
          name: 'username',
          eventTarget: '.signup-wrapper',
          errormessage: '아이디를 입력해주십시오.',
        },
      },
      {
        childClass: Input,
        selector: '.location-input-box .input-wrapper',
        props: {
          placeholder: '시, 구 제외, 동만 입력',
          id: 'myLocation',
          name: 'myLocation',
          eventTarget: '.signup-wrapper',
          errormessage: '동네를 입력해주십시오.',
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
          onClick: (e) => {},
        },
      },
    ]);
  }
}
