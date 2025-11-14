<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
          <ion-menu-button aria-label="開啟選單"></ion-menu-button>
        </ion-buttons>
          <ion-title>首頁</ion-title>

        </ion-toolbar>
      </ion-header>
    <ToggleMenu :contentId="contentId"/>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
      <ion-content :id="contentId" role="main" aria-labelledby="page-title">
        <h1 id="page-title" class="visually-hidden">首頁</h1>
        <ion-grid>
            <!--
          <ion-row>

            <ion-col size="6">
              <ion-card role="link" tabindex="0" :aria-labelledby="'course-label'"
                @click="openApp(apps.course.route, {type: 'alignment'})"
                @keydown.enter.prevent="openApp(apps.course.route, {type: 'alignment'})"
                @keydown.space.prevent="openApp(apps.course.route, {type: 'alignment'})">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.course.icon" class="app-icon" aria-hidden="true"></ion-icon>
                  <ion-label class="app-label" :id="'course-label'">{{ apps.course.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
 
            <ion-col size="6">
              <ion-card role="link" tabindex="0" :aria-labelledby="'notes-label'"
                @click="openApp(apps.notes.route, {type: 'notes'})"
                @keydown.enter.prevent="openApp(apps.notes.route, {type: 'notes'})"
                @keydown.space.prevent="openApp(apps.notes.route, {type: 'notes'})">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.notes.icon" class="app-icon" aria-hidden="true"></ion-icon>
                  <ion-label class="app-label" :id="'notes-label'">{{ apps.notes.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        -->
          <ion-row>
            <ion-col size="6">
              <ion-card role="link" tabindex="0" :aria-labelledby="'list-label'"
                @click="openApp(apps.list.route)"
                @keydown.enter.prevent="openApp(apps.list.route)"
                @keydown.space.prevent="openApp(apps.list.route)">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.list.icon" class="app-icon" aria-hidden="true"></ion-icon>
                  <ion-label class="app-label" :id="'list-label'">{{ apps.list.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <!-- 裝置管理 -->
            <ion-col size="6">
              <ion-card role="link" tabindex="0" :aria-labelledby="'device-label'"
                @click="openApp(apps.device.route)"
                @keydown.enter.prevent="openApp(apps.device.route)"
                @keydown.space.prevent="openApp(apps.device.route)">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.device.icon" class="app-icon" aria-hidden="true"></ion-icon>
                  <ion-label class="app-label" :id="'device-label'">{{ apps.device.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <!--
            <ion-col size="6">
              <ion-card role="link" tabindex="0" :aria-labelledby="'classes-label'"
                @click="openApp(apps.classes.route)"
                @keydown.enter.prevent="openApp(apps.classes.route)"
                @keydown.space.prevent="openApp(apps.classes.route)">
                <ion-card-content class="app-card">
                  <ion-icon :icon="apps.classes.icon" class="app-icon" aria-hidden="true"></ion-icon>
                  <ion-label class="app-label" :id="'classes-label'">{{ apps.classes.name }}</ion-label>
                </ion-card-content>
              </ion-card>
            </ion-col>
        -->
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
      name: '設備監控',
      icon: cog,
      route: 'Device',
    },
    course: {
      name: '課程表',
      icon: school,
      route: 'Calendar',
    },
    list: {
      name: '工作佇列',
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
      name: '組織管理',
      icon: people,
      route: 'Schools',
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

  :focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
  }
  ion-card[tabindex]:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
  }

  .visually-hidden {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
    border: 0;
    padding: 0;
    margin: -1px;
  }
  </style>
