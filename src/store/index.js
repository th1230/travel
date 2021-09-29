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

      let filterData = res.data.data.filter((item) => item.images.length !== 0);

      commit("setApiData", filterData);
      return filterData.slice(0, 20);
    },
    async loadOtherApiData({ commit, state }, index) {
      const res = await apiGetTravelRequest(index);

      let filterData = res.data.data.filter((item) => item.images.length !== 0);
      await commit("setApiData", filterData);

      console.log("load ok");
    },

    setTtotalN({ commit }) {
      commit("setTtotalN");
    },
  },

  mutations: {
    setApiData(state, res) {
      state.viewPoints = state.viewPoints.concat(res);
    },

    setTtotalN(state) {
      state.totalNum = state.viewPoints.length;

      state.totalCount = Math.round(state.totalNum / 30);
    },
  },
  getters: {
    getData: (state) => (num) => {
      let start = (num - 1) * 20;
      let end = num * 20;
      console.log(state.totalNum);
      if (num * 20 > state.totalNum) {
        console.log(num);
        end = state.totalNum;
      }
      console.log(start, end);

      return state.viewPoints.slice(start, end);
    },
  },

  modules: {},
});
