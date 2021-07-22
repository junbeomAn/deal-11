import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import Input from '../shared/Input';
import sendIcon from '../../assets/send.svg';
import ChatBubbleList from './ChatBubbleList';

import socket from './socket';

import '../../scss/chatdetail.scss';
import { $router } from '../../lib/router';

export default class ChatDetailWrapper extends Component {
  template() {
    return `
      <div class="chat-detail-wrapper">
      </div>
    `;
  }
  mounted() {
    const $chatDetail = this.$target.querySelector('.chat-detail-wrapper');
    new ChatDetail($chatDetail, {}, this.store);
  }
}

class ChatDetail extends Component {
  setEvent() {
    this.addEvent('submit', '.chat-form', this.onSubmit.bind(this));
  }

  template() {
    const { product } = this.store.getState('chatInfo');
    const {
      id,
      image_url: imageUrl,
      status = '판매중',
      title,
      price,
    } = product[0];

    return `
      <div class="navbar-wrapper"></div>
      <div class="chat-current-item-wrapper">
        <div class="chat-current-item" data-pid="${id}">
          <div class="image-box small">
            <img src="${imageUrl[0]}" alt="product-image"/>
          </div>
          <div class="info-box">
            <div class="info-box-left">
              <span class="product-title">${title}</span>
              <span class="product-price">${this.insertCurrencyComma(
                price
              )}원</span>
            </div>
            <div class="sale-status">
              ${status}
            </div>
          </div>
        </div>
      </div>
      <div class="chat-bubble-list-wrapper"></div>
      <form class="chat-form">
        <div class="chat-input-wrapper">
        </div>
        <button type="submit" class="chat-send-wrapper" >
          <img src="${sendIcon}" alt="send" role="button"/>
        </button>
      </form>
    `;
  }

  insertCurrencyComma(price) {
    return Number(price).toLocaleString();
  }

  getToId(messages) {
    const opponent = messages.find((message) => {
      return message.fromId !== 0;
    });
    return opponent.fromId;
  }

  getToken() {
    return localStorage.getItem('token');
  }
  onSubmit(e) {
    e.preventDefault();
    const $input = this.$target.querySelector('.chat-input-wrapper input');
    if (!$input.value) return;

    const productId =
      this.$target.querySelector('.chat-current-item').dataset.pid;

    const { room, messages } = this.store.getState('chatInfo');
    const sendInfo = {
      productId,
      toId: this.getToId(messages),
      token: this.getToken(),
    };
    socket.emit('message', { msg: $input.value, room, sendInfo });
    $input.value = '';
  }

  getMessageOwner(toId) {
    const { id } = this.store.getState('user');

    if (toId === id) {
      return 'opponent';
    } else {
      return 'mine';
    }
  }

  getBubbleFormat(msg) {
    const $itemWrapper = document.createElement('li');
    $itemWrapper.classList.add('bubble-item-wrapper');
    $itemWrapper.innerHTML = `
      <div class="bubble-item">
        <div class="content">
        ${msg}
        </div>
      </div>
      `;
    return $itemWrapper;
  }

  initChatListener() {
    const $list = this.$target.querySelector('.chat-bubble-list');
    this.getBubbleFormat = this.getBubbleFormat.bind(this);
    socket.on('message', ({ msg, toId }) => {
      const $itemWrapper = this.getBubbleFormat(msg);
      const owner = this.getMessageOwner(toId);
      $itemWrapper.classList.add(owner);
      $list.appendChild($itemWrapper);
    });
  }

  handleRightClick(e) {
    if (!e.target.closest('.nav-bar-btn .exit')) return;
    const { room } = this.store.getState('chatInfo');
    socket.emit('leaveRoom', { room });
    $router.push('/menu', 1);
  }

  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    const $chatBubbleList = this.$target.querySelector(
      '.chat-bubble-list-wrapper'
    );
    const $input = this.$target.querySelector('.chat-input-wrapper');
    const { chatTarget, room } = this.store.getState('chatInfo');

    new NavBar(
      $navbar,
      {
        title: chatTarget,
        room,
        right: 'exit',
        handleRightClick: this.handleRightClick.bind(this),
      },
      this.store
    );
    new ChatBubbleList($chatBubbleList, {}, this.store);
    new Input(
      $input,
      {
        size: 'xlarge',
        placeholder: '메시지를 입력하세요',
        type: 'text',
        name: 'message',
      },
      this.store
    );

    this.initChatListener();
  }
}
