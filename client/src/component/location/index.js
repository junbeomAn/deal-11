import Component from '../../core/Component';
import NavBar from '../shared/NavBar';
import promise from '../../lib/api';

import '../../scss/location.scss';
import Input from '../shared/Input';

export default class LocationWrapper extends Component {
  template() {
    return `
      <div class="location-select-wrapper">
      </div>
    `;
  }
  mounted() {
    const $location = this.$target.querySelector('.location-select-wrapper');
    new Location($location, {}, this.store);
  }
}

class Location extends Component {
  setup() {
    this.$state = {};
  }

  setEvent() {
    this.toggleModal = this.toggleModal.bind(this);
    this.addEvent('click', '.location-select-wrapper', this.toggleModal);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.addEvent('click', '.button-box', this.handleDeleteClick);
  }

  template() {
    const user = this.store.getState('user');
    const location = user.location;
    return `
      <div class="navbar-wrapper"></div>
      <div class="location-content">
        <div class="info-box">
        지역은 최소 1개이상<br/>최대 2개까지 설정 가능해요.
        </div>
        <div class="error-message hidden">
          동네는 한개 이상 설정 해야해요.
        </div>
        <div class="button-box">
          <button class="location location-one ${location[0] ? 'active' : ''}">
            ${
              location[0]
                ? `
              <div class="location-name">
              ${location[0]}
              </div>
              <div class="delete-button">
                X
              </div>
            `
                : `<div class="plus-button">+</div>`
            }
          </button>
          <button class="location location-two ${location[1] ? 'active' : ''}">
            ${
              location[1]
                ? `
              <div class="location-name">
              ${location[1]}
              </div>
              <div class="delete-button">
                X
              </div>
            `
                : `<div class="plus-button">+</div>`
            }
          </button>
        </div>
      </div>
      <div class="location-add-modal-wrapper hidden"></div>
    `;
  }

  saveToken(token) {
    localStorage.setItem('token', token);
  }

  handleDeleteClick(e) {
    if (!e.target.classList.contains('delete-button')) return;

    const $delete = e.target;
    const user = this.store.getState('user');
    const location = user.location;
    if (location.length < 2) {
      const error = this.$target.querySelector('.error-message');
      error.classList.remove('hidden');
      return;
    }
    let newLocation = [];
    if ($delete.closest('.location-one')) {
      newLocation.push(location[1]);
    } else if ($delete.closest('.location-two')) {
      newLocation.push(location[0]);
    }
    const url = `${API_ENDPOINT}/myinfo`;
    promise(
      url,
      'PUT',
      { 'Content-Type': 'application/json' },
      { location: newLocation }
    ).then((res) => {
      if (res.ok) {
        const { token, ...userInfo } = res.result;
        this.store.dispatch('setUserInfo', userInfo);
        this.saveToken(token);
        this.setState({ location: userInfo.location });
      }
    });
  }

  toggleModal(e) {
    // modal open
    console.log(e.target);
    const $modal = this.$target.querySelector('.location-add-modal-wrapper');
    const $plus = this.$target.querySelector('.plus-button');
    const $cancel = this.$target.querySelector('.cancel');
    const $proceed = this.$target.querySelector('.proceed');
    console.log($cancel === e.target);
    if (
      e.target !== $plus &&
      e.target !== $modal &&
      e.target !== $cancel &&
      e.target !== $proceed
    )
      return;
    if ($modal.classList.contains('hidden')) {
      $modal.classList.remove('hidden');
    } else {
      $modal.classList.add('hidden');
    }
  }

  handleLocationAdd(e) {
    if (!e.target.classList.contains('proceed')) return;
    const $input = this.$target.querySelector('.modal .input-wrapper input');
    const { location } = this.store.getState('user');
    const newLocation = [...location, $input.value];

    if (newLocation.length > 2) return;

    const url = `${API_ENDPOINT}/myinfo`;
    promise(
      url,
      'PUT',
      { 'Content-Type': 'application/json' },
      { location: newLocation }
    ).then((res) => {
      if (res.ok) {
        const { token, ...userInfo } = res.result;
        console.log(res, userInfo);
        this.store.dispatch('setUserInfo', userInfo);
        this.saveToken(token);
        this.setState({ location: userInfo.location });
      }
    });
  }

  mounted() {
    const $navbar = this.$target.querySelector('.navbar-wrapper');
    const $modal = this.$target.querySelector('.location-add-modal-wrapper');

    new NavBar(
      $navbar,
      { title: '내 동네 설정하기', background: 'grey' },
      this.store
    );
    new Modal(
      $modal,
      {
        handleProceedClick: this.handleLocationAdd.bind(this),
      },
      this.store
    );
  }
}

class Modal extends Component {
  setEvent() {
    const { handleCancelClick, handleProceedClick } = this.$props;
    this.addEvent('click', '.modal .proceed', handleProceedClick);
  }

  template() {
    return `
      <div class="modal">
        <div class="description">
          우리 동네를 입력하세요
        </div>
        <div class="input-wrapper">

        </div>
        <div class="button-wrapper">
          <button class="cancel">
            취소
          </button>
          <button class="proceed">
            확인
          </button>
        </div>
      </div>
    `;
  }
  mounted() {
    const $input = this.$target.querySelector('.input-wrapper');

    new Input(
      $input,
      {
        placeholder: '시·구 제외, 동만 입력',
        type: 'text',
        name: 'location',
        size: 'large',
        id: 'location',
      },
      this.store
    );
  }
}
