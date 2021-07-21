import Component from '../../core/Component';

import '../../scss/preview.scss';

export default class ProductPreview extends Component {
  template() {
    const { id, title, location, image_url, date, price, like } = this.$props;
    return `
      <div class="product-preview-wrapper" data-pid="${id}">
        <img src="${API_ENDPOINT + image_url[0]}">
        <div class="product_info">
          <div class="title">${title}</div>
          <div class="location time">${location} • ${date}</div>
          <div class="price">${price}</div>
        </div>
        <div class="likeCount">
          ${like}
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
}
