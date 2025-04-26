<template>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>{{ isEdit ? '编辑账户' : '添加账户' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon slot="icon-only" :icon="closeIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label position="stacked">姓名</ion-label>
          <ion-input v-model="accountData.name" placeholder="请输入姓名"></ion-input>
        </ion-item>
  
        <ion-item>
          <ion-label position="stacked">ID</ion-label>
          <ion-input v-model="accountData.id" placeholder="请输入ID"></ion-input>
        </ion-item>
  
        <ion-item>
          <ion-label>角色</ion-label>
          <ion-select v-model="accountData.role" ok-text="确定" cancel-text="取消">
            <ion-select-option value="admin">系统管理员</ion-select-option>
            <ion-select-option value="researcher">研究人员</ion-select-option>
            <ion-select-option value="teacher">教师</ion-select-option>
            <ion-select-option value="student">学生</ion-select-option>
          </ion-select>
        </ion-item>
  
        <ion-item>
          <ion-label>可查看学校</ion-label>
          <ion-select
            v-model="accountData.schools"
            multiple
            ok-text="确定"
            cancel-text="取消"
          >
            <ion-select-option
              v-for="school in schoolsData"
              :key="school.id"
              :value="school.id"
            >
              {{ school.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
  
        <ion-item>
          <ion-label>可查看班级</ion-label>
          <ion-select
            v-model="accountData.classes"
            multiple
            ok-text="确定"
            cancel-text="取消"
          >
            <ion-select-option
              v-for="cls in classesData"
              :key="cls.id"
              :value="cls.id"
            >
              {{ cls.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
  
      <ion-button expand="full" @click="submitAccount">保存</ion-button>
    </ion-content>
  </template>
  <script setup>
  import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  } from '@ionic/vue';
  import { ref, watch } from 'vue';
  import { close as closeIcon } from 'ionicons/icons';
  
  const props = defineProps({
    account: {
      type: Object,
      default: () => ({
        name: '',
        id: '',
        role: 'teacher',
        schools: [],
        classes: [],
      }),
    },
    isEdit: Boolean,
  });
  
  const emits = defineEmits(['save', 'close']);
  
  const accountData = ref({ ...props.account });
  
  watch(
    () => props.account,
    (newVal) => {
      accountData.value = { ...newVal };
    }
  );
  
  // 从父组件传递或导入学校和班级数据
 // import { schoolsData, classesData } from '../views/account.vue';
  
  function submitAccount() {
    emits('save', accountData.value);
  }
  
  function closeModal() {
    emits('close');
  }
  </script>
  <style scoped>
  /* AddEditAccount.vue CSS */

ion-header {
  --background: var(--ion-color-primary);
  color: white;
}

ion-toolbar ion-title {
  color: white;
}

ion-content {
  --background: #ffffff;
  --padding-start: 16px;
  --padding-end: 16px;
}

ion-list {
  margin-top: 20px;
}

ion-item {
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --padding-top: 12px;
  --padding-bottom: 12px;
}

ion-label {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

ion-input,
ion-select {
  font-size: 0.875rem;
  --padding-start: 0;
}

ion-button {
  margin-top: 20px;
}
  </style>