import Component from '../../core/Component';

export default class MenuTab extends Component {
  template() {
    const { active } = this.$props;
    return `
      <nav class="menu-tab">
        <ul class="tab-list">
          <li class="tab ${
            active === 'salelist' ? 'active' : ''
          }" id="salelist">판매목록</li>
          <li class="tab ${
            active === 'chatlist' ? 'active' : ''
          }" id="chatlist">채팅</li>
          <li class="tab ${
            active === 'likelist' ? 'active' : ''
          }" id="likelist">관심목록</li>
        </ul>
      </nav>
    `;
  }
  setEvent() {
    const { eventTarget, onClick } = this.$props;
    this.addEvent('click', eventTarget, onClick);
  }
}
