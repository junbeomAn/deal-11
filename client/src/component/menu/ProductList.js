import moment from 'moment';

import Component from '../../core/Component';
import moreIcon from '../../assets/more_vert.svg';
import chatBubbleIcon from '../../assets/chat_bubble_mini.svg';
import favoriteMiniIcon from '../../assets/favorite_border_mini.svg';
import favoriteEmptyIcon from '../../assets/favorite_border.svg';
import favoriteFullIcon from '../../assets/favorite.svg';

import '../../scss/productlist.scss';

export default class ProductList extends Component {
  setEvent() {
    const { onClick, onOptionClick = () => {} } = this.$props;
    this.addEvent('click', '.product-list', onClick);
    this.addEvent('click', '.option', onOptionClick);
  }
  template() {
    const { listType = 'with-menu', emptyMessage = '등록한 상품이 없습니다.' } =
      this.$props;
    const products = this.store.getState('products');
    return products.length === 0
      ? `<span class="empty-message">${emptyMessage}</span>`
      : `
      <ul class="product-list product-list-page-1">
      ${products.reduce((acc, product) => {
        console.log(product);
        const {
          id,
          title,
          location,
          price,
          created_at,
          chat_count = 1,
          like_count = 1,
          like,
          image_url: imageUrl,
        } = product;
        return (
          acc +
          `
            <li class="list-item" id="${id}">
              <div class="content-wrapper">
                <div class="image-box">
                  <img src="${imageUrl[0]}" alt="product-image" />
                </div>
                <div class="info-box">
                  <div class="title">${title}</div>
                  <div class="info">
                    <span>${location}</span>
                    ∙
                    <span>${moment(created_at).fromNow()}</span>
                  </div>
                  <div class="price">${price}</div>
                </div>
                <div class="option-box">
                  ${
                    listType === 'with-menu'
                      ? `<div class="option-menu hidden">
                      <div class="modify option" role="button">
                        수정하기
                      </div>
                      <div class="delete option" role="button">
                        삭제하기
                      </div>
                    </div>`
                      : ''
                  }
                  <div class="option" role="button">
                    ${
                      listType === 'with-menu'
                        ? `<img class="more-icon" src="${moreIcon}" alt="more" />`
                        : `<img class="favorite-icon" src="${
                            like ? favoriteFullIcon : favoriteEmptyIcon
                          }" alt="favorite" />`
                    }
                  </div>
                  <div class="product-status">
                  ${
                    chat_count > 0
                      ? `<div class="chat-mini-wrapper">
                        <img class="chat-mini-icon" src="${chatBubbleIcon}" alt="chat-bubble-mini" />
                        &nbsp;&nbsp;
                        <span>${chat_count}</span>
                      </div>`
                      : ''
                  }
                  ${
                    like_count > 0
                      ? `<div class="favorite-mini-wrapper">
                        <img class="favorite-mini-icon" src="${favoriteMiniIcon}" alt="favorite-border-mini" />
                        &nbsp;&nbsp;
                        <span>${like_count}</span>
                      </div>`
                      : ''
                  }
                  <div>
                </div>
              </div>
            </li>
          `
        );
      }, '')}
      </ul>
    `;
  }
}
