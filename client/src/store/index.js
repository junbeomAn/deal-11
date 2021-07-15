class Store {
  states = {
    isLogin: false,
  };
  actions = {
    loginTrue: () => {
      this.setState('isLogin', true);
    },
  };
  dispatch(funcName) {
    this.actions[funcName]();
  }
  setState(stateName, value) {
    this.states[stateName] = value;
  }
  getState(stateName) {
    return this.states[stateName];
  }
}

export default new Store();
