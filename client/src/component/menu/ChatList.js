import Component from '../../core/Component';
import moment from 'moment';
import { BASE_URL } from '../../utils';

import '../../scss/chatlist.scss';

export default class ChatList extends Component {
  setEvent() {
    const { onClick } = this.$props;
    this.addEvent('click', '.chat-list', onClick);
  }
  template() {
    const rooms = this.store.getState('rooms');
    return rooms.length === 0
      ? `<span class="empty-message">채팅기록이 없습니다</span>`
      : `
    <ul class="chat-list chat-list-page-1">
      ${rooms.reduce((acc, room) => {
        const {
          id,
          sender,
          image_url: imageUrl,
          unread,
          last_content: lastContent,
          last_date: lastDate,
        } = room;

        return (
          acc +
          `
            <li class="chat-list-item" id="${id}">
              <div class="content-wrapper">
                <div class="info-box">
                  <div class="info-box-top">
                    <span class="sender-name">${sender}</span>
                    <span class="send-time">${moment(lastDate).fromNow()}</span>
                  </div>
                  <div class="info-box-bottom">
                    <span class="pre-content">${lastContent}</span>
                    ${
                      unread > 0
                        ? `<div class="unread-count-wrapper"><span class="unread-count">${unread}</span></div>`
                        : ''
                    }
                  </div>
                </div>
                <div class="image-box">
                  <img src="${BASE_URL}${imageUrl[0]}" alt="product-image" />
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
