<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="welcome-container">
        <img src="../../assets/logo.png" alt="Logo" class="logo" />
        <h1>AI 課綱學習內容表現對齊分析先導系統</h1>

        <ion-item>
         
          <ion-input label="帳戶名稱" label-placement="floating"  placeholder="輸入帳號" v-model="username" clear-input />
        </ion-item>

        <ion-item>
      
          <ion-input label="密碼" label-placement="floating" placeholder="輸入密碼" type="password" v-model="password" clear-input />
        </ion-item>

        <ion-button expand="block" @click="handleLogin">Login</ion-button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Utils from '../utils/Utils.js';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');

async function handleLogin() {
  error.value = '';
  try {
    const { token } = await Utils.login(username.value, password.value);
    localStorage.setItem('username', username.value);
    localStorage.setItem('token', token);
    router.push('/home');
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo {
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 10px;
}

.error {
  color: red;
  margin-top: 20px;
  text-align: center;
}
</style>
