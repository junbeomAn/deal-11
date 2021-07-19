import { routeEvent } from '../lib/event';

const reverseMove = [0, 2, 1, 4, 3];
const routeClass = ['none', 'left', 'right', 'up', 'down'];
export default function moveComponent(
  $app,
  Component,
  moveTo,
  store,
  props = {},
  reverse = false
) {
  let move = moveTo;
  if (reverse) move = reverseMove[move];
  let virtualElem = document.createElement('div');
  new Component(virtualElem, props, store);
  const nextComponent = virtualElem.children[0];
  $app.classList.add(reverse ? 'reverse' : 'push');
  $app.classList.add(routeClass[move]);
  $app.appendChild(nextComponent);
  setTimeout(() => {
    $app.removeAttribute('class');
    while ($app.children.length !== 1) {
      $app.removeChild($app.firstChild);
    }
    $app.dispatchEvent(routeEvent);
  }, 300);
}
