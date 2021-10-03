import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidate from "vee-validate";

const app = createApp(App);

app
  .use(store)
  .use(router)
  .use(VeeValidate)
  .mount("#app");
