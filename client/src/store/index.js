class Store {
  states = {
    isLogin: false,
    homeModal: false,
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
    modalChange: (bool) => {
      this.setState('homeModal', bool);
    },
  };
  dispatch(funcName, args = {}) {
    return this.actions[funcName](args);
  }
  setState(stateName, value) {
    this.states[stateName] = value;
  }
  getState(stateName) {
    return this.states[stateName];
  }
}

export default new Store();
