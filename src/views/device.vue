<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
          <ion-title slot="start">裝置管理</ion-title>
          <ion-select label-placement="stacked" label="學校" value="all" slot="end" class="DeviceCommonSelectOption">
                    <ion-icon slot="start" :icon="business" aria-hidden="true"></ion-icon>
                    <ion-select-option value="all">全部</ion-select-option>
                    <ion-select-option value="school001">師大附中</ion-select-option>
                    <ion-select-option value="school002">永平高中</ion-select-option>
                </ion-select>
                <ion-select label-placement="stacked" label="狀態" value="all" slot="end" class="DeviceCommonSelectOption DeviceStatsOption">
                    <ion-icon slot="start" :icon="statsChart" aria-hidden="true"></ion-icon>
                    <ion-select-option value="all">全部</ion-select-option>
                    <ion-select-option value="device001">離線中</ion-select-option>
                    <ion-select-option value="device001">待機中</ion-select-option>
                </ion-select>
        </ion-toolbar>
      </ion-header>
      <ToggleMenu
      :content-id="contentId"
      :account-name="accountName"
      :account-type="accountType"
      :version="version"
    ></ToggleMenu>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
      <ion-content>
        <ion-grid>
          <ion-row>
            <ion-col
              size="6"
              size-md="2"
              v-for="device in devices"
              :key="device.id"
            >
              <ion-card @click="goToDeviceDetail(device)">
                <ion-card-header>
                  <ion-avatar>
                    <ion-icon :icon="device.icon" size="large" class="device-ion-icon"></ion-icon>
                  </ion-avatar>
                  <ion-card-title>{{ device.name }}</ion-card-title>
                  <ion-card-subtitle>{{ device.school }} - {{ device.class }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <ion-badge :color="getStatusColor(device.status)">
                    {{ device.status }}
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
  import { ref } from 'vue';
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
  import { business,statsChart, menu} from 'ionicons/icons';
  import ToggleMenu from '@/components/menu.vue';
  
  const contentId = ref('menu-content');
    const accountName = ref('蘇小鳴');
    const accountType = ref('教師');
    const version = ref('0.0.1');
  
  const devices = ref([
    {
      id: 1,
      icon: hardwareChip,
      name: 'hsntnu-0103',
      school: '師大附中',
      class: '一年三班',
      status: '待機中',
    },
    {
      id: 2,
      icon: hardwareChip,
      name: 'hsntnu-0104',
      school: '師大附中',
      class: '一年四班',
      status: '錄音中',
    },
    {
      id: 3,
      icon: hardwareChip,
      name: 'hsntnu-0105',
      school: '師大附中',
      class: '一年五班',
      status: '離線中',
    },
    {
      id: 4,
      icon: hardwareChip,
      name: 'hsntnu-0106',
      school: '師大附中',
      class: '一年六班',
      status: '故障中',
    },
    {
      id: 5,
      icon: hardwareChip,
      name: 'hsntnu-0107',
      school: '師大附中',
      class: '一年七班',
      status: '待機中',
    },
    {
      id: 6,
      icon: hardwareChip,
      name: 'hsntnu-0108',
      school: '師大附中',
      class: '一年八班',
      status: '待機中',
    },
    {
      id: 7,
      icon: hardwareChip,
      name: 'hsntnu-0201',
      school: '師大附中',
      class: '二年一班',
      status: '待機中',
    },
    {
      id: 8,
      icon: hardwareChip,
      name: 'hsntnu-0202',
      school: '師大附中',
      class: '二年二班',
      status: '待機中',
    },
    {
      id: 9,
      icon: hardwareChip,
      name: 'hsntnu-0301',
      school: '師大附中',
      class: '三年一班',
      status: '待機中',
    },
    {
      id: 10,
      icon: hardwareChip,
      name: 'hsntnu-0302',
      school: '師大附中',
      class: '三年二班',
      status: '待機中',
    },
    {
      id: 1,
      icon: hardwareChip,
      name: 'yphs-0101',
      school: '永平高中',
      class: '一年一班',
      status: '待機中',
    },
    {
      id: 2,
      icon: hardwareChip,
      name: 'yphs-0102',
      school: '永平高中',
      class: '一年二班',
      status: '錄音中',
    },
    {
      id: 3,
      icon: hardwareChip,
      name: 'yphs-0103',
      school: '永平高中',
      class: '一年三班',
      status: '離線中',
    },
    {
      id: 4,
      icon: hardwareChip,
      name: 'yphs-0104',
      school: '永平高中',
      class: '一年四班',
      status: '故障中',
    },
    {
      id: 5,
      icon: hardwareChip,
      name: 'yphs-0105',
      school: '永平高中',
      class: '一年五班',
      status: '待機中',
    },
    {
      id: 6,
      icon: hardwareChip,
      name: 'yphs-0106',
      school: '永平高中',
      class: '一年六班',
      status: '待機中',
    },
    {
      id: 7,
      icon: hardwareChip,
      name: 'yphs-0107',
      school: '永平高中',
      class: '一年七班',
      status: '待機中',
    },
    {
      id: 8,
      icon: hardwareChip,
      name: 'yphs-0108',
      school: '永平高中',
      class: '一年八班',
      status: '待機中',
    },
    {
      id: 9,
      icon: hardwareChip,
      name: 'yphs-0109',
      school: '永平高中',
      class: '一年九班',
      status: '待機中',
    },
    {
      id: 10,
      icon: hardwareChip,
      name: 'yphs-0201',
      school: '永平高中',
      class: '二年一班',
      status: '待機中',
    },
    // 可以添加更多裝置
  ]);
  
  function getStatusColor(status) {
    switch (status) {
      case '待機中':
        return 'medium';
      case '錄音中':
        return 'success';
      case '離線中':
        return 'warning';
      case '故障中':
        return 'danger';
      default:
        return 'medium';
    }
  }
  
  function goToDeviceDetail(device) {
    // 在此處處理裝置詳情的導航
    console.log('Navigating to device detail:', device);
  }
  </script>
  
  <style scoped>
  ion-card {
    --ion-card-background: var(--ion-color-light);
    cursor: pointer;
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
    width: 7.25rem;
}
.DeviceStatsOption {
    width: 6.25rem;
}
  </style>