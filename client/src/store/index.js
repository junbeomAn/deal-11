class Store {
  states = {
    isLogin: false,
    homeModal: false,
    location: ['동네', '옆 동네'],
    inputValue: '',
    isLoading: false,
    page: 1,
    products: [],
    user: {},
    rooms: [],
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
    inputValue: ({ inputName, value }) => {
      this.setState(inputName, value);
    },
    setLoading: (isLoading) => {
      this.setState('isLoading', isLoading);
    },
    setIsLogin: (isLogin) => {
      this.setState('isLogin', isLogin);
    },
    setUserInfo: (user) => {
      this.setState('user', user);
    },
    setProducts: (products) => {
      this.setState('products', products);
    },
    setRooms: (rooms) => {
      this.setState('rooms', rooms);
    },
    setCurrentProduct: (product) => {
      this.setState('currentProduct', product);
    },
    setCurrentChatInfo: (chatInfo) => {
      this.setState('chatInfo', chatInfo);
    },
  };
  dispatch(funcName, args = {}) {
    return this.actions[funcName](args);
  }
  setState(stateName, value) {
    this.states[stateName] = value;
  }
  // states 를 private 필드로 만들고 getState를 getter 함수로 만들어서 실제로도
  // states 에 getter를 통해서만 접근할 수 있도록 해도 좋을듯 함.
  getState(stateName) {
    return this.states[stateName];
  }
}

export default new Store();
