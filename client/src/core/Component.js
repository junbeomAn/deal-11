export default class Componet {
  $target;
  $props;
  $state;
  constructor ($target, $props){
    this.$target = $target;
    this.$props = $props;
    this.setup();
    this.setEvent();
    this.render();
  }

  // state 정의
  setup () {};
  // render 후 실행되는 함수
  mounted () {};
  // render 이전에 template literal로 string 리턴해주는 함수
  template () { return '' };
  // render
  render () {
    this.$target.innerHTML = this.template();
    this.mounted();
  }
  // 이벤트 등록 (addEvent 사용)
  setEvent () {};
  // state 변경되면 render 다시
  setState (newState) {
    this.$state = { ...this.$state, ...newState };
    this.render();
  }
  // event add 하기
  addEvent (eventType, selector, callback) {
    // 없을 때를 방지하기 위해서
    const children = [ ...this.$target.querySelectorAll(selector) ];
    // selector로 명시한 노드보다 더 하위 요소가 선택되었을 때를 처리하기 위해
    // closest를 사용한다.
    const isRight = (target) => children.includes(target) || target.closest(selector);

    this.$target.addEventListener(eventType, e => {
      if (!isRight(e.target)) return;
      callback(e);
    })
  }
}