import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/helloWorld",
        name: "HelloWorld",
        component: HelloWorld,
    },
    {
      path: "/articles",
      name: "articles",
      // route level code-splitting
      // this generates a separate chunk (articles.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "articles" */ "../views/Articles.vue")
    },
    {
      path: "/project",
      name: "project",
      component: () =>
        import(/* webpackChunkName: "project" */ "../views/Project.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "../views/About.vue")
    },
    {
      path: "/articleDetail",
      name: "articleDetail",
      component: () =>
        import(/* webpackChunkName: "articleDetail" */ "../views/ArticleDetail.vue")
    }
];

const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL),
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
