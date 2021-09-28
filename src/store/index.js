import { createStore } from "vuex";
import { apiGetTravelRequest } from "../api";

export default createStore({
  state: {
    viewPoints: [],
    haveData: false,
    totalNum: 0,
    totalCount: 0,
  },
  actions: {
    async getApiData({ commit, state }, index) {
      const res = await apiGetTravelRequest(index);

      state.totalNum = await res.data.total;

      state.totalCount = await Math.round(state.totalNum / 30);

      commit("setApiData", res.data.data);
      return res.data.data.slice(0, 20);
    },
    async loadOtherApiData({ commit, state }, index) {
      const res = await apiGetTravelRequest(index);

      await commit("setApiData", res.data.data);

      console.log("load ok");
    },
  },

  mutations: {
    setApiData(state, res) {
      state.viewPoints = state.viewPoints.concat(res);
    },
  },
  getters: {
    getData: (state) => (num) => {
      let start = (num - 1) * 20;
      let end = num * 20;
      return state.viewPoints.slice(start, end);
    },
  },

  modules: {},
});
