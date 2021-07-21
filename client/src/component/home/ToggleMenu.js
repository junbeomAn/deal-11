import Component from '../../core/Component';
import promise from '../../lib/api';

import '../../scss/togglemenu.scss';

export default class ToggleMenuWrapper extends Component {
  template() {
    return `
      <div class="toggle-menu off">
      </div>
    `;
  }
  mounted() {
    new ToggleMenu(
      this.$target.querySelector('.toggle-menu'),
      this.$props,
      this.store
    );
  }
}
class ToggleMenu extends Component {
  template() {
    const buttonHTML = this.$props.location.reduce((prev, location, idx) => {
      return (
        prev +
        `<button class="reload-btn menu-item" data-selected="${idx}">${location}</button>`
      );
    }, '');

    return `
      ${buttonHTML}
      <button class="add-location-btn menu-item">내 동네 설정하기</button>
    `;
  }
  setEvent() {
    this.addEvent('click', '.add-location-btn', () => {
      promise(API_ENDPOINT + '/myinfo', 'GET')
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
