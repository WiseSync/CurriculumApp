<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
          <ion-menu-button :menu="commonMenuId"></ion-menu-button>
        </ion-buttons>
                <ion-title slot="start">{{ pageTitle }}</ion-title>
                <h1 style="visibility:hidden;display: none;">{{ pageTitle }}</h1>
                <!-- <ion-button slot="end">
                    <ion-icon :icon="add"></ion-icon>
                </ion-button> -->
                <ion-select
                  label="組織"
                  label-placement="stacked"
                  v-model="selectedOrganizationId"
                  @ionChange="onOrganizationChange($event.detail.value)"
                  slot="end"
                  class="CalendarCommonSelectOption"
                >
                  <ion-icon slot="start" :icon="business" aria-hidden="true"></ion-icon>
                  <ion-select-option
                    v-for="org in organizations"
                    :key="org.id"
                    :value="org.id"
                  >
                    {{ org.name }}
                  </ion-select-option>
                </ion-select>

                <ion-select
                  label="班級"
                  label-placement="stacked"
                  v-model="selectedDepartmentId"
                  @ionChange="onDepartmentChange($event.detail.value)"
                  slot="end"
                  class="CalendarCommonSelectOption"
                >
                  <ion-icon slot="start" :icon="people" aria-hidden="true"></ion-icon>
                  <ion-select-option
                    v-for="dep in departments"
                    :key="dep.id"
                    :value="dep.id"
                  >
                    {{ dep.name }}
                  </ion-select-option>
                </ion-select>
                <!--
                <ion-select label-placement="stacked" label="裝置" value="device001" slot="end" class="CalendarCommonSelectOption CalendarDeviceOption">
                    <ion-icon slot="start" :icon="hardwareChip" aria-hidden="true"></ion-icon>
                    <ion-select-option value="device001">所有</ion-select-option>
                </ion-select>
            -->
            </ion-toolbar>
        </ion-header>
        <CommonMenu :content-id="contentId" :menu-id="commonMenuId"/>
    <ion-router-outlet :id="contentId"></ion-router-outlet>
        <ion-content :id="contentId">
            <full-calendar ref="calendarRef" :options="calendarOptions"></full-calendar>
            <!-- 侧边菜单 -->
      <ion-menu side="end" :content-id="contentId" type="overlay" :menu-id="courseMenuId">
        <ion-header>
          <ion-toolbar>
            <ion-title>課程詳情</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="detail-pane" v-if="selectedCourse">
            <h2>{{ selectedCourse.title }}</h2>
            <p>授課老師:{{selectedCourse.extendedProps.teacher}}</p>
            <p>科目: {{ Utils.subjectText(selectedCourse.extendedProps.subject) }}</p>
            <p>課程時間: {{ formatDate(selectedCourse.start) }} - {{ formatDate(selectedCourse.end) }}</p>
            <p color="success">狀態: <ion-text :color="Utils.statusColor(selectedCourse.extendedProps.status)">{{ Utils.statusText(selectedCourse.extendedProps.status) }}</ion-text></p>
            <ion-button expand="full"  @click="enterCourse" :disabled="selectedCourse.extendedProps.status !== 'done'">
                    <ion-icon :icon="eye"></ion-icon>
                    <ion-label>進入課程</ion-label>
                </ion-button>
          </div>
        </ion-content>
      </ion-menu>

      <!-- 隐藏的按钮，用于程序化打开菜单 -->
      <ion-menu-toggle auto-hide="false">
        <ion-button id="open-menu" style="display: none;"></ion-button>
      </ion-menu-toggle>
            <ion-fab v-if="isAlignmentMode"  slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button @click="addVideoDialog.show()">
                <ion-icon :icon="add"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
        <add_video ref="addVideoDialog" @onHide="refreshCalendar"/>
    </ion-page>
</template>

<script setup>
import {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonSelectOption,
    IonSelect,
    IonIcon,
    IonFab,
    IonFabButton,
    IonMenuToggle,
    IonMenu,
    IonText,
    IonButtons,
    IonMenuButton,
    IonRouterOutlet,
    IonLabel, onIonViewDidEnter
} from '@ionic/vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ref, onMounted } from 'vue';
import { business,people,hardwareChip,add, eye, closeCircle} from 'ionicons/icons';
import { menuController } from '@ionic/vue';
import CommonMenu from '../components/menu.vue';
import AppConfig from '../app_config';
import Utils from '../utils';
import add_video from '../components/add_video.vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const baseApiUrl = AppConfig.ServiceUrl;
const showLoading = ref(false);

// dynamic org / department lists
const organizations       = ref([]);   // [{id,name}]
const departments         = ref([]);   // [{id,name}]
const selectedOrganizationId = ref(null);
const selectedDepartmentId   = ref(null);

const calendarRef = ref(null);
const selectedCourse = ref(null);
const contentId = 'main-content';
const addVideoDialog = ref(null);
const router = useRouter();
const route = useRoute();
const isAlignmentMode = ref(route.params.type === 'alignment');
const commonMenuId = ref('calendarCommonMenu-'+route.params.type);
const courseMenuId = ref('courseMenu-'+route.params.type);
const pageTitle = ref('課程表');

if (isAlignmentMode.value) {
    pageTitle.value = '對程表';
} else {
    pageTitle.value = '課程筆記';
}



const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'zh-TW',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: function(fetchInfo, successCallback, failureCallback) {
        // 這裡可以從 API 獲取事件數據
        // 這裡我們使用 loadVideosAsCourses 函數來獲取事件數據
        fetchCourses().then((events) => {
            successCallback(events);
            //const calendarApi = calendarRef.value.getApi();
            //calendarApi.refetchEvents();
        //calendarApi.render();
        }).catch(failureCallback);
    },
    eventClick: handleEventClick, // 事件點擊處理器
};

async function refreshCalendar() {
    const calendarApi = calendarRef.value.getApi();
    // 重新獲取事件數據
    calendarApi.refetchEvents();
}

async function fetchCourses() {
    if (!selectedDepartmentId.value) {
        return [];
    }
    const resp  = await fetch(`${AppConfig.ServiceUrl}/departments/${selectedDepartmentId.value}/sessions`);
    if(!resp.ok) {
      //console.error('Failed to load videos:', resp.status, resp.statusText)
      throw new Error('Failed to load videos: ' + resp.status + ' ' + resp.statusText)
    }
    const data = await resp.json()
    // Clear existing events
    const events = []
    // For each video from the API, create a FullCalendar event
    data.forEach(video => {
      // Use video.date as start date, assume it’s the event start
      // We'll just guess an end date 1 hour later for demonstration
      const startDate = new Date(video.date)
      const endDate = new Date(  startDate.getTime()+ video.duration) // +1 hour
      
      events.push({
        id: video.id,
        title: video.title||'無標題',
        start: startDate,
        end: endDate,
        extendedProps:{
            subject: video.subject,
            teacher: video.teacher,
            status: video.status,
            error: video.error
        }
      })
    });

    return events;

}

async function handleEventClick(info) {
  selectedCourse.value = info.event;

  // 打开右侧菜单
  await menuController.open(courseMenuId.value);
}

function formatDate(date) {
  const options = { hour12: false, hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat('zh-TW', options).format(date);
}

function enterCourse() {
    router.push({
        name: 'Note',
        params: {
            sessionId: selectedCourse.value.id,
            type: route.params.type
        }
    });
}

async function loadOrganizations () {
  showLoading.value = true;
  try {
    const resp = await fetch(`${baseApiUrl}/organizations`);
    if (!resp.ok) throw new Error('Failed to load organizations');
    organizations.value = await resp.json();
    if (organizations.value.length) {
      selectedOrganizationId.value = organizations.value[0].id;
      await loadDepartments(selectedOrganizationId.value);
     // const last = localStorage.getItem('lastDepartment');
     // if (last) {
     //   selectedDepartmentId.value = Number(last);
     // }
    }
  }  finally {
    showLoading.value = false;
  }
}

async function loadDepartments (orgId) {
  if (!orgId) return;
  showLoading.value = true;
  try {
    const resp = await fetch(`${baseApiUrl}/organizations/${orgId}/departments`);
    if (!resp.ok) throw new Error('Failed to load departments');
    departments.value = await resp.json();
    //const oldVal = selectedDepartmentId.value;
    selectedDepartmentId.value = departments.value.length ? departments.value[0].id : null;

    refreshCalendar();
  } catch (e) {
    console.error(e);
  } finally {
    showLoading.value = false;
  }
}

async function onOrganizationChange (value) {
  selectedOrganizationId.value = value;
  await loadDepartments(value);
  // refresh events once org / dep changes
  refreshCalendar();
}

async function onDepartmentChange (value) {
  selectedDepartmentId.value = value;
  localStorage.setItem('lastDepartment', value);
  refreshCalendar();
}

//onMounted(() => {
 // loadOrganizations();
//});

onIonViewDidEnter(() => {
   
   loadOrganizations();
   setTimeout(() => {
    const calendarApi = calendarRef.value.getApi();
    calendarApi.render();
    }, 0);
});
</script>

<style>
.CalendarCommonSelectOption {
    margin-left: 5rem;
    width: 10.5rem;
}
.CalendarDeviceOption {
    width: 9rem;
}

.detail-pane {
  padding: 16px;
}

.detail-pane h2 {
  margin-top: 0;
}

.detail-pane p {
  margin: 8px 0;
}

.detail-pane ion-button {
  margin-top: 16px;
}

ion-menu {
  --width: 300px;
}
ion-content {
  --offset-end: 0px;
}

</style>