import axios from "axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const travelRequest = axios.create({
  baseURL: "http://localhost:8080/open-api/zh-tw/Attractions/",
});

export const getTravelRequest = (index, id = null, cancel = false) => {
  if (cancel) {
    travelRequest.get(`/All?categoryIds=${id}&page=${index}`, {
      cancelToken: source.token,
    });
    source.cancel("已經取消");
  } else {
    return travelRequest.get(`/All?categoryIds=${id}&page=${index}`, {
      cancelToken: source.token,
    });
  }
};
