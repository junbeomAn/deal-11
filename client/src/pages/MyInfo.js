import Component from '../core/Component';
import '../scss/myinfo.scss';

export default class MyInfo extends Component {
  template() {
    return `
      <div class="myinfo-wrapper">
        <h1>${this.$state.login ? 'hi user' : 'please login'}</h1>
      </div>
    `;
  }
  setup() {
    this.$state = {
      login: this.store.states.isLogin,
    };
  }
}
