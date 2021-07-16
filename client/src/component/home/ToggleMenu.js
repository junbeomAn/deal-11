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
      <button class="reload-btn">${this.$props.location}</button>
      <button class="add-location-btn">내 동네 설정하기</button>
    `;
  }
}
