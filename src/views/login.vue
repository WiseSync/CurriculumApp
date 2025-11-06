<template>
  <ion-page>
    <ion-content class="ion-padding" role="main" aria-labelledby="page-title">
      <div class="welcome-container">
        <img src="../../assets/logo.png" alt="" class="logo" aria-hidden="true" />
        <h1 id="page-title">AI 課綱學習內容表現對齊分析先導系統</h1>

        <form @submit.prevent="handleLogin" novalidate aria-describedby="form-error">
          <ion-item>
         
          <ion-input label="帳戶名稱" label-placement="floating" placeholder="輸入帳號" v-model="username" clear-input name="username" autocomplete="username" inputmode="text" autocapitalize="none" spellcheck="false" required :aria-invalid="error ? 'true' : 'false'" aria-describedby="form-error" />
        </ion-item>

        <ion-item>
      
          <ion-input label="密碼" label-placement="floating" placeholder="輸入密碼" type="password" v-model="password" clear-input name="current-password" autocomplete="current-password" required :aria-invalid="error ? 'true' : 'false'" aria-describedby="form-error" />
        </ion-item>

        <ion-button expand="block" type="submit">登入</ion-button>
        <p v-if="error" id="form-error" class="error" role="alert" aria-live="assertive" aria-atomic="true" tabindex="-1" ref="errorRef">{{ error }}</p>
        </form>
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
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Utils from '../utils/Utils.js';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const errorRef = ref(null);

async function handleLogin() {
  error.value = '';
  try {
    const { token } = await Utils.login(username.value, password.value);
    localStorage.setItem('username', username.value);
    localStorage.setItem('token', token);
    router.push('/home');
  } catch (e) {
    error.value = e?.message || '帳號或密碼不正確';
    await nextTick();
    if (errorRef.value) errorRef.value.focus();
  }
}
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.logo {
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 10px;
}

:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}

.error {
  color: #b00020;
  margin-top: 20px;
  text-align: center;
}
</style>
