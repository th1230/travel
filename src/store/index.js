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
    detailCurrentData: reactive([]),

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
      if (id != null) {
        state.currentId = id;
      }

      const res = await apiGetTravelRequest(index, id);
      // console.log(res);

      state.totalNum = await res.data.total;
      state.totalCount = await Math.ceil(state.totalNum / 30);
      // console.log(state.totalCount);
      let filterData = res.data.data.filter((item) => item.images.length !== 0);

      return filterData.slice(0, 20);
    },

    async loadOtherApiData(
      { commit, state },
      { index, id = null, cancel = false }
    ) {
      const res = await apiGetTravelRequest(index, id, cancel);

      let filterData = res.data.data.filter((item) => item.images.length !== 0);
      await commit("setApiData", filterData);

      state.totalNum = await state.viewPoints.length;
      state.totalCount = await Math.ceil(state.totalNum / 30);

      // console.log(
      //   "目前總數=>" + state.totalNum,
      //   "目前總頁數(30)=>" + state.totalCount,
      //   "目前id=>" + state.currentId
      // );

      return filterData;
    },

    setCategoryState({ commit }) {
      commit("setCategory");
    },

    setCurrentData({ commit }, res) {
      console.log(res);
      commit("setCurrentData", res);
      return new Promise((resolve, reject) => {
        resolve("修改完成");
      });
    },

    setCurrentId({ commit, state }, val) {
      console.log("設定", state.currentId);
      commit("setCurrentId", val);
    },

    resetViewPoints({ commit }) {
      commit("resetViewPoints");
      return "commit 後";
    },

    setDetailCurrentData({ commit }, data) {
      // console.log(data);
      commit("setDetailCurrentData", data);
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

    setCurrentId(state, val) {
      state.currentId = val;
    },

    resetViewPoints(state) {
      // console.log(state.viewPoints);
      state.viewPoints = reactive([]);
    },

    setDetailCurrentData(state, data) {
      state.detailCurrentData = data;
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

    getViewPoints: (state) => {
      return state.viewPoints;
    },

    getViewPointsById: (state) => (id) => {
      let data = {};
      state.viewPoints.forEach((item, vid) => {
        if (item.id == id) {
          data = item;
          return;
        }
      });

      return data;
    },

    getTotalNum: (state) => {
      return state.totalNum;
    },

    getTotalCount: (state) => {
      return state.totalCount;
    },

    getCurrentId: (state) => {
      return state.currentId;
    },

    getDetailCurrentData: (state) => {
      if (state.currentData != null) {
        return state.detailCurrentData;
      }
      return null;
    },
  },

  modules: {},
});
