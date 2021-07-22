export default class Componet {
  $target;
  $props;
  $state;
  store;
  constructor($target, $props, store) {
    this.$target = $target;
    this.$props = $props;
    this.store = store;
    this.setup();
    this.render();
    this.setEvent();
  }

  // state 정의
  setup() {}
  // render 후 실행되는 함수 (자식 객체 생성하는 코드가 필요)
  mounted() {}
  // render 이전에 template literal로 string 리턴해주는 함수
  template() {
    return '';
  }
  // render
  render() {
    this.$target.innerHTML = this.template();
    this.mounted();
  }
  // render를 해야하는가?
  shouldComponentUpdate(prevState, nextState) {
    return true;
  }
  // 이벤트 등록 (addEvent 사용)
  setEvent() {}
  // state 변경되면 render 다시
  setState(newState) {
    const prevState = this.$state;
    this.$state = { ...this.$state, ...newState };

    if (this.shouldComponentUpdate(prevState, this.$state)) this.render();
  }
  // event add 하기
  addEvent(eventType, selector, callback, capture = false) {
    // 없을 때를 방지하기 위해서
    const children = [...this.$target.querySelectorAll(selector)];
    // selector로 명시한 노드보다 더 하위 요소가 선택되었을 때를 처리하기 위해
    // closest를 사용한다.
    const isRight = (target) =>
      children.includes(target) || target.closest(selector);

    this.$target.addEventListener(
      eventType,
      (e) => {
        if (!isRight(e.target)) return;
        callback(e);
      },
      capture
    );
  }
  /**
   * options: array
   * option(options의 value들): object
   *  - option.childClass: class
   *  - option.selector: parent selector
   *  - option.props: props object
   *  - option.repeat : array (optional) 선택 반복이 필요할 때
   *  - option.repeat의 자식은 props object
   *    - !! 주의 !! repeat 속성이 존재하는 경우 repeat 배열 내에 props들을 넣어준다.
   */
  childReRender(options) {
    options.forEach((option) => {
      const parentNode = this.$target.querySelector(option.selector);
      if (option.repeat) {
        option.repeat.forEach((props) => {
          new option.childClass(parentNode, props, this.store);
        });
      } else {
        new option.childClass(parentNode, option.props, this.store);
      }
    });
  }
}
