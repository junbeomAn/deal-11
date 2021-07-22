import Component from '../../core/Component';
import NavBar from '../shared/NavBar';

import promise from '../../lib/api';
import { priceChange, getPriceOriginal, categoryInfo } from '../../utils';
import '../../scss/post.scss';
import { $router } from '../../lib/router';

export default class PostWrapper extends Component {
  template() {
    return `
      <div class="post-wrapper">
      </div>
    `;
  }
  mounted() {
    new Post(this.$target.querySelector('.post-wrapper'), {}, this.store);
  }
}

class Post extends Component {
  template() {
    return `
      <div class="nav-bar-wrapper"></div>
      <div class="form-wrapper">
        <form class="post-form">
          <p class="form-error-message hidden"></p>
          <div class="file-upload-wrapper">
            <label class="custom-file-upload">
              <input type="file" id="file-upload" name="file-upload" accept="image/*" multiple="multiple">
              <div class="img"><i class="far fa-image"></i></div>
              <div class="file-count"><span>${
                this.$state.files.length + this.$state.keeps.length
              }</span>/10</div>
            </label>
            <div class="image-preview-list"></div>
          </div>
          <label>
            <input type="text" id="title" name="title" placeholder="(필수)글 제목">
          </label>
          <label class="category">
            <p>(필수)카테고리를 선택해주세요.</p>
            <select id="category" name="category">
              ${categoryInfo.reduce((prev, category, idx) => {
                return prev + `<option value="${idx + 1}">${category}</option>`;
              }, '<option value="0" disabled selected="true">선택해 주십시오.</option>')}
            </select>
          </label>
          <label>
            <input type="text" id="price" name="price" placeholder="₩ 가격(선택사항)">
          </label>
          <label>
            <textarea id="content" name="content" placeholder="(필수)게시글 내용을 작성해주세요."></textarea>
          </label>
        </form>
        <div class="location-wrapper">
          <div><i class="fas fa-map-marker-alt"></i></div>
          <p>${this.$state.location}</p>
        </div>
      </div>
    `;
  }
  setup() {
    const putPost = this.store.getState('putPost');
    if (putPost) {
      const { image_url, id, title, price, content, category, location } =
        putPost;
      this.store.setState('putPost', null);
      this.$state = {
        formData: new FormData(),
        files: [],
        keeps: [...image_url],
        location,
        postId: id,
        title,
        price,
        content,
        category,
      };
    } else {
      this.$state = {
        location:
          this.store.getState('user').location[this.store.getState('selected')],
        formData: new FormData(),
        files: [],
        keeps: [],
      };
    }
  }
  mounted() {
    if (this.$state.postId) {
      const form = this.$target.querySelector('.post-form');
      form.title.value = this.$state.title;
      form.content.value = this.$state.content;
      if (parseInt(this.$state.price) >= 0) {
        form.price.value = this.$state.price;
      }
      const options = [...form.category.children];
      options.forEach((option) => {
        if (option.innerText === this.$state.category) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      });
      this.$state.keeps.forEach((image, uidx) => {
        this.childReRender([
          {
            childClass: ImagePreview,
            selector: '.image-preview-list',
            props: {
              image,
              uidx,
            },
          },
        ]);
      });
    }
    new NavBar(
      this.$target.querySelector('.nav-bar-wrapper'),
      {
        title: this.$state.postId ? '게시글 수정하기' : '글쓰기',
        right: 'done',
        handleRightClick: (e) => {
          const form = this.$target.querySelector('.post-form');
          const errorWrapper = form.querySelector('.form-error-message');
          errorWrapper.classList.add('hidden');
          if (!form.title.value.replace(/ /g, '').length) {
            errorWrapper.innerText = '글 제목은 필수 사항 입니다.';
            errorWrapper.classList.remove('hidden');
            return;
          }
          if (form.category.value === '0') {
            errorWrapper.innerText = '카테고리는 필수 사항 입니다.';
            errorWrapper.classList.remove('hidden');
            return;
          }
          if (form.price.value === '올바른 가격이 아닙니다.') {
            errorWrapper.innerText = '올바른 가격을 입력하십시오.';
            errorWrapper.classList.remove('hidden');
            return;
          }
          if (!form.content.value.replace(/ /g, '').length) {
            errorWrapper.innerText = '게시글 내용은 필수 사항 입니다.';
            errorWrapper.classList.remove('hidden');
            return;
          }
          let price = getPriceOriginal(form.price.value);
          if (price === '') price = -1;
          const data = {
            title: form.title.value,
            content: form.content.value,
            category_id: parseInt(form.category.value),
            price: parseInt(price),
            location: this.$state.location,
            keep: this.$state.keeps,
          };
          this.$state.formData.append('data', JSON.stringify(data));

          if (!this.$state.postId) {
            const url = API_ENDPOINT + '/api/v1/product';
            promise(url, 'POST', {}, this.$state.formData, true)
              .then((res) => {
                if (res.ok) {
                  this.store.setState('productId', parseInt(res.detail_id));
                  $router.redirect('/product');
                }
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            const url = API_ENDPOINT + `/api/v1/product/${this.$state.postId}`;
            promise(url, 'PUT', {}, this.$state.formData, true)
              .then((res) => {
                if (res.ok) {
                  this.store.setState(
                    'productId',
                    parseInt(this.$state.postId)
                  );
                  $router.redirect('/product');
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        },
      },
      this.store
    );
    this.$target
      .querySelector('#file-upload')
      .addEventListener('change', (e) => {
        if (
          e.target.files.length +
            this.$state.files.length +
            this.$state.keeps.length >
          10
        ) {
          alert('10개 이상의 파일을 등록하실 수 없습니다.');
          return;
        }
        for (let i = 0; i < e.target.files.length; i++) {
          this.$state.formData.append('product-images', e.target.files[i]);
        }
        this.setState({ files: [...this.$state.files, ...e.target.files] });
      });
    this.$target
      .querySelector('.image-preview-list')
      .addEventListener('click', (e) => {
        if (e.target.closest('.remove')) {
          let current = e.target;
          while (!(current.dataset.idx || current.dataset.uidx)) {
            current = current.parentNode;
          }
          const idx = current.dataset.idx;
          const uidx = current.dataset.uidx;
          if (idx) {
            const updateFormData =
              this.$state.formData.getAll('product-images');
            updateFormData.splice(idx, 1);
            this.$state.formData.delete('product-images');
            updateFormData.forEach((file) => {
              this.$state.formData.append('product-images', file);
            });
            this.setState({
              files: [...this.$state.formData.getAll('product-images')],
            });
          } else {
            const nextKeeps = this.$state.keeps.slice();
            nextKeeps.splice(uidx, 1);
            this.setState({
              keeps: [...nextKeeps],
            });
          }
        }
      });
    this.$target.querySelector('#price').addEventListener('change', (e) => {
      e.target.value = priceChange(e.target.value);
    });
  }
  shouldComponentUpdate(prevState, nextState) {
    if (
      prevState.files.length !== nextState.files.length ||
      prevState.keeps.length !== nextState.keeps.length
    ) {
      this.$target.querySelector('.file-count > span').innerText =
        nextState.files.length + nextState.keeps.length;

      this.$target.querySelector('.image-preview-list').innerHTML = '';
      nextState.keeps.forEach((image, uidx) => {
        this.childReRender([
          {
            childClass: ImagePreview,
            selector: '.image-preview-list',
            props: {
              image,
              uidx,
            },
          },
        ]);
      });
      nextState.files.forEach((file, idx) => {
        this.childReRender([
          {
            childClass: ImagePreview,
            selector: '.image-preview-list',
            props: {
              file,
              idx,
            },
          },
        ]);
      });
    }
    return false;
  }
}

class ImagePreview extends Component {
  template() {
    return `
    <div data-${
      isNaN(parseInt(this.$props.idx))
        ? `uidx=${this.$props.uidx}`
        : `idx=${this.$props.idx}`
    }>
      <img >
      <svg class="remove" viewBox="0 0 100 100">
        <line stroke="white" x1="30" y1="30" x2="70" y2="70" />
        <line stroke="white" x1="70" y1="30" x2="30" y2="70" />
      </svg>
    </div>
    `;
  }
  render() {
    const virtual = document.createElement('div');
    virtual.innerHTML = this.template();
    this.$target.append(...virtual.children);
    this.mounted();
  }
  mounted() {
    if (this.$props.idx || this.$props.idx === 0) {
      const src = URL.createObjectURL(this.$props.file);
      this.$target.querySelector(`[data-idx="${this.$props.idx}"] > img`).src =
        src;
    } else {
      this.$target.querySelector(
        `[data-uidx="${this.$props.uidx}"] > img`
      ).src = API_ENDPOINT + this.$props.image;
    }
  }
}
