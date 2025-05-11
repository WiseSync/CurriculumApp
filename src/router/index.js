import { createRouter, createWebHistory } from '@ionic/vue-router';
import Device from '../views/device.vue';
import Meeting from '../views/calendar.vue';
import Note from '../views/note.vue';
import Home from '../views/home.vue';
import Login from '../views/login.vue';
import Schools from '../views/schools.vue';
import account from '../views/account.vue';
import List from '../views/list.vue';
import Utils from '../utils/Utils';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/calendar/:type',
    name: 'Calendar',
    component: Meeting
  },
  {
    path: '/device',
    name: 'Device',
    component: Device
  },
    {
        path: '/note/:sessionId(\\d+)/:type',
        name: 'Note',
        component: Note
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/schools',
        name: 'Schools',
        component: Schools
    },
    {
        path: '/account',
        name: 'account',
        component: account
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  if (!isLoggedIn && to.name !== 'Login') {
    next({ name: 'Login' });
  } else {
    next();
  }
});

const isLoggedIn = !!localStorage.getItem('token');
if (isLoggedIn) {
  Utils.authenticate(localStorage.getItem('username'), localStorage.getItem('token'))
    .then(() => {
      console.log('User authenticated');
    })
    .catch((error) => {
      console.error('Authentication failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      router.push({ name: 'Login' });
    });
}

export default router
