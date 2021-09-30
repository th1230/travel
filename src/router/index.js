import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home/index.vue";
import { useStore } from "vuex";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/Detail/:id",
    name: "Detail",
    component: () => import("../views/Home/detail.vue"),
  },
  {
    path: "/Favor",
    name: "Favor",
    component: () => import("../views/Favor.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
