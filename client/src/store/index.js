class Store {
  states = {
    isLogin: false,
  };
  actions = {
    loginTrue: () => {
      this.setState('isLogin', true);
    },
    loginReverse: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.setState('isLogin', !this.getState('isLogin'));
          resolve(true);
        }, 1000);
      });
    },
  };
  dispatch(funcName) {
    return this.actions[funcName]();
  }
  setState(stateName, value) {
    this.states[stateName] = value;
  }
  getState(stateName) {
    return this.states[stateName];
  }
}

export default new Store();
