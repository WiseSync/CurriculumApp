<template>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>{{ isEdit ? '編輯學校' : '添加學校' }}</ion-title>
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
          <ion-label position="stacked">學校名稱</ion-label>
          <ion-input v-model="schoolData.name" placeholder="請輸入學校名稱"></ion-input>
        </ion-item>
  
        <ion-item>
          <ion-label>類別</ion-label>
          <ion-select v-model="schoolData.category" ok-text="確定" cancel-text="取消">
            <ion-select-option value="1">小學</ion-select-option>
            <ion-select-option value="2">國中</ion-select-option>
            <ion-select-option value="3">高中</ion-select-option>
          </ion-select>
        </ion-item>
  
        <ion-item>
          <ion-label position="stacked">班級列表（逗號分隔）</ion-label>
          <ion-textarea
            v-model="classesInput"
            placeholder="請輸入班級列表，例如：一年級一班，二年級二班""
          ></ion-textarea>
        </ion-item>
      </ion-list>
  
      <ion-button expand="full" @click="submitSchool">保存</ion-button>
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
    IonTextarea,
  } from '@ionic/vue';
  import { ref, watch } from 'vue';
  import { close as closeIcon } from 'ionicons/icons';
  
  const props = defineProps(['is-edit', 'school']);
  
  const emits = defineEmits(['save', 'close']);
 //const schoolData = ref({name: '', category: 1, classes: []});
  
    const schoolData = ref({ ...props.school });
    const classesInput = ref(schoolData.value.classes.join(', '));
  
    watch(
     () => props.school,
      (newVal) => {
        schoolData.value = { ...newVal };
        classesInput.value = schoolData.value.classes.join(', ');
     }
    );
  
  function submitSchool() {
    // 更新班级列表
    schoolData.value.classes = classesInput.value
      .split(',')
      .map((className) => className.trim())
      .filter((className) => className !== '');
  
    emits('save', schoolData.value);
  }
  
  function closeModal() {
    emits('close');
  }
  </script>
    <style scoped>
    /* AddEditSchool.vue CSS */

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
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

ion-input,
ion-select,
ion-textarea {
  font-size: 14px;
  --padding-start: 0;
}

ion-button {
  margin-top: 20px;
}
    </style>