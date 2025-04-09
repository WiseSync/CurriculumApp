import { createRouter, createWebHistory } from '@ionic/vue-router';
import Meeting from '../views/calendar.vue';
import Device from '../views/device.vue';
import Alignment from '../views/alignment.vue';
import Note from '../views/note.vue';
import Home from '../views/home.vue';
import Login from '../views/login.vue';
import CalendarNote from '../views/calendar_note.vue';
import Schools from '../views/schools.vue';
import account from '../views/account.vue';
import List from '../views/list.vue';

const routes = [
  {
    path: '/',
    redirect: '/calendar'
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Meeting
  },
  {
    path: '/device',
    name: 'Device',
    component: Device
  },
    {
        path: '/alignment/:sessionId(\\d+)',
        name: 'Alignment',
        component: Alignment
    }
    ,
    {
        path: '/note/:sessionId(\\d+)',
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
        path: '/calendar_note',
        name: 'CalendarNote',
        component: CalendarNote
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

export default router
