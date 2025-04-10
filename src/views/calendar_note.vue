<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
                <ion-title slot="start">課程表</ion-title>
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
                <ion-button slot="end"  @click="openChat">
                    <ion-icon :icon="chatboxEllipses"></ion-icon>
                </ion-button>

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
            <full-calendar ref="calendarRef" :options="calendarOptions"></full-calendar>
            <!-- 侧边菜单 -->
            <ion-menu side="end" :content-id="contentId" type="overlay" style="--width:35%" menu-id="chatMenu">
        <ion-header>
        <ion-toolbar color="primary">
          <ion-title>AI助理</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
      <!-- Toggle Menu -->
      <!-- 聊天区域 -->
        <div class="messages">
          <div v-for="(msg, index) in messages" :key="index" >
            <div :class="['message', msg.sender]">
                <div v-if="msg.sender==='ai'" :class="['message-name', msg.sender]">{{ msg.name }}</div>
                <div class="message-content">
                {{ msg.text }}
                </div> 
            </div>
          </div>
          <div ref="messagesEndRef"></div>
        </div>
        <!-- 输入框 -->
        <div class="input-area">
          <ion-item>
            <ion-input placeholder="输入訊息..." @keyup.enter="sendMessage"></ion-input>
            <ion-button slot="end" @click="sendMessage">
              <ion-icon :icon="send"></ion-icon>
            </ion-button>
          </ion-item>
      </div>
      </ion-content>
    </ion-menu>
    <ion-menu-toggle auto-hide="false">
        <ion-button id="open-menu" style="display: none;"></ion-button>
      </ion-menu-toggle>
        </ion-content>
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
    IonMenuToggle,
    IonMenu,
    IonInput,
    IonButtons,
    IonMenuButton,
    IonRouterOutlet,
    IonItem

} from '@ionic/vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ref, onMounted } from 'vue';
import { business,people,chatboxEllipses, send} from 'ionicons/icons';
import { menuController } from '@ionic/vue';
import ToggleMenu from '@/components/menu.vue';

const calendarRef = ref(null);
const selectedCourse = ref(null);
const contentId = 'main-content';
const accountName = '王小明';
const accountType = '教師';
const version = '0.0.1';

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
const courses = [
    { title: '數學', startTime: '2024-09-30:10:00:00', endTime: '2024-09-30:13:50:00' },
    { title: '生物', startTime: '2024-09-30:14:00:00', endTime: '2024-09-30:14:50:00' },

    { title: '國語文', startTime: '2024-10-01:08:10:00', endTime: '2024-10-01:10:00:00' },
    { title: '理化', startTime: '2024-10-01:10:10:00', endTime: '2024-10-01:12:00:00' },
    { title: '數學', startTime: '2024-10-01:13:00:00', endTime: '2024-10-01:13:50:00' },
    { title: '英語文', startTime: '2024-10-01:14:00:00', endTime: '2024-10-01:14:20:00' },

    { title: '國語文', startTime: '2024-10-02:08:10:00', endTime: '2024-10-02:09:00:00' },
    { title: '理化', startTime: '2024-10-02:09:10:00', endTime: '2024-10-02:10:00:00' },
    { title: '英語文', startTime: '2024-10-02:10:00:00', endTime: '2024-10-02:11:00:00' },
    { title: '歷史', startTime: '2024-10-02:15:05:00', endTime: '2024-10-02:15:55:00' },


    { title: '國語文', startTime: '2024-10-03:9:10:00', endTime: '2024-10-03:10:00:00' },
    { title: '英語文', startTime: '2024-10-03:13:00:00', endTime: '2024-10-03:13:50:00' },
    { title: '數學', startTime: '2024-10-03:14:00:00', endTime: '2024-10-03:14:50:00' },

    { title: '英語文', startTime: '2024-10-04:10:00:00', endTime: '2024-10-04:11:00:00' },
    { title: '國語文', startTime: '2024-10-04:11:10:00', endTime: '2024-10-04:12:00:00' },
    { title: '歷史', startTime: '2024-10-04:13:00:00', endTime: '2024-10-04:13:50:00' },
];

const messages = ref([
    {text: "你是誰?​", sender: 'user'},
    {text: "我是AI智能助手，專門用來幫助搜尋和回答與學習、課程相關的問題。我可以根據您的需求提供各種資訊，包括課業輔助、解答問題、搜尋資料等，幫助您更好地理解和學習。如果有任何問題，請隨時告訴我！", sender: 'ai', "name":"A.I."},
    {text: "我要找光合作用相關的課程", sender: 'user'},
    {text: "在9月30號的下午2:00的生物課有教授關於光合作用的內容，請點擊此<連結>觀看筆記", sender: 'ai', "name":"A.I."},
  ]);


for (let i = 0; i < 2; ++i) {
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
  //await menuController.open('courseMenu');
}

function openChat(){
    menuController.open("chatMenu");
}

function sendMessage(){
    messages.push({text: "fewfw", sender: 'user'});
    scrollToBottom();
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