import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  if (
    // make sure the user is authenticated
    !JSON.parse(localStorage.getItem("finwiseState"))?.isAuth &&
    to.name !== "login" &&
    from.name !== "login" &&
    !JSON.parse(localStorage.getItem("finwiseState"))?.isAuth &&
    to.name !== "signup"
  ) {
    // redirect the user to the login page
    return { name: "login" };
  }
  if (
    (JSON.parse(localStorage.getItem("finwiseState"))?.isAuth &&
      to.name === "login") ||
    (JSON.parse(localStorage.getItem("finwiseState"))?.isAuth &&
      to.name === "signup")
  ) {
    return { name: "home" };
  }
});
