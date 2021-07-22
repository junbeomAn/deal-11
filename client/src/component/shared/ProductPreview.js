import Component from '../../core/Component';
import { priceChange } from '../../utils';
import { appendEvent } from '../../lib/event';
import moment from 'moment';

import empty from '../../assets/empty.jpeg';
import '../../scss/preview.scss';

export default class ProductPreview extends Component {
  template() {
    const { id, title, location, image_url, created_at, price, like_count } =
      this.$props;
    return `
      <div class="product-preview-wrapper" data-pid="${id}">
        <img src="${image_url.length ? API_ENDPOINT + image_url[0] : empty}">
        <div class="product-info">
          <div class="title">${title}</div>
          <div class="location time">${location} • ${moment(
      created_at
    ).fromNow()}</div>
          <div class="price">${priceChange(price)}</div>
        </div>
        <div class="like-count">
          <i class="far fa-heart"></i>
          ${like_count}
        </div>
      </div>
    `;
  }
  render() {
    const virtualDOM = document.createElement('div');
    virtualDOM.innerHTML = this.template();
    this.$target.append(...virtualDOM.children);
    this.mounted();
  }
  mounted() {
    document.querySelector('#app').dispatchEvent(appendEvent);
  }
}
