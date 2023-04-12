import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import InlineSvg from "vue-inline-svg";
import { SnackbarService } from "vue3-snackbar";
import "vue3-snackbar/styles";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueUploadComponent from "vue-upload-component";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.component("inline-svg", InlineSvg);
app.component("file-upload", VueUploadComponent);
app.use(SnackbarService);
app.use(pinia);
app.use(router);

app.mount("#app");
