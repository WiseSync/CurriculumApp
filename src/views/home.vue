<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
          <ion-title>首頁</ion-title>
        </ion-toolbar>
      </ion-header>
    <ToggleMenu :contentId="contentId"/>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
      <ion-content :id="contentId">
        <ion-grid>
          <ion-row>
            <!-- 課表 -->
            <ion-col size="6">
              <ion-card @click="openApp('course')">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.course.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.course.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <!-- 课程笔记 -->
          <ion-col size="6">
              <ion-card @click="openApp('list')">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.list.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.list.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
          <ion-row>
            <!-- 装置管理 -->
            <ion-col size="6">
              <ion-card @click="openApp('device')" disabled="true">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.device.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.device.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <!-- 帐号管理 -->
            <ion-col size="6">
              <ion-card @click="openApp('account')"  disabled="true">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.account.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.account.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>

            <ion-col size="6">
              <ion-card @click="openApp('account')" disabled="true">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.classes.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.classes.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-page>
  </template>
  <script setup>
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
    IonLabel,
    IonButtons,
    IonRouterOutlet,
    IonMenuButton
  } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  // 导入图标
  import { cog, school, book, personCircle, people, list } from 'ionicons/icons';
  import ToggleMenu from '@/components/menu.vue';

  const contentId = 'home-content';
  const router = useRouter();
  
  const apps = {
    device: {
      name: '装置管理',
      icon: cog,
      route: '/device',
    },
    course: {
      name: '课程表',
      icon: school,
      route: '/calendar',
    },
    list: {
      name: '對齊佇列',
      icon: list,
      route: '/list',
    },
    notes: {
      name: '課程筆記',
      icon: book,
      route: '/calendar',
    },
    account: {
      name: '帳號管理',
      icon: personCircle,
      route: '/account',
    },
    classes: {
      name: '班級管理',
      icon: people,
      route: '/class',
    },
  };
  
  function openApp(appKey) {
    const app = apps[appKey];
    if (app && app.route) {
      router.push(app.route);
    }
  }
  </script>
  <style scoped>
  .app-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  .app-icon {
    font-size: 3rem;
    color: var(--ion-color-primary);
  }
  
  .app-label {
    margin-top: 8px;
    font-size: 1rem;
    color: var(--ion-color-dark);
  }
  </style>