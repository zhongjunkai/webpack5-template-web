import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component:()=> import("@/views/home/index")
    },
    {
        path: "/about",
        name: "About",
        component:()=> import("@/views/about/index")
    }
];

const router = createRouter({
    history: createWebHashHistory("/"),
    routes
});

export default router;