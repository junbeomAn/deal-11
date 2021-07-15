import Component from '../core/Component';
import '../scss/myinfo.scss';

export default class MyInfo extends Component {
  template() {
    return `
      <div class="myinfo-wrapper">
        <h1>MyInfo</h1>
      </div>
    `;
  }
}
