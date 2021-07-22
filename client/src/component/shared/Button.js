import Component from '../../core/Component';

import '../../scss/button.scss';

export default class Button extends Component {
  template() {
    const { size, color, text, rectangle, type, disabled } = this.$props;
    return `
      <button ${disabled ? 'disabled' : ''} class="${size || 'large'} ${
      color || 'primary'
    } ${rectangle ? 'rectangle' : ''}", type="${type || ''}">
        ${text}
      </button>
    `;
  }
  setEvent() {
    const { onClick, eventTarget } = this.$props;
    this.addEvent('click', eventTarget, onClick);
  }
}
