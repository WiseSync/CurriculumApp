<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button menu="schoolsCommonMenu" aria-label="開啟選單"></ion-menu-button>
        </ion-buttons>
          <ion-title slot = "start">組織管理</ion-title>

      </ion-toolbar>
      </ion-header>
      <ToggleMenu :content-id="contentId" menu-id="schoolsCommonMenu"></ToggleMenu>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
  
      <ion-content :id="contentId" role="main" aria-labelledby="page-title">
  <h1 id="page-title" class="visually-hidden">組織管理</h1>
  <p id="departments-status" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ departmentsStatus }}</p>
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
        :aria-label="selectedOrganization ? `編輯「${selectedOrganization.name}」` : '編輯（請先選擇）'"
        type="button"
      >
        <ion-icon :icon="createIcon" aria-hidden="true"></ion-icon>
      </ion-button>
      <ion-button
        size="small"
        color="danger"
        :disabled="!selectedOrganizationId"
        @click="deleteOrganization(
          organizations.find(o => o.id === selectedOrganizationId)
        )"
        :aria-label="selectedOrganization ? `刪除「${selectedOrganization.name}」` : '刪除（請先選擇）'"
        type="button"
      >
        <ion-icon :icon="trashIcon" aria-hidden="true"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-item>

  <!-- Department list -->
  <ion-item lines="none">
    <ion-label position="stacked">班級/部門</ion-label>
    <ion-searchbar
      v-model="searchQuery"
      placeholder="搜尋班級/部門"
      aria-label="搜尋班級/部門"
      inputmode="search"
      enterkeyhint="search"
      debounce="300"
      :aria-controls="'departments-list'"
      aria-describedby="departments-status"
    ></ion-searchbar>
  </ion-item>

  <ion-list id="departments-list" role="list" :aria-describedby="'departments-status'">
    <ion-item
      v-for="dep in filteredDepartments"
      :key="dep.id"
      role="listitem"
      :aria-labelledby="`dep-${dep.id}-label`"
    >
      <ion-label :id="`dep-${dep.id}-label`">{{ dep.name }}</ion-label>
      <ion-buttons slot="end">
        <ion-button size="small" @click="editDepartment(dep)" :aria-label="`編輯「${dep.name}」`" type="button">
          <ion-icon :icon="createIcon" aria-hidden="true"></ion-icon>
        </ion-button>
        <ion-button size="small" color="danger" @click="deleteDepartment(dep)" :aria-label="`刪除「${dep.name}」`" type="button">
          <ion-icon :icon="trashIcon" aria-hidden="true"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-item>
  </ion-list>

  <!-- FAB for adding department -->
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button aria-label="新增">
      <ion-icon :icon="addIcon" aria-hidden="true"></ion-icon>
    </ion-fab-button>

    <ion-fab-list side="top">
      <ion-fab-button @click="addOrganization" aria-label="新增學校/組織">
        <ion-icon :icon="businessIcon" aria-hidden="true"></ion-icon>
      </ion-fab-button>
      <ion-fab-button :disabled="!selectedOrganizationId" @click="addDepartment" :aria-label="selectedOrganization ? '新增班級/部門' : '新增班級/部門（請先選擇學校/組織）'">
        <ion-icon :icon="peopleIcon" aria-hidden="true"></ion-icon>
      </ion-fab-button>
    </ion-fab-list>
  </ion-fab>
  <!-- Loading Spinner -->
  <div v-if="showLoading" style="text-align:center;margin-top:2rem;" role="status" aria-live="polite" aria-atomic="true">
    <ion-spinner name="crescent" aria-hidden="true"></ion-spinner>
    <span class="visually-hidden">資料載入中…</span>
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
const departmentsStatus = computed(() =>
  filteredDepartments.value.length ? `共 ${filteredDepartments.value.length} 個班級/部門` : '無符合結果'
);
const selectedOrganization = computed(() =>
  organizations.value.find(o => o.id === selectedOrganizationId.value) || null
);

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

:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}

.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
}
    </style>
