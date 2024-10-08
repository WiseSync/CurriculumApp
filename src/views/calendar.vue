<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-button slot="start">
                    <ion-icon :icon="home"></ion-icon>
                </ion-button>
                <ion-title slot="start">課程管理</ion-title>
                <!-- <ion-button slot="end">
                    <ion-icon :icon="add"></ion-icon>
                </ion-button> -->
                <ion-select label-placement="stacked" label="學校" value="school001" slot="end" class="CalendarCommonSelectOption">
                    <ion-icon slot="start" :icon="business" aria-hidden="true"></ion-icon>
                    <ion-select-option value="school001">師大附中</ion-select-option>
                    <ion-select-option value="school002">永平高中</ion-select-option>
                </ion-select>

                <ion-select label-placement="stacked" label="班級" value="class001" slot="end" class="CalendarCommonSelectOption">
                    <ion-icon slot="start" :icon="people" aria-hidden="true"></ion-icon>
                    <ion-select-option value="class001">一年三班</ion-select-option>
                    <ion-select-option value="class001">二年四班</ion-select-option>
                </ion-select>

                <ion-select label-placement="stacked" label="裝置" value="device001" slot="end" class="CalendarCommonSelectOption CalendarDeviceOption">
                    <ion-icon slot="start" :icon="hardwareChip" aria-hidden="true"></ion-icon>
                    <ion-select-option value="device001">hsntnu-0103</ion-select-option>
                    <ion-select-option value="device001">hsntnu-02034</ion-select-option>
                </ion-select>

            </ion-toolbar>
        </ion-header>
        <ion-content :id="contentId">
            <full-calendar ref="calendarRef" :options="calendarOptions"></full-calendar>
            <!-- 侧边菜单 -->
      <ion-menu side="end" :content-id="contentId" type="overlay">
        <ion-header>
          <ion-toolbar>
            <ion-title>課程詳情</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="detail-pane" v-if="selectedCourse">
            <h2>{{ selectedCourse.title }}</h2>
            <p>授課老師: 蘇小鳴</p>
            <p>課程時間: {{ formatDate(selectedCourse.start) }} - {{ formatDate(selectedCourse.end) }}</p>
            <p color="success">狀態: <ion-text color="success">完成</ion-text></p>
            <ion-button expand="full">
                    <ion-icon :icon="eye" @click="enterCourse"></ion-icon>
                </ion-button>
                <ion-button color="danger"  expand="full">
                    <ion-icon :icon="closeCircle" @click="enterCourse"></ion-icon>
                </ion-button>
          </div>
        </ion-content>
      </ion-menu>

      <!-- 隐藏的按钮，用于程序化打开菜单 -->
      <ion-menu-toggle auto-hide="false">
        <ion-button id="open-menu" style="display: none;"></ion-button>
      </ion-menu-toggle>
            <ion-fab  slot="fixed" vertical="bottom" horizontal="end">
                <ion-fab-button>
                <ion-icon :icon="add"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script setup>
import {
    IonLabel,
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonToolbar,
    IonSearchbar,
    IonTitle,
    IonSelectOption,
    IonSelect,
    IonIcon,
    IonFab,
    IonFabButton,
    IonMenuToggle,
    IonMenu,
    IonText
} from '@ionic/vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ref, onMounted } from 'vue';
import { business,people,hardwareChip,add, home, eye, closeCircle} from 'ionicons/icons';
import { menuController } from '@ionic/vue';

const calendarRef = ref(null);
const selectedCourse = ref(null);
const contentId = 'main-content';

const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'zh-tw',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],
    eventClick: handleEventClick, // 事件點擊處理器
};

// 生成一個月內每週重複的課程
const startDate = new Date('2024-10-07');
const endDate = new Date('2024-10-31');
const courses = [
    { title: '數學', startTime: '2024-09-30:10:00:00', endTime: '2024-09-30:13:50:00' },
    { title: '物理', startTime: '2024-09-30:14:00:00', endTime: '2024-09-30:14:50:00' },

    { title: '國語文', startTime: '2024-10-01:08:10:00', endTime: '2024-10-01:10:00:00' },
    { title: '物理', startTime: '2024-10-01:10:10:00', endTime: '2024-10-01:12:00:00' },
    { title: '數學', startTime: '2024-10-01:13:00:00', endTime: '2024-10-01:13:50:00' },
    { title: '英語文', startTime: '2024-10-01:14:00:00', endTime: '2024-10-01:14:20:00' },

    { title: '國語文', startTime: '2024-10-02:08:10:00', endTime: '2024-10-02:09:00:00' },
    { title: '物理', startTime: '2024-10-02:09:10:00', endTime: '2024-10-02:10:00:00' },
    { title: '英語文', startTime: '2024-10-02:10:00:00', endTime: '2024-10-02:11:00:00' },
    { title: '歷史', startTime: '2024-10-02:15:05:00', endTime: '2024-10-02:15:55:00' },


    { title: '國語文', startTime: '2024-10-03:9:10:00', endTime: '2024-10-03:10:00:00' },
    { title: '英語文', startTime: '2024-10-03:13:00:00', endTime: '2024-10-03:13:50:00' },
    { title: '數學', startTime: '2024-10-03:14:00:00', endTime: '2024-10-03:14:50:00' },

    { title: '英語文', startTime: '2024-10-04:10:00:00', endTime: '2024-10-04:11:00:00' },
    { title: '國語文', startTime: '2024-10-04:11:10:00', endTime: '2024-10-04:12:00:00' },
    { title: '歷史', startTime: '2024-10-04:13:00:00', endTime: '2024-10-04:13:50:00' },
];


for (let i = 0; i < 4; ++i) {
    courses.forEach(course => {
        let title = course.title;
        let start = new Date(course.startTime);
        let end = new Date(course.endTime);

        let startEpoch = start.getTime();
        let endEpoch = end.getTime();

        startEpoch += 7 * 24 * 60 * 60 * 1000 * i; // Add 7 days in milliseconds
        endEpoch += 7 * 24 * 60 * 60 * 1000 * i; // Add 7 days in milliseconds

        start = new Date(startEpoch);
        end = new Date(endEpoch);

        if(start.getDate()<=7 || start.getDate()===30){
            if(course.title==='數學'){
                title = course.title+'(失敗)';
            }else{
                title = course.title+'(完成)';
            }
        }

        if(start.getDate()===8 && course.title==='國語文'){
            title = '國語文(錄音中)';
        }

        if (start.getDate() !== 10) {
            calendarOptions.events.push({
                title: title,
                start: start.toISOString(),
                end: end.toISOString(),
            });
        }
    });
}

async function handleEventClick(info) {
  selectedCourse.value = {
    title: info.event.title,
    start: info.event.start,
    end: info.event.end,
    teacher: info.event.extendedProps.teacher,
    status: info.event.extendedProps.status,
  };

  // 打开右侧菜单
  await menuController.open();
}

function formatDate(date) {
  const options = { hour12: false, hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat('zh-CN', options).format(date);
}

function enterCourse() {
  alert('进入课程：' + selectedCourse.value.title);
  // 实现进入课程的逻辑
}

onMounted(() => {
    const calendarApi = calendarRef.value.getApi();

    setTimeout(() => {
        calendarApi.render();
    }, 8);

});
</script>

<style>
.CalendarCommonSelectOption {
    margin-left: 5rem;
    width: 7.25rem;
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