<template>
    <ion-menu side="start" :content-id="contentId">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>選單</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <!-- 返回首页 -->
          <ion-item button @click="goHome">
            <ion-icon slot="start" :icon="homeIcon" :alt="returnHomeText" :aria-label="returnHomeText"></ion-icon>
            <ion-label role="text">{{returnHomeText}}</ion-label>
          </ion-item>
          
          <!--
          <ion-item>
            <ion-icon slot="start" :icon="personIcon"></ion-icon>
            <ion-label>
              <h2>{{ accountName }}</h2>
              <p>{{ accountTypeName }}</p>
            </ion-label>
          </ion-item>
  
          <ion-item button @click="logout">
            <ion-icon slot="start" :icon="logOutIcon"></ion-icon>
            <ion-label>登出</ion-label>
          </ion-item>
          -->
          <!-- 版本号 -->
          <ion-item>
            <ion-icon slot="start" :icon="informationIcon" :alt="versionText" aria-label="versionText"></ion-icon>
            <ion-label role="text">{{ versionText+" : "+version }}</ion-label>
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

  //const accountName = ref('使用者名稱'); // 使用者名稱{
  //const accountType = ref('admin'); // 使用者類型
  const version = ref('1.0.0'); // 版本號
  const returnHomeText = ref('返回首頁'); // 返回首页的文字
  const versionText = ref('版本號'); // 版本号的文字
  
  // 接收父组件传递的属性
  const props = defineProps({
    contentId: {
      type: String,
      required: true,
    }
  });
  
  const router = useRouter();
  
  // 计算帐号类型的名称
  const accountTypeName = computed(() => {
    switch (props.accountType) {
      case 'admin':
        return '系統管理員';
      case 'researcher':
        return '研究人員';
      case 'teacher':
        return '教師';
      case 'student':
        return '學生';
      default:
        return '未知類型';
    }
  });
  
  // 返回首页
  function goHome() {
    router.push('/home');
    menuController.close();
  }
  
  // 登出
  function logout() {
    // 在此处执行登出逻辑，例如清除身份验证令牌等
    alert('您已成功登出');
    router.push('/login');
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