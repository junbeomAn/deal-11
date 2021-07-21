import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import Input from '../shared/Input';
import sendIcon from '../../assets/send.svg';
import ChatBubbleList from './ChatBubbleList';

import socket from './socket';

import '../../scss/chatdetail.scss';

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
    this.addEvent('click', '.chat-detail-wrapper', this.onSubmit);
  }

  template() {
    // const {
    //   product: { image_url: imageUrl, status = '판매중', title, price },
    // } = this.$store.getState('chatInfo');
    const product = [
      {
        image_url: [
          '/images/67de003dd22fd7bbf64939c1e440a33570cc1626674202027.png',
          '/images/8dc09bfc1a7d8515af8ab6e12464a04a4a451626674202031.png',
        ],
        title: '안녕하세요gdgd',
        price: 9999,
      },
    ];
    const { image_url: imageUrl, status = '판매중', title, price } = product[0];
    return `
      <div class="navbar-wrapper"></div>
      <div class="chat-current-item-wrapper">
        <div class="chat-current-item">
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
        <div class="chat-send-wrapper" >
          <img src="${sendIcon}" alt="send" role="button"/>
        </div>
      </form>
    `;
  }

  insertCurrencyComma(price) {
    return Number(price).toLocaleString();
  }

  onSubmit(e) {
    if (!e.target.closest('.chat-send-wrapper')) return;

    const $input = this.$target.querySelector('.chat-input-wrapper input');
    if (!$input.value) return;

    const { room } = this.store.getState('chatInfo');
    socket.emit('message', { msg: $input.value, room });
    $input.value = '';
  }

  initChatListener() {
    socket.on('message', function (msg) {
      const list = this.$target.querySelector('.chat-bubble-list');
      const itemWrapper = document.createElement('li');
      itemWrapper.classList.add('bubble-item-wrapper');
      itemWrapper.innerHTML = `
      <div class="bubble-item">
        <div class="content">
          ${msg}
        </div>
      </div>
      `;
      list.appendChild(itemWrapper);
    });
  }

  handleRightClick(e) {
    if (!e.target.closest('.nav-bar-btn .exit')) return;
    const { room } = this.store.getState('chatInfo');
    socket.emit('leaveRoom', { room });
  }

  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    const $chatBubbleList = this.$target.querySelector(
      '.chat-bubble-list-wrapper'
    );
    const $input = this.$target.querySelector('.chat-input-wrapper');
    // const { chatTarget, room } = this.store.getState('chatInfo');
    const chatTarget = 'user1';
    const room = '3';

    new NavBar(
      $navbar,
      {
        title: chatTarget,
        room,
        right: 'exit',
        handleRightClick,
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
    initChatListener();
  }
}
