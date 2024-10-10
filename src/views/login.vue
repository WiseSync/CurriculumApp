<template>
    <ion-page>
      <ion-content class="ion-padding">
        <div class="welcome-container">
          <img src="../../assets/logo.png" alt="Logo" class="logo" />
          <h1>歡迎使用智慧課綱匹配平台</h1>
          <p style="margin-bottom: 0.25rem;">請選擇登錄方式：</p>
          <ion-button expand="block" color="primary" @click="signInWithTaipeiSSO">
            <ion-icon :icon="schoolIcon" slot="start"></ion-icon>
            台北市校園單一驗證服務登錄
          </ion-button>
          <ion-button expand="block" color="secondary" @click="signInWithGoogle">
            <ion-icon :icon="logoGoogle" slot="start"></ion-icon>
            Google 登錄
          </ion-button>
          <ion-button expand="block" color="tertiary" @click="signInWithFacebook">
            <ion-icon :icon="logoFacebook" slot="start"></ion-icon>
            Facebook 登錄
          </ion-button>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
  } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  import { logoGoogle, logoFacebook, schoolOutline as schoolIcon } from 'ionicons/icons';
  
  //import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
  //import { FacebookLogin } from '@rdlabo/capacitor-facebook-login';
  
  const router = useRouter();
  
  function signInWithGoogle() {
    /*
    GoogleAuth.signIn().then(user => {
      console.log('Google 用户信息：', user);
      // 在此处处理登录逻辑，例如保存用户信息，导航到主页面等
      router.push('/home');
    }).catch(error => {
      console.error('Google 登录错误：', error);
    });*/
  }
  
  function signInWithFacebook() {
    /*
    FacebookLogin.login({ permissions: ['email', 'public_profile'] }).then(result => {
      if (result.accessToken) {
        console.log('Facebook 访问令牌：', result.accessToken);
        // 在此处处理登录逻辑，例如获取用户信息，导航到主页面等
        router.push('/home');
      } else {
        console.log('Facebook 登录已取消');
      }
    }).catch(error => {
      console.error('Facebook 登录错误：', error);
    });*/
  }
  
  function signInWithTaipeiSSO() {
    // 实现台北市校园单一验证服务的登录逻辑
    // 需要根据官方文档集成
    alert('台北市校园单一验证服务登录功能待实现');
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
  
  p {
    margin-bottom: 30px;
  }
  </style>