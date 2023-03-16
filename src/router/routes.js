import { validationNotSession, validationsSession } from "./validations-router";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    beforeEnter: validationsSession,
    children: [
      {
        path: "users",
        name: "User",
        component: () => import("pages/UserPage.vue"),
        beforeEnter: validationsSession,
      },
      {
        path: "",
        name: "Home",
        component: () => import("pages/IndexPage.vue"),
        beforeEnter: validationsSession,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    beforeEnter: validationNotSession,
    component: () => import("pages/LoginPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
