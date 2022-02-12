import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import vuetify from "./plugins/vuetify";

import "@/css/glyphfont.css";

Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
