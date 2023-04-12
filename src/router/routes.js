import Login from "../pages/Login.vue";
import SignUp from "../pages/SignUp.vue";
import Home from "../pages/Home.vue";
import Settings from "../pages/Settings.vue";

export const routes = [
  { path: "/", redirect: "/login" },
  { name: "login", path: "/login", component: Login },
  { name: "signup", path: "/signup", component: SignUp },
  { name: "home", path: "/home", component: Home },
  { name: "settings", path: "/settings", component: Settings },
];

// beforeEnter: (to, from, next) => {
//     if(isAuth) next({ name: 'login' })
//     else next()
//          }
