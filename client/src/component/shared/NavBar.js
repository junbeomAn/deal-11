import Component from '../../core/Component';
import arrowIcon from '../../assets/arrow_back.svg';
import doneIcon from '../../assets/done.svg';

export default class NavBarWrapper extends Component {
  template() {
    return `<div class="navbar-wrapper"></div>`;
  }
  mounted() {
    new NavBar(
      this.$target.querySelector('.navbar-wrapper'),
      this.$props,
      this.store
    );
  }
}

class NavBar extends Component {
  template() {
    const { title, right, backGround } = this.$props;
    return `
      <div class="nav-bar-shared ${backGround || ''}">
        <button class="nav-bar-btn">
          <img src=${arrowIcon} alt="go-back">
        </button>
        <div class="title">
          <span>${title}</span>
        </div>
        ${
          right
            ? `
            <button class="nav-bar-btn>
              <img src=${doneIcon} alt="post-product">
            </button>
          `
            : ''
        }
      </div>
    `;
  }
}
