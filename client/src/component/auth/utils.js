let timeout;

const inputThrottle = (callback) => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    callback();
    // console.log('throttle?');
    timeout = null;
  }, 600);
};

const focusoutHandler = (e) => {
  const $input = e.target.closest('.input-wrapper input');
  if (!$input) return;
  // const $input = document.querySelector('.input-wrapper input');
  $input.classList.replace('active', 'initial');
};

const inputChangeHandler = (store, inputName) => (e) => {
  const $input = e.target.closest('.input-wrapper input');
  if (!$input) return;

  // const $input = document.querySelector('.input-wrapper input');

  if ($input.value.length > 0) {
    $input.classList.replace('initial', 'active');
  } else {
    $input.classList.replace('active', 'initial');
  }

  const callback = () =>
    store.dispatch('inputValue', {
      inputName,
      value: $input.value,
    });
  inputThrottle(callback);
};

export { inputChangeHandler, focusoutHandler };
