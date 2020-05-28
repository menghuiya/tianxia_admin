import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const state = {
  token:
    '827ac1a59fb8e3c52f6e6a164ac1c42b9ce446422294b6b9dffc0339782f8dd9b2b10daf3e3734b588c566c5458d04b90474abf21556beb67f3ce7bc6ac1fed6',
  userName: '',
  id: '',
};

export default new Vuex.Store({
  state,
  mutations: {
    initData(state, data) {
      data = JSON.parse(data);
      state.userName = data.userName;
      state.id = data._id;
    },
  },
  actions: {},
  modules: {},
});
