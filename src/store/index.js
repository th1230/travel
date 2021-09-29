import { createStore } from "vuex";
import { apiGetTravelRequest } from "../api";
import { toRefs, reactive, ref, toRef } from "vue";

export default createStore({
  state: {
    viewPoints: reactive([]),
    currentData: reactive([]),
    haveData: false,
    totalNum: 0,
    totalCount: 0,
    currentId: null,

    categoryOpen: false,
    categoryIdData: [
      {
        id: 11,
        name: "養生溫泉",
      },
      {
        id: 12,
        name: "單車遊蹤",
      },
      {
        id: 13,
        name: "歷史建築",
      },
      {
        id: 14,
        name: "宗教信仰",
      },
      {
        id: 15,
        name: "藝文館所",
      },
      {
        id: 16,
        name: "戶外踏青",
      },
      {
        id: 19,
        name: "親子共遊",
      },
      {
        id: 24,
        name: "主題商街",
      },
      {
        id: 25,
        name: "無障礙旅遊",
      },
    ],
  },
  actions: {
    async getApiData({ commit, state }, { index, id = null }) {
      console.log(index, id);

      if (id != null) {
        state.currentId = id;
      }

      const res = await apiGetTravelRequest(index, id);

      state.totalNum = await res.data.total;
      state.totalCount = await Math.ceil(state.totalNum / 30);

      let filterData = res.data.data.filter((item) => item.images.length !== 0);

      return filterData.slice(0, 20);
    },

    async loadOtherApiData({ commit, state }, { index, id = null }) {
      console.log(index, id);
      const res = await apiGetTravelRequest(index, id);

      let filterData = res.data.data.filter((item) => item.images.length !== 0);
      await commit("setApiData", filterData);

      console.log(state.viewPoints.length);
      state.totalNum = await state.viewPoints.length;
      state.totalCount = await Math.ceil(state.totalNum / 30);

      console.log(
        "目前總數=>" + state.totalNum,
        "目前總頁數(30)=>" + state.totalCount
      );
    },

    setCategoryState({ commit }) {
      commit("setCategory");
    },

    setCurrentData({ commit }, res) {
      console.log(res);
      commit("setCurrentData", res);
    },
  },

  mutations: {
    setApiData(state, res) {
      state.viewPoints = state.viewPoints.concat(res);
    },

    setCategory(state) {
      state.categoryOpen = !state.categoryOpen;
    },

    setCurrentData(state, res) {
      state.currentData = res;
      state.viewPoints = [];
      console.log("第一次設定完畢");
    },
  },
  getters: {
    getData: (state) => (num) => {
      let start = (num - 1) * 20;
      let end = num * 20;
      console.log(state.totalNum);
      if (num * 20 > state.totalNum) {
        console.log("總共頁數:" + num);
        end = state.totalNum;
      }
      console.log("返回資料開始=>" + start, "結束=>" + end);

      return state.viewPoints.slice(start, end);
    },

    getCate: (state) => {
      return state.categoryOpen;
    },

    getCateData: (state) => {
      return state.categoryIdData;
    },

    getCurrentData: (state) => {
      if (state.currentData != null) {
        return state.currentData;
      }
      return null;
    },

    getTotalNum: (state) => {
      return state.totalNum;
    },
  },

  modules: {},
});
