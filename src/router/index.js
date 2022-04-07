import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import GetPlanets from "../views/Planets/GetPlanets.vue";



Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/planet",
    name: "planet",
    component: GetPlanets,
  },
  
];

const router = new VueRouter({
  routes,
});

export default router;
