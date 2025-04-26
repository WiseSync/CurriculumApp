<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
          <ion-title slot="start">帳號管理</ion-title>
          <ion-buttons slot="end">
            <!-- <ion-button @click="openAddAccountModal">
              <ion-icon slot="icon-only" :icon="addIcon"></ion-icon>
            </ion-button> -->
          </ion-buttons>
          <ion-searchbar v-model="searchQuery" placeholder="搜索姓名或ID" slot="start"></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ToggleMenu :content-id="contentId"
    ></ToggleMenu>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
      <ion-content :id="contentId">
        <ion-list>
          <ion-item v-for="(account, index) in filteredAccounts" :key="index">
            <ion-label>
              <h2>{{ account.name }} ({{ account.id }})</h2>
              <p>角色：{{ getRoleName(account.role) }}</p>
              <p>可查看學校：{{ getSchoolsNames(account.schools) }}</p>
              <p>可查看班級：{{ getClassesNames(account.classes) }}</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="openEditAccountModal(index)">
                <ion-icon slot="icon-only" :icon="createIcon"></ion-icon>
              </ion-button>
              <ion-button color="danger" @click="deleteAccount(index)">
                <ion-icon slot="icon-only" :icon="trashIcon"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>
      </ion-content>
  
      <!-- 添加/编辑账户的模态框 -->
      <ion-modal
        :is-open="isModalOpen"
        @didDismiss="closeModal"
        :presenting-element="presentingElement"
      >
          <add-edit-account
            :account="currentAccount"
            :is-edit="isEdit"
            @save="saveAccount"
            @close="closeModal"
          ></add-edit-account>
      </ion-modal>
    </ion-page>
  </template>
  <script setup>
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonModal,
    IonMenuButton,
    IonRouterOutlet
  } from '@ionic/vue';
  import { ref, computed, onMounted } from 'vue';
  import {
    create as createIcon,
    trash as trashIcon,
  } from 'ionicons/icons';
  import AddEditAccount from '../components/add_edit_account.vue';
  import ToggleMenu from '../components/menu.vue';
  
  const accounts = ref([
    // 示例数据
    {
      name: '小明',
      id: 'ming@gmail.com',
      role: 'teacher',
      schools: ['school001'],
      classes: ['class002'],
    },
    {
      name: '小王',
      id: 'wang@gmail.com',
      role: 'student',
      schools: ['school002'],
      classes: ['class001'],
    },
    // 更多账户...
  ]);
  
  const searchQuery = ref('');
  const contentId = 'account-list';
    const accountName = '蘇小鳴';
    const accountType = '管理員';
    const version = '1.0.0';

  const filteredAccounts = computed(() => {
    if (!searchQuery.value) {
      return accounts.value;
    }
    return accounts.value.filter(
      (account) =>
        account.name.includes(searchQuery.value) ||
        account.id.includes(searchQuery.value)
    );
  });
  
  function getRoleName(role) {
    switch (role) {
      case 'admin':
        return '系統管理員';
      case 'researcher':
        return '研究人員';
      case 'teacher':
        return '教師';
      case 'student':
        return '學生';
      default:
        return '未知角色';
    }
  }
  
  // 假设有学校和班级的数据列表
  const schoolsData = ref([
    { id: 'school001', name: '師大附中' },
    { id: 'school002', name: '福和國中' },
    // 更多学校...
  ]);
  
  const classesData = ref([
    { id: 'class001', name: '一年级一班' },
    { id: 'class002', name: '二年级二班' },
    // 更多班级...
  ]);
  
  function getSchoolsNames(schoolIds) {
    return schoolIds
      .map((id) => schoolsData.value.find((school) => school.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }
  
  function getClassesNames(classIds) {
    return classIds
      .map((id) => classesData.value.find((cls) => cls.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }
  
  const isModalOpen = ref(false);
  const isEdit = ref(false);
  const currentAccount = ref(null);
  const currentIndex = ref(null);
  
  function openAddAccountModal() {
    currentAccount.value = {
      name: '',
      id: '',
      role: 'teacher',
      schools: [],
      classes: [],
    };
    isEdit.value = false;
    isModalOpen.value = true;
  }
  
  function openEditAccountModal(index) {
    currentAccount.value = { ...accounts.value[index] };
    currentIndex.value = index;
    isEdit.value = true;
    isModalOpen.value = true;
  }
  
  function closeModal() {
    isModalOpen.value = false;
  }
  
  function saveAccount(account) {
    if (isEdit.value) {
      // 编辑账户
      accounts.value[currentIndex.value] = account;
    } else {
      // 添加新账户
      accounts.value.push(account);
    }
    isModalOpen.value = false;
  }
  
  function deleteAccount(index) {
    accounts.value.splice(index, 1);
  }
  
  const presentingElement = ref(null);
  
  onMounted(() => {
    presentingElement.value = document.querySelector('ion-router-outlet');
  });
  </script>
    <style scoped>
  /* AccountManagement.vue CSS */


  ion-content {
    --background: #ffffff;
  }
  
  ion-list {
    margin-top: 10px;
  }
  
  ion-item {
    --inner-padding-start: 16px;
    --inner-padding-end: 16px;
    --padding-top: 8px;
    --padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  ion-label h2 {
    font-size: 1.125rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
  }
  
  ion-label p {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 2px;
  }
  
  ion-buttons {
    display: flex;
    align-items: center;
  }
  
  ion-button {
    --padding-start: 8px;
    --padding-end: 8px;
  }
  
  ion-icon {
    font-size: 20px;
  }
  </style>