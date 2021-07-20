import Component from '../../core/Component';
import { $router } from '../../lib/router';
import '../../scss/animation.scss';

const FRAME = 31;
const IMAGE_SIZE = 1080;
const FIRST_INTERVAL = 140;
const LAST_INTERVAL = 40;
const imageArr = Array.from({ length: FRAME }, () => {
  return new Image(IMAGE_SIZE, IMAGE_SIZE);
});
let currentFrame;
let intervalNum = null;
export default class AnimationWrapper extends Component {
  template() {
    return `
      <div class="main-animation-wrapper">
      </div>
    `;
  }
  mounted() {
    new Animation(
      this.$target.querySelector('.main-animation-wrapper'),
      {},
      this.$store
    );
  }
}

class Animation extends Component {
  template() {
    return `
      ${
        !this.$state.loading
          ? `<canvas id="animation" width="${IMAGE_SIZE}" height="${IMAGE_SIZE}"></canvas>`
          : 'loading'
      }
    `;
  }
  setup() {
    currentFrame = 0;
    this.$state = {
      loading: true,
      loadCount: 0,
    };
    for (let i = 0; i < FRAME; i++) {
      imageArr[i].src = require(`../../assets/frame-${i}.png`).default;
      imageArr[i].addEventListener('load', () => {
        this.$state.loadCount += 1;
        if (this.$state.loadCount === FRAME) {
          this.setState({ loading: false });
        }
      });
    }
  }
  shouldComponentUpdate(prevState, nextState) {
    if (prevState.loading !== nextState.loading) {
      return true;
    } else return false;
  }
  mounted() {
    if (!this.$state.loading) {
      this.setLayout();
      new Promise((resolve, reject) => {
        this.draw(resolve, reject);
      }).then(() => {
        $router.redirect('/home');
      });
      window.addEventListener('resize', this.setLayout);
    }
  }
  setLayout() {
    const $app = document.querySelector('#app');
    const canvas = document.querySelector('#animation');
    const { width, height } = $app.getBoundingClientRect();
    let smaller = width < height ? width : height;
    const renderPX = smaller + 50;

    canvas.style.transform = `scale(${renderPX / IMAGE_SIZE})`;
  }
  draw(resolve, reject) {
    const canvas = document.querySelector('#animation');
    const ctx = canvas.getContext('2d');
    intervalNum = setInterval(() => {
      ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
      ctx.drawImage(imageArr[currentFrame], 0, 0);
      currentFrame++;
      if (currentFrame === 9) {
        clearInterval(intervalNum);
        intervalNum = setInterval(() => {
          ctx.clearRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
          ctx.drawImage(imageArr[currentFrame], 0, 0);
          currentFrame++;
          if (currentFrame === 31) {
            clearInterval(intervalNum);
            resolve(true);
          }
        }, LAST_INTERVAL);
      }
    }, FIRST_INTERVAL);
  }
}
