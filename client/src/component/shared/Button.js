import Component from '../../core/Component';

import '../../scss/Button.scss';

export default class Button extends Component {
  template() {
    const { size, color, text, rectangle, type } = this.$props;
    return `
      <button class="${size || 'large'} ${color || 'primary'} ${
      rectangle ? 'rectangle' : ''
    }", type="${type || ''}">
        ${text}
      </button>
    `;
  }
  setEvent() {
    const { onClick, eventTarget } = this.$props;
    this.addEvent('click', eventTarget, onClick);
  }
}
