<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="deviceCommonMenu" aria-label="開啟選單"></ion-menu-button>
        </ion-buttons>
        <ion-title slot="start">設備監控</ion-title>

        <ion-select
          label-placement="stacked"
          label="學校"
          value="near"
          slot="end"
          class="DeviceCommonSelectOption"
        >
          <ion-icon slot="start" :icon="business" aria-hidden="true"></ion-icon>
          <ion-select-option value="near">國家教育研究院</ion-select-option>
        </ion-select>
        <ion-select
          label-placement="stacked"
          label="狀態"
          v-model="selectedStatus"
          slot="end"
          class="DeviceCommonSelectOption DeviceStatsOption"
        >
          <ion-icon slot="start" :icon="statsChart" aria-hidden="true"></ion-icon>
          <ion-select-option value="all">全部</ion-select-option>
          <ion-select-option value="offline">離線中</ion-select-option>
          <ion-select-option value="idle">待機中</ion-select-option>
        </ion-select>
      </ion-toolbar>
    </ion-header>
    <ToggleMenu :content-id="contentId" menu-id="deviceCommonMenu" />
    <ion-router-outlet :id="contentId"></ion-router-outlet>
    <ion-content :id="contentId" role="main" aria-labelledby="page-title">
      <h1 id="page-title" class="visually-hidden">設備監控</h1>
      <p id="devices-status" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ devicesStatus }}</p>
      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            size-md="2"
            v-for="device in visibleDevices"
            :key="device.id"
          >
            <ion-card role="link" tabindex="0"
              :aria-labelledby="`device-${device.id}-title`"
              :aria-describedby="`device-${device.id}-subtitle device-${device.id}-status`"
              @click="goToDeviceDetail(device)"
              @keydown.enter.prevent="goToDeviceDetail(device)"
              @keydown.space.prevent="goToDeviceDetail(device)">
              <ion-card-header>
                <ion-avatar>
                  <ion-icon
                    :icon="device.icon"
                    size="large"
                    class="device-ion-icon"
                    aria-hidden="true"
                  ></ion-icon>
                </ion-avatar>
                <ion-card-title :id="`device-${device.id}-title`">{{ device.name }}</ion-card-title>
                <ion-card-subtitle :id="`device-${device.id}-subtitle`">{{ device.school }} - {{ device.class }}</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-badge :color="getStatusColor(device.status)" :id="`device-${device.id}-status`" :aria-label="`狀態：${getStatusName(device.status)}`">
                  {{ getStatusName(device.status) }}
                </ion-badge>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onIonViewDidEnter, onIonViewWillLeave } from '@ionic/vue';
import AppConfig from '../app_config';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonBadge,
  IonIcon,
  IonSelectOption,
  IonSelect,
  IonButtons,
  IonMenuButton,
  IonRouterOutlet
} from '@ionic/vue';
import { hardwareChip } from 'ionicons/icons';
import { business, statsChart } from 'ionicons/icons';
import ToggleMenu from '@/components/menu.vue';

const contentId = ref('device-content');
const selectedStatus = ref('all');
const devices = ref([]);
let refreshTimer = null;
const baseApiUrl = AppConfig.ServiceUrl;

const visibleDevices = computed(() =>
  selectedStatus.value === 'all'
    ? devices.value
    : devices.value.filter(device => device.status === selectedStatus.value)
);

const devicesStatus = computed(() =>
  visibleDevices.value.length ? `共 ${visibleDevices.value.length} 台裝置` : '無裝置'
);

function mapStatus(code, updateDate) {
  const now = Date.now();
  const tzOffsetInMs = new Date().getTimezoneOffset() * 60000
  const last = new Date(updateDate).getTime()-tzOffsetInMs;
  //console.log(now-last);
  if (now - last > 45000) {
    return 'offline';
  }
  switch (code) {
    case 0:
      return 'idle';
    case 1:
      return 'recording';
    case 2:
      return 'offline';
    case 3:
      return 'malfunction';
    default:
      return 'idle';
  }
}

async function fetchDevices() {
  try {
    const resp = await fetch(`${baseApiUrl}/devices`);
    const data = await resp.json();
    devices.value = data.map(d => ({
      id: d.id,
      icon: hardwareChip,
      name: d.id,
      school: d.departmentName || '',
      class: d.organizationName || '',
      status: mapStatus(d.status, d.updateDate)
    }));
  } catch (err) {
    console.error('Failed to fetch devices', err);
  }
}

onIonViewDidEnter(() => {
  fetchDevices();
  refreshTimer = setInterval(fetchDevices, 15000);
});

onIonViewWillLeave(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});

function getStatusName(status) {
  switch (status) {
    case 'idle':
      return '待機中';
    case 'recording':
      return '錄製中';
    case 'offline':
      return '離線中';
    case 'malfunction':
      return '故障';
    default:
      return status;
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'idle':
      return 'medium';
    case 'recording':
      return 'success';
    case 'offline':
      return 'warning';
    case 'malfunction':
      return 'danger';
    default:
      return 'medium';
  }
}

function filterDevices() {
  if (selectedStatus.value === 'all') {
    return devices.value;
  }
  return devices.value.filter(device => device.status === selectedStatus.value);
}

function goToDeviceDetail(device) {
  console.log('Navigating to device detail:', device);
}
</script>

<style scoped>
ion-card {
  --ion-card-background: var(--ion-color-light);
}

ion-avatar {
  margin: 0 auto;
  margin-top: 16px;
  background-color: var(--ion-color-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
}

.device-ion-icon {
  color: var(--ion-color-primary);
  font-size: 48px;
}

ion-card-title,
ion-card-subtitle {
  text-align: center;
}

ion-badge {
  margin-top: 8px;
  display: block;
  text-align: center;
}

.DeviceCommonSelectOption {
  margin-left: 5rem;
  width: 10.5rem;
}
.DeviceStatsOption {
  width: 6.25rem;
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
