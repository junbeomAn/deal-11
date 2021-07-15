import Component from '../core/Component';
import categoryI from '../assets/category.svg';
import '../scss/home.scss';

export default class Home extends Component {
  template() {
    return `
      <div class="home-wrapper">
        <nav class="home-nav">
          <div class="left">
            <button><img src=${categoryI}></button>
          </div>
        </nav>
      </div>
    `;
  }
}
