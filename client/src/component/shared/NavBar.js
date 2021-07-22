import Component from '../../core/Component';
import arrowIcon from '../../assets/arrow_back.svg';
import doneIcon from '../../assets/done.svg';
import exitIcon from '../../assets/exit.svg';

import '../../scss/navbar.scss';

export default class NavBarWrapper extends Component {
  template() {
    const { background, border } = this.$props;
    return `
     <div class="nav-bar-shared ${background || ''} ${border || ''}">
     </div>
     `;
  }
  mounted() {
    new NavBar(
      this.$target.querySelector('.nav-bar-shared'),
      this.$props,
      this.store
    );
  }
}

class NavBar extends Component {
  template() {
    const { title, right } = this.$props;
    return `
        <button class="nav-bar-btn back-btn" >
          <img src=${arrowIcon} alt="go-back">
        </button>
        <div class="title">
          <span>${title}</span>
        </div>
        ${
          right
            ? `
            <button class="nav-bar-btn right-btn ${
              right === 'done' ? 'done' : 'exit'
            }">
              <img src=${right === 'done' ? doneIcon : exitIcon} alt="next">
            </button>
          `
            : ''
        }
      
    `;
  }
  handleBackClick(e) {
    if (!e.target.closest('.nav-bar-btn.back-btn')) return;
    history.back();
  }
  setEvent() {
    const { handleRightClick } = this.$props;
    this.handleBackClick = this.handleBackClick.bind(this);
    this.addEvent('click', '.nav-bar-shared', this.handleBackClick);
    if (handleRightClick)
      this.addEvent('click', '.nav-bar-shared.right-btn', handleRightClick);
  }
}
