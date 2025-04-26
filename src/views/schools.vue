<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
          <ion-title slot = "start">學校/班級管理</ion-title>
          <h1 style="visibility:hidden;display: none;">學校/班級管理</h1>
          <!-- <ion-buttons slot="end">
            <ion-button @click="openAddSchoolModal">
              <ion-icon slot="icon-only" :icon="addIcon"></ion-icon>
            </ion-button>
          </ion-buttons> -->
          <ion-searchbar v-model="searchQuery" placeholder="搜索學校" slot ="start"></ion-searchbar>
        </ion-toolbar>
      </ion-header>
      <ToggleMenu
      :content-id="contentId"
      :account-name="accountName"
      :account-type="accountType"
      :version="version"
    ></ToggleMenu>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
  
      <ion-content :id="contentId">
        <ion-list>
          <ion-item v-for="(school, index) in filteredSchools" :key="index">
            <ion-label>
              <h2>{{ school.name }}</h2>
              <p>{{ getCategoryName(school.category) }}</p>
              <p>班級列表: {{ school.classes.join(', ') }}</p>
            </ion-label>
            <ion-buttons slot="end">
              <ion-button @click="openEditSchoolModal(index)">
                <ion-icon slot="icon-only" :icon="createIcon"></ion-icon>
              </ion-button>
              <ion-button color="danger" @click="deleteSchool(index)">
                <ion-icon slot="icon-only" :icon="trashIcon"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>
        <ion-fab  slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="openAddSchoolModal">
                <ion-icon :icon="addIcon"></ion-icon>
                </ion-fab-button>
            </ion-fab>
      </ion-content>
  
      <!-- 添加/编辑学校的模态框 -->
      <ion-modal :is-open="isModalOpen" @did-dismiss="closeModal">
        <add-edit-school
          :school="currentSchool"
          :is-edit="isEdit"
          @save="saveSchool"
          @close="closeModal"
        ></add-edit-school>
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
    IonRouterOutlet,
    IonFab,
    IonFabButton
  } from '@ionic/vue';
  import { ref, computed } from 'vue';
  import { add as addIcon, create as createIcon, trash as trashIcon} from 'ionicons/icons';
  import AddEditSchool from '../components/add_edit_school.vue';
  import ToggleMenu from '../components/menu.vue';

  const contentId = 'school-list';
    const accountName = '蘇小鳴';
    const accountType = '管理員';
    const version = '1.0.0';

  
  const schools = ref([
    // 示例数据
    {
      name: '師大附中',
      category: 3,
      classes: ['一年一班', '一年二班'],
    },
    {
      name: '福和國中',
      category: 2,
      classes: ['二年一班', '三年二班'],
    },
    // 更多学校...
  ]);
  
  const searchQuery = ref('');
  
  const filteredSchools = computed(() => {
    if (!searchQuery.value) {
      return schools.value;
    }
    return schools.value.filter((school) =>
      school.name.includes(searchQuery.value)
    );
  });
  
  function getCategoryName(category) {
    switch (category) {
      case 1:
        return '小學';
      case 2:
        return '國中';
      case 3:
        return '高中';
      default:
        return '其它';
    }
  }
  
  const isModalOpen = ref(false);
  const isEdit = ref(false);
  const currentSchool = ref(null);
  const currentIndex = ref(null);

  //currentSchool.value = schools.value[0];
  function openAddSchoolModal() {
    currentSchool.value = {
      name: '',
      category: 1,
      classes: [],
    };
    isEdit.value = false;
    isModalOpen.value = true;
  }
  
  function openEditSchoolModal(index) {
    currentSchool.value = { ...schools.value[index] };
    currentIndex.value = index;
    isEdit.value = true;
    isModalOpen.value = true;
  }
  
  function closeModal() {
    isModalOpen.value = false;
  }
  
  function saveSchool(school) {
    if (isEdit.value) {
      // 编辑学校
      schools.value[currentIndex.value] = school;
    } else {
      // 添加新学校
      schools.value.push(school);
    }
    isModalOpen.value = false;
  }
  
  function deleteSchool(index) {
    schools.value.splice(index, 1);
  }
  </script>
    <style scoped>
    /* SchoolList.vue CSS */

ion-header {
  --background: var(--ion-color-primary);
  color: white;
}



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