import Component from '../../core/Component';
import promise from '../../lib/api';

export default class ToggleMenuWrapper extends Component {
  template() {
    return `
      <div class="toggle-menu">
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
    return `
      ${this.$props.location.map((location, idx) => {
        return `<button class="reload-btn" data-selected="${idx}">${location}</button>`;
      })}
      <button class="add-location-btn">내 동네 설정하기</button>
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
