import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue';
import CyberDiceView from '@/views/CyberDiceView.vue';
import CyberMailView from '@/views/CyberMailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cyber-dice',
      name: 'cyber-dice',
      component: CyberDiceView,
    },
  ],
})

export default router 
