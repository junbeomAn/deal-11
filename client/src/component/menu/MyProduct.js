import Component from '../../core/Component';
import ProductPreview from '../shared/ProductPreview';
import promise from '../../lib/api';
import { $router } from '../../lib/router';

import emptyImage from '../../assets/empty.jpeg';

export default class MyProductWrapper extends Component {
  template() {
    return `
      <div class="my-product-wrapper"></div>
    `;
  }
  mounted() {
    const url = API_ENDPOINT + '/api/v1/product/mine';
    promise(url, 'GET')
      .then((res) => {
        if (res.ok) {
          const wrapper = this.$target.querySelector('.my-product-wrapper');
          if (res.result.length) {
            res.result.forEach((product) => {
              new ProductPreview(wrapper, product, this.store);
            });
            this.$target
              .querySelector('.my-product-wrapper')
              .addEventListener('click', (e) => {
                let current = e.target;
                while (!current.classList.contains('product-preview-wrapper')) {
                  current = current.parentNode;
                }
                this.store.setState('productId', current.dataset.pid);
                $router.push('/product', 3);
              });
          } else {
            wrapper.classList.add('empty');
            wrapper.innerHTML = `<img src="${emptyImage}"/> <h2>아직 파시는 물건이 없네요.</h2>`;
          }
        } else {
          throw new Error(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
