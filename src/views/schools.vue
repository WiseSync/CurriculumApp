<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button menu="schoolsCommonMenu"></ion-menu-button>
        </ion-buttons>
          <ion-title slot = "start">組織管理</ion-title>
          <h1 style="visibility:hidden;display: none;">組織管理</h1>
      </ion-toolbar>
      </ion-header>
      <ToggleMenu :content-id="contentId" menu-id="schoolsCommonMenu"></ToggleMenu>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
  
      <ion-content :id="contentId">
  <!-- Organization selector -->
  <ion-item lines="full">
    <ion-label>學校/組織</ion-label>
    <ion-select
      :value="selectedOrganizationId"
      @ionChange="onOrganizationChange($event.detail.value)"
      interface="popover"
      :disabled="!organizations.length"
    >
      <ion-select-option
        v-for="org in organizations"
        :key="org.id"
        :value="org.id"
      >
        {{ org.name }}
      </ion-select-option>
    </ion-select>

    <ion-buttons slot="end">
      <ion-button
        size="small"
        :disabled="!selectedOrganizationId"
        @click="editOrganization(
          organizations.find(o => o.id === selectedOrganizationId)
        )"
      >
        <ion-icon :icon="createIcon"></ion-icon>
      </ion-button>
      <ion-button
        size="small"
        color="danger"
        :disabled="!selectedOrganizationId"
        @click="deleteOrganization(
          organizations.find(o => o.id === selectedOrganizationId)
        )"
      >
        <ion-icon :icon="trashIcon"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>

  <!-- Department list -->
  <ion-item lines="none">
    <ion-label position="stacked">班級/部門</ion-label>
    <ion-searchbar
      v-model="searchQuery"
      placeholder="搜尋班級"
      debounce="300"
    ></ion-searchbar>
  </ion-item>

  <ion-list>
    <ion-item
      v-for="dep in filteredDepartments"
      :key="dep.id"
    >
      <ion-label>{{ dep.name }}</ion-label>
      <ion-buttons slot="end">
        <ion-button size="small" @click="editDepartment(dep)">
          <ion-icon :icon="createIcon"></ion-icon>
        </ion-button>
        <ion-button size="small" color="danger" @click="deleteDepartment(dep)">
          <ion-icon :icon="trashIcon"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
  </ion-list>

  <!-- FAB for adding department -->
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon :icon="addIcon"></ion-icon>
    </ion-fab-button>

    <ion-fab-list side="top">
      <ion-fab-button @click="addOrganization">
        <ion-icon :icon="businessIcon"></ion-icon>
      </ion-fab-button>
      <ion-fab-button :disabled="!selectedOrganizationId" @click="addDepartment">
        <ion-icon :icon="peopleIcon"></ion-icon>
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
  <!-- Loading Spinner -->
  <div v-if="showLoading" style="text-align:center;margin-top:2rem;">
    <ion-spinner name="crescent"></ion-spinner>
  </div>
</ion-content>
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
  IonMenuButton,
  IonRouterOutlet,
  IonSelect,
  IonSelectOption,
  IonFabList,
  IonFab,
  IonFabButton,
  alertController,
  IonSpinner, onIonViewDidEnter 
} from '@ionic/vue';
import { ref, computed} from 'vue';
import {
  add as addIcon,
  create as createIcon,
  trash as trashIcon,
  business as businessIcon,
  people as peopleIcon
} from 'ionicons/icons';
import ToggleMenu from '../components/menu.vue';
import AppConfig from '../app_config';

const baseApiUrl = AppConfig.ServiceUrl;

const contentId = 'school-list';

/* ----------------- reactive states ----------------- */
const organizations = ref([]);            // [{id,name}]
const departments = ref([]);              // [{id,name}]
const selectedOrganizationId = ref(null);
const selectedDepartmentId = ref(null);

const showLoading = ref(false);
const searchQuery = ref('');

/* ----------------- computed ----------------- */
const filteredDepartments = computed(() => {
  if (!searchQuery.value) return departments.value;
  return departments.value.filter(d => d.name.includes(searchQuery.value));
});

/* ----------------- lifecycle ----------------- */
onIonViewDidEnter(() => {
  loadOrganizations();
});

/* ----------------- fetch helpers ----------------- */
async function loadOrganizations() {
  showLoading.value = true;
  try {
    const resp = await fetch(`${baseApiUrl}/organizations`);
    if (!resp.ok) {
      console.error('Failed to load organizations');
      return;
    }
    const data = await resp.json();
    organizations.value = data;          // [{id,name}]
    if (organizations.value.length) {
      selectedOrganizationId.value = organizations.value[0].id;
      await loadDepartments(selectedOrganizationId.value);
    }
  } catch (e) {
    console.error('Error loading organizations', e);
  } finally {
    showLoading.value = false;
  }
}

async function loadDepartments(orgId) {
  if (!orgId) return;
  showLoading.value = true;
  try {
    const resp = await fetch(`${baseApiUrl}/organizations/${orgId}/departments`);
    if (!resp.ok) {
      console.error('Failed to load departments');
      return;
    }
    const data = await resp.json();
    departments.value = data;           // [{id,name}]
    selectedDepartmentId.value = departments.value.length
      ? departments.value[0].id
      : null;
  } catch (e) {
    console.error('Error loading departments', e);
  } finally {
    showLoading.value = false;
  }
}

/* ----------------- CRUD – Organization ----------------- */
async function addOrganization() {
  const alert = await alertController.create({
    header: '新增學校/組織',
    inputs: [{ name: 'name', type: 'text', placeholder: '學校/組織名稱' }],
    buttons: [
      { text: '取消', role: 'cancel' },
      {
        text: '確定',
        handler: async data => {
          if (!data.name) return false;
          showLoading.value = true;
          try {
            const resp = await fetch(`${baseApiUrl}/organizations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: data.name })
            });
            if (resp.ok) await loadOrganizations();
          } finally {
            showLoading.value = false;
          }
        }
      }
    ]
  });
  await alert.present();
}

async function editOrganization(org) {
  const alert = await alertController.create({
    header: '修改學校/組織名稱',
    inputs: [{ name: 'name', type: 'text', value: org.name }],
    buttons: [
      { text: '取消', role: 'cancel' },
      {
        text: '儲存',
        handler: async data => {
          if (!data.name) return false;
          showLoading.value = true;
          try {
            await fetch(`${baseApiUrl}/organizations/${org.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: data.name })
            });
            await loadOrganizations();
          } finally {
            showLoading.value = false;
          }
        }
      }
    ]
  });
  await alert.present();
}

async function deleteOrganization(org) {
  const alert = await alertController.create({
    header: `刪除「${org.name}」？`,
    message: '此動作會一併刪除底下所有班級/部門，確定執行？',
    buttons: [
      { text: '取消', role: 'cancel' },
      {
        text: '刪除',
        role: 'destructive',
        handler: async () => {
          showLoading.value = true;
          try {
            await fetch(`${baseApiUrl}/organizations/${org.id}`, {
              method: 'DELETE'
            });
            await loadOrganizations();
          } finally {
            showLoading.value = false;
          }
        }
      }
    ]
  });
  await alert.present();
}

/* ----------------- CRUD – Department ----------------- */
async function addDepartment() {
  if (!selectedOrganizationId.value) return;
  const alert = await alertController.create({
    header: '新增班級/部門',
    inputs: [{ name: 'name', type: 'text', placeholder: '班級/部門名稱' }],
    buttons: [
      { text: '取消', role: 'cancel' },
      {
        text: '確定',
        handler: async data => {
          if (!data.name) return false;
          showLoading.value = true;
          try {
            await fetch(
              `${baseApiUrl}/organizations/${selectedOrganizationId.value}/departments`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: data.name })
              }
            );
            await loadDepartments(selectedOrganizationId.value);
          } finally {
            showLoading.value = false;
          }
        }
      }
    ]
  });
  await alert.present();
}

async function editDepartment(dep) {
  const alert = await alertController.create({
    header: '修改班級/部門名稱',
    inputs: [{ name: 'name', type: 'text', value: dep.name }],
    buttons: [
      { text: '取消', role: 'cancel' },
      {
        text: '儲存',
        handler: async data => {
          if (!data.name) return false;
          showLoading.value = true;
          try {
            await fetch(`${baseApiUrl}/departments/${dep.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: data.name })
            });
            await loadDepartments(selectedOrganizationId.value);
          } finally {
            showLoading.value = false;
          }
        }
      }
    ]
  });
  await alert.present();
}

async function deleteDepartment(dep) {
  const alert = await alertController.create({
    header: `刪除「${dep.name}」？`,
    message: '此動作會一併刪除底下所有課程，確定執行？',
    buttons: [
      { text: '取消', role: 'cancel' },
      {
        text: '刪除',
        role: 'destructive',
        handler: async () => {
          showLoading.value = true;
          try {
            await fetch(`${baseApiUrl}/departments/${dep.id}`, {
              method: 'DELETE'
            });
            await loadDepartments(selectedOrganizationId.value);
          } finally {
            showLoading.value = false;
          }
        }
      }
    ]
  });
  await alert.present();
}

/* ----------------- handlers ----------------- */
async function onOrganizationChange(val) {
  selectedOrganizationId.value = val;
  await loadDepartments(val);
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