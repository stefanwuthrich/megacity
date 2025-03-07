import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../pages/HelloWorld.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router; 