<template>
  <ion-menu side="start" :content-id="contentId" :menu-id="menuId">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>選單</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <!-- 返回首頁 -->
        <ion-item button @click="goHome">
          <ion-icon slot="start" :icon="homeIcon" :alt="returnHomeText" aria-label="returnHomeText"></ion-icon>
          <ion-label role="text">{{ returnHomeText }}</ion-label>
        </ion-item>

        <!-- 使用者資訊 & 登出 -->
        <ion-item v-if="isLoggedIn">
          <ion-icon slot="start" :icon="personIcon"></ion-icon>
          <ion-label>
            <h2>{{ accountName }}</h2>
          </ion-label>
        </ion-item>
        <ion-item v-if="isLoggedIn" button @click="handleLogout">
          <ion-icon slot="start" :icon="logOutIcon"></ion-icon>
          <ion-label>登出</ion-label>
        </ion-item>

        <!-- 版本號 -->
        <ion-item>
          <ion-icon slot="start" :icon="informationIcon" :alt="versionText" aria-label="versionText"></ion-icon>
          <ion-label role="text">{{ versionText + ' : ' + version }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { menuController } from '@ionic/vue';
import {
  home as homeIcon,
  person as personIcon,
  logOut as logOutIcon,
  informationCircle as informationIcon,
} from 'ionicons/icons';
import Utils from '../utils/Utils.js';

const version = ref('1.0.0');
const returnHomeText = ref('返回首頁');
const versionText = ref('版本號');

const props = defineProps({
  contentId: {
    type: String,
    required: true,
  },
  menuId: {
    type: String,
    required: false,
    default: undefined,
  }
});

const router = useRouter();
const username = ref(localStorage.getItem('username') || '');
const token = ref(localStorage.getItem('token') || '');

const isLoggedIn = computed(() => !!token.value);
const accountName = computed(() => username.value);

async function handleLogout() {
  try {
    await Utils.logout(username.value, token.value);
  } catch (_) {
    // ignore errors
  }
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  router.push('/login');
  menuController.close();
}

function goHome() {
  router.push('/home');
  menuController.close();
}
</script>

<style scoped>
ion-menu {
  --width: 250px;
}

ion-item {
  --min-height: 50px;
}
</style>
