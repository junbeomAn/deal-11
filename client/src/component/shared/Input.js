import Component from '../../core/Component';

import '../../scss/input.scss';

export default class Input extends Component {
  template() {
    const { size, status, placeholder, type, name, id, border } = this.$props;
    return `
        <input 
            ${id ? `id="${id}"` : ''}
            class="input ${size || 'large'} ${status || 'initial'}"  
            placeholder="${placeholder || ''}"
            type="${type || 'text'}"
            name="${name || 'text'}"
         />
      `;
  }
  setEvent() {
    const {
      eventTarget,
      onChange = () => {},
      onFocusout = () => {},
    } = this.$props;
    this.addEvent('input', eventTarget, onChange);
    this.addEvent('focusout', eventTarget, onFocusout);
  }
}
