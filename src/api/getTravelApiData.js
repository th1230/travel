import axios from "axios";

const travelRequest = axios.create({
  baseURL: "http://localhost:8080/open-api/zh-tw/Attractions/",
});

export const getTravelRequest = (index, id = null) =>
  travelRequest.get(`/All?categoryIds=${id}&page=${index}`);
