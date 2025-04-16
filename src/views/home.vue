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
              <ion-card @click="openApp(apps.course.route, {type: 'alignment'})">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.course.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.course.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <!-- 课程笔记 -->
            <ion-col size="6">
              <ion-card @click="openApp(apps.notes.route, {type: 'notes'})">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.notes.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.notes.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="6">
              <ion-card @click="openApp(apps.list.route)">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.list.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.list.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <!-- 装置管理 -->
            <ion-col size="6">
              <ion-card @click="openApp(apps.device.route)">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.device.icon" class="app-icon"></ion-icon>
                  <ion-label class="app-label">{{ apps.device.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
          <ion-row>
            <!--  Class Management -->
            <ion-col size="6">
              <ion-card @click="openApp(apps.classes.route)" disabled="true">
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
      route: 'Device',
    },
    course: {
      name: '课程表',
      icon: school,
      route: 'Calendar',
    },
    list: {
      name: '對齊進度',
      icon: list,
      route: 'List',
    },
    notes: {
      name: '課程筆記',
      icon: book,
      route: 'Calendar',
    },
    account: {
      name: '帳號管理',
      icon: personCircle,
      route: 'Account',
    },
    classes: {
      name: '班級管理',
      icon: people,
      route: 'Class',
    },
  };
  
  function openApp(appKey, props={}) {
    router.push({name: appKey, params:props});
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

  .app-card:hover {
    background-color: var(--ion-color-light);
    cursor: pointer;
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