import Component from '../../core/Component';
import Button from '../shared/Button';

import promise from '../../lib/api';
import { priceChange } from '../../utils';
import moment from 'moment';

import emptyImage from '../../assets/empty.jpeg';
import '../../scss/detail.scss';
import { relativeTimeThreshold } from 'moment';
import { $router } from '../../lib/router';

export default class DetailWrapper extends Component {
  template() {
    return `
      <div class="detail-wrapper"></div>
    `;
  }
  mounted() {
    const productId = this.store.getState('productId');
    const url = API_ENDPOINT + `/api/v1/product/${productId}`;
    promise(url, 'GET')
      .then((res) => {
        if (res.ok) {
          this.store.setState('productId', 0);
          new Detail(
            document.querySelector('.detail-wrapper'),
            res.result,
            this.store
          );
        } else {
          throw new Error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

class Detail extends Component {
  template() {
    const {
      id,
      authorized,
      chat_count,
      created_at,
      category,
      content,
      like_count,
      location,
      price,
      seller_id,
      seller_name,
      title,
    } = this.$props;
    return `
      <nav class="nav-bar">
        <div class="back"><i class="fas fa-chevron-left"></i></div>
        ${
          authorized
            ? `<div class="authorized">
                <i class="fas fa-bars"></i>
              </div>
              <div class="authorized-toggle-menu">
                <div class="modify">수정하기</div>
                <div class="delete">삭제하기</div>
              </div>`
            : ''
        }
      </nav>
      <div class="carousel-wrapper"></div>
      <div class="product-info">
        <h2>${title}</h2>
        <p class="sub-info">${category} • ${moment(created_at).fromNow()}</p>
        <p class="content">${content}</p>
        <p class="sub-info">채팅 ${chat_count} • 관심 <span class="like-count">${like_count}<span></p>
        <div class="seller-info">
          <p>판매자 정보</p>
          <div class="real">
            <p>${seller_name}</p>
            <span class="sub-info">${location}</span>
          </div>
        </div>
      </div>
      <div class="bottom-nav">
        <div class="heart-wrapper"></div>
        <div class="price-chat-wrapper">
          <p>${priceChange(price)}</p>
          <div class="custom-button-wrapper"></div>
        </div>
      </div>
    `;
  }
  mounted() {
    new Carousel(
      document.querySelector('.carousel-wrapper'),
      { image_url: this.$props.image_url },
      this.store
    );
    new Heart(
      document.querySelector('.heart-wrapper'),
      { like: this.$props.user_like, id: this.$props.id },
      this.store
    );
    const { authorized, chat_count } = this.$props;
    let text;
    let disabled = false;
    let callback = () => {};
    if (authorized) {
      text = '채팅 목록 보기';
      callback = () => {};
      if (chat_count === 0) disabled = true;
    } else if (this.store.getState('isLogin')) {
      text = '문의 하기';
      callback = () => {};
    } else {
      text = '로그인 해주세요.';
      disabled = true;
    }
    new Button(document.querySelector('.custom-button-wrapper'), {
      size: 'small',
      text,
      disabled,
      eventTarget: '.custom-button-wrapper',
      onClick: callback,
    });
  }
  setEvent() {
    this.addEvent('click', '.nav-bar > .back', () => {
      history.back();
    });
    this.addEvent('click', '.authorized', () => {
      const nav = document.querySelector('.detail-wrapper > nav');
      if (!nav.classList.contains('toggle-on')) {
        nav.classList.add('toggle-on');
      }
    });
    this.addEvent(
      'click',
      '.detail-wrapper',
      (e) => {
        const nav = document.querySelector('.detail-wrapper > nav');
        if (e.target.closest('.authorized-toggle-menu')) return;
        if (nav.classList.contains('toggle-on')) {
          e.stopPropagation();
          nav.classList.remove('toggle-on');
          return;
        }
      },
      true
    );
  }
}

class Carousel extends Component {
  template() {
    const imgs = this.$props.image_url.length
      ? this.$props.image_url.reduce((prev, img, idx) => {
          return (
            prev +
            `<img src="${API_ENDPOINT + img}" style="left: ${idx * 100}%"/>`
          );
        }, '')
      : `<img class="null" src="${emptyImage}"/>`;
    return `
      ${imgs}
      ${
        this.$props.image_url.length
          ? `
          <div class="carou-left carou-btn"><i class="fas fa-chevron-left"></i></div>
          <div class="carou-right carou-btn"><i class="fas fa-chevron-right"></i></div>
          <div class="circle-wrapper">
            <div class="circle long"></div>
            ${`<div class="circle"></div>`.repeat(
              this.$props.image_url.length - 1
            )}
          </div>
          `
          : ''
      }
    `;
  }
  setup() {
    this.$state = {
      carouLevel: 0,
    };
  }
  setEvent() {
    this.addEvent('click', '.carou-btn', (e) => {
      let current = e.target;
      const now = this.$state.carouLevel;
      const max = this.$props.image_url.length;
      if (max === 1) return;
      while (!current.classList.contains('carou-btn')) {
        current = current.parentNode;
      }
      let go;
      if (current.classList.contains('carou-right')) {
        go = 1;
      } else {
        go = -1;
      }
      const next = now + go;
      if (next < 0 || next === max) return;
      this.$state.carouLevel = next;
      const circles = document.querySelectorAll('.carousel-wrapper .circle');
      const imgs = document.querySelectorAll('.carousel-wrapper > img');
      imgs.forEach((img, idx) => {
        img.style.transform = `translate3d(${-next * 100}%, 0, 0)`;
        if (idx === next) {
          circles[idx].classList.add('long');
        } else {
          circles[idx].classList.remove('long');
        }
      });
    });
  }
}

class Heart extends Component {
  template() {
    const { like } = this.$props;
    return `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-4 0 50 37"
    class="${like ? 'fill' : ''}"
  >
    <g>
      <path
        d="M10.07,0A11.23,11.23,0,0,0,1.83,17.33c.62.93.72,1,10.12,10.51L21,37l9.11-9.21c5.74-5.79,9.25-9.37,9.46-9.65C45.31,10.63,40.21,0,30.91,0c-3.41,0-5.56,1-8.54,4L21,5.4,19.63,4a14.17,14.17,0,0,0-2.52-2.22,11.24,11.24,0,0,0-7-1.77"
      />
    </g>
  </svg>`;
  }
  setEvent() {
    this.addEvent('click', 'svg', (e) => {
      if (!this.store.getState('isLogin')) {
        $router.redirect('/signin');
        return;
      }
      const svg = this.$target.querySelector('svg');
      const { id } = this.$props;
      const url = API_ENDPOINT + `/api/v1/product/like/${id}`;
      promise(url, 'POST')
        .then((res) => {
          const likeCount = document.querySelector('.product-info .like-count');
          if (res.like) {
            svg.setAttribute('class', 'fill');
            likeCount.innerText = +likeCount.innerText + 1;
          } else {
            svg.removeAttribute('class');
            likeCount.innerText = +likeCount.innerText - 1;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
}
