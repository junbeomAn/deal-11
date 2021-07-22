import Component from '../../core/Component';
import moment from 'moment';
import { BASE_URL } from '../../utils';
import promise from '../../lib/api';
import socket from '../Chat/socket';

import '../../scss/chatlist.scss';
import { $router } from '../../lib/router';

const api = {
  getToken: function () {
    return localStorage.getItem('token');
  },
  fetchWithToken: function (url, method) {
    return promise(url, 'GET', {
      token: this.getToken(),
    }).catch((err) => console.error(err));
  },
};

export default class ChatListWrapper extends Component {
  template() {
    return `
      <ul class="chat-list">
      </ul>
    `;
  }
  setup() {
    this.$state = {
      rooms: [],
    };
  }

  getChatList() {
    const url = `${API_ENDPOINT}/api/v1/chat`;
    api.fetchWithToken(url, 'GET').then((res) => {
      const { rooms } = res;
      this.store.dispatch('setRooms', rooms);
      this.childReRender([
        {
          childClass: ChatList,
          selector: '.chat-list',
          props: {
            rooms,
            onClick: this.handleChatItemClick.bind(this),
          },
        },
      ]);
    });
  }

  setChatConnection(room) {
    console.log('joinroom:', room);
    socket.emit('joinRoom', { room });
  }

  saveChatItem(res) {
    const { messages, product } = res;
    const chatInfo = this.store.getState('chatInfo');
    this.store.dispatch('setCurrentChatInfo', {
      messages,
      product,
      ...chatInfo,
    });
    $router.push('/chatDetail');
  }

  handleChatItemClick(e) {
    const $item = e.target.closest('.chat-list-item');
    if (!$item) return;

    const sender = $item.querySelector('.sender-name').textContent;
    const url = `${API_ENDPOINT}/api/v1/chat/${$item.id}`;

    this.setChatConnection($item.id);
    this.store.dispatch('setCurrentChatInfo', {
      room: $item.id,
      chatTarget: sender,
    });
    this.saveChatItem = this.saveChatItem.bind(this);
    api.fetchWithToken(url, 'GET').then(this.saveChatItem);
  }

  mounted() {
    // 데이터 요청
    this.getChatList();
  }
}

class ChatList extends Component {
  setEvent() {
    const { onClick } = this.$props;
    this.addEvent('click', '.chat-list', onClick);
  }

  getRoomTemplate(room) {
    const {
      sender,
      image_url: imageUrl,
      unread,
      last_content: lastContent,
      last_date: lastDate,
    } = room;
    return `
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
        </div>`;
  }

  render() {
    const $parent = this.$target;
    const { rooms } = this.$props;
    const children = [];
    rooms.forEach((room) => {
      const $li = document.createElement('li');
      $li.classList.add('chat-list-item');
      $li.innerHTML = this.getRoomTemplate(room);
      $li.id = room.id;
      children.push($li);
    });
    console.dir($parent);
    if (rooms.length === 0 && $parent.hasChildNodes()) {
      $parent.innerHTML = `<span class="empty-message">채팅기록이 없습니다</span>`;
    }
    $parent.append(...children);
  }
}
