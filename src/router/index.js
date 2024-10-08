import { createRouter, createWebHistory } from '@ionic/vue-router';
import Meeting from '../views/calendar.vue';
import Device from '../views/device.vue';

const routes = [
  {
    path: '/',
    redirect: '/calendar'
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Meeting//HomePage
  },
  {
    path: '/device',
    name: 'Device',
    component: Device//HomePage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
