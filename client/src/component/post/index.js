import Component from '../../core/Component';
import NavBar from '../shared/NavBar';

import '../../scss/post.scss';

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
          <div class="file-upload-wrapper">
            <label class="custom-file-upload">
              <input type="file" id="file-upload" name="file-upload" accept="image/*" multiple="multiple">
              <div class="img"><i class="far fa-image"></i></div>
              <div class="file-count"><span>${this.$state.files.length}</span>/10</div>
            </label>
            <div class="image-preview-list"></div>
          </div>
          <label>
            <input type="text" id="title" name="title" placeholder="글 제목">
          </label>
          <label>
            <input type="text" id="price" name="price" placeholder="₩ 가격(선택사항)">
          </label>
          <label>
            <textarea id="content" name="content" placeholder="게시글 내용을 작성해주세요."></textarea>
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
    this.$state = {
      location: '방이동',
      formData: new FormData(),
      files: [],
    };
  }
  mounted() {
    new NavBar(
      this.$target.querySelector('.nav-bar-wrapper'),
      { title: '글쓰기' },
      this.store
    );
    this.$target
      .querySelector('#file-upload')
      .addEventListener('change', (e) => {
        if (e.target.files.length + this.$state.files.length > 10) {
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
          while (!current.dataset.idx) {
            current = current.parentNode;
          }
          const idx = current.dataset.idx;
          const updateFormData = this.$state.formData.getAll('product-images');
          updateFormData.splice(idx, 1);
          this.$state.formData.delete('product-images');
          updateFormData.forEach((file) => {
            this.$state.formData.append('product-images', file);
          });
          this.setState({
            files: [...this.$state.formData.getAll('product-images')],
          });
        }
      });
  }
  shouldComponentUpdate(prevState, nextState) {
    if (prevState.files.length !== nextState.files.length) {
      this.$target.querySelector('.file-count > span').innerText =
        nextState.files.length;

      this.$target.querySelector('.image-preview-list').innerHTML = '';
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
    <div data-idx=${this.$props.idx}>
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
    const src = URL.createObjectURL(this.$props.file);
    this.$target.querySelector(`[data-idx="${this.$props.idx}"] > img`).src =
      src;
  }
}
