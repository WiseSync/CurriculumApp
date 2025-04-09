<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>課綱對齊</ion-title>
                <ion-button slot="end"  @click="openChat">
                    <ion-icon :icon="chatboxEllipses"></ion-icon>
                </ion-button>
            </ion-toolbar>
        </ion-header>
        <CommonMenu :content-id="contentId" :account-name="accountName" :account-type="accountType" :version="version">
        </CommonMenu>
        <!-- <ion-router-outlet :id="contentId"></ion-router-outlet>-->

        <ion-menu side="end" :content-id="contentId" menu-id="codesMenu" type="overlay" style="--width:35%">
            <ion-header>
                <ion-searchbar placeholder="編碼或定義" slot="start" @ionInput="filterCodesInEditMenu($event)"></ion-searchbar>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item v-for="(item) in selectedCodes" :key="item.id">
                        <ion-label>
                            <div class="classification-select-item-title">
                                <h2>{{ item.id }}</h2>
                                <div>
                                    <ion-badge v-if="isAISelectedCode(item.id)" class="note-properties-badge">AI</ion-badge>
                                </div>
                            </div>
                            <p>{{ item.description }}</p>
                            <ion-text style="font-size: small;" v-if="isAISelectedCode(item.id)"
                                color="secondary">({{ aiReason(item.id) }})</ion-text>

                        </ion-label>
                        <ion-toggle slot="end" :checked="isUserSelectedCode(item.id)" @ionChange="toggleSelection(item.id)"></ion-toggle>
                    </ion-item>
                </ion-list>
                <!--
                <ion-button expand="full" @click="submitSelection">儲存</ion-button>
                <ion-button expand="full" @click="submitSelection" color="warning">放棄</ion-button>
                <ion-button expand="full" @click="submitSelection" color="medium">AI推薦</ion-button>-->
            </ion-content>
        </ion-menu>
        <ion-menu-toggle auto-hide="false">
            <ion-button id="open-menu" style="display: none;"></ion-button>
        </ion-menu-toggle>
        <ion-content :id="contentId">
            <!-- 显示元数据 -->
            <ion-card v-if="!showLoading">
                <ion-card-header>
                    <ion-card-title>{{ metadata.courseName }}</ion-card-title>
                    <!--<ion-card-subtitle>{{ metadata.school }} - {{ metadata.class }}</ion-card-subtitle>-->
                </ion-card-header>
                <ion-card-content>
                    <p>組織: {{ metadata.school }}</p>
                    <p>班級: {{ metadata.class }}</p>
                    <p>科目: {{ Utils.subjectText(metadata.subject) }}</p>
                    <p>授課老師: {{ metadata.teacher }}</p>
                    <p>課程時間: {{ metadata.startTime }} - {{ metadata.endTime }}</p>
                    <p>裝置 ID: {{ metadata.deviceId }}</p>
                </ion-card-content>
            </ion-card>
            <!-- <audio controls :src="'https://file-examples.com/storage/fe2465184067ef97996fb41/2017/11/file_example_MP3_700KB.mp3'" class="classification-audio"></audio>-->
            <!-- 文本内容分段显示 -->
            <ion-item-group v-for="(segment, index) in segments" :key="index" class="segment">
                <ion-item>
                    <ion-label class="classification-label">{{ segment.title }}</ion-label>
                    <ion-badge v-for="tag in segment.keywords" class="note-properties-badge">{{ tag }}</ion-badge>
                </ion-item>
                <ion-item>
                    <ion-label>{{ segment.text }}</ion-label>
                </ion-item>

                <!-- 匹配的学习内容 ID -->
                <ion-item>
                    <ion-label class="classification-label codes-type-label" color="secondary"
                        style="font-weight: 500;" @click="openCodesMenu(segment,'content')">學習內容編碼</ion-label>
                    <div  v-for="tag in Object.values(segment.codes['content']).filter(t => t.userSelected)">
                        <ion-badge class="note-properties-badge"
                            :id="'content-badge-' + index + '_' + tag.id">{{ tag.id }}</ion-badge>
                        <ion-popover :trigger="'content-badge-' + index + '_' + tag.id"
                            trigger-action="hover">
                            <ion-content class="ion-padding">{{ tag.reason }}</ion-content>
                        </ion-popover>
                    </div>
                    
                </ion-item>
                <!-- 匹配的学习表现 ID -->
                <ion-item>
                    <ion-label class="classification-label codes-type-label" color="secondary"
                        style="font-weight: 500;" @click="openCodesMenu(segment,'performance')">學習表現編碼</ion-label>
                    <div  v-for="tag in Object.values(segment.codes['performance']).filter(t => t.userSelected)">
                        <ion-badge  class="note-properties-badge"
                            :id="'performance-badge-' + index + '_' + tag.id">{{ tag.id }}</ion-badge>
                        <ion-popover :trigger="'performance-badge-' + index + '_' + tag.id" trigger-action="hover">
                            <ion-content class="ion-padding">{{ tag.reason }}</ion-content>
                        </ion-popover>
                    </div>
                </ion-item>
                <ion-item-divider />
            </ion-item-group>

            <!-- 提交按钮 
        <ion-button expand="full" @click="submitMatches">儲存</ion-button>-->
        <IonLoading :is-open="showLoading" message="載入中..." />

        </ion-content>
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
    <!--
    <ion-menu-toggle auto-hide="false">
        <ion-button id="open-menu" style="display: none;"></ion-button>
      </ion-menu-toggle>
    -->
    </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonBadge,
    IonButton,
    IonMenu,
    IonMenuToggle,
    IonButtons,
    IonMenuButton,
    IonToggle,
    IonSearchbar,
    IonText, IonPopover,
    IonItemGroup,
    IonItemDivider,
    IonLoading,
    alertController,
    IonInput,
    IonIcon
} from '@ionic/vue';
import { menuController } from '@ionic/vue';
import CommonMenu from '@/components/menu.vue';
import { useRoute } from 'vue-router';
import AppConfig from '../app_config';
import { useRouter } from 'vue-router';
import { send,chatboxEllipses} from 'ionicons/icons';
import Utils from '../utils';

const accountName = '蘇小鳴';
const accountType = '教師';
const version = '1.0.0';
const segments = ref([]);
const showLoading = ref(true);
const router = useRouter();
const route = useRoute();
const messages = ref([
    {
        sender: 'ai',
        name: 'AI助理',
        text: '您好！有什麼我可以幫助您的嗎？'
    }
]);

const metadata = ref({
    courseName: '理化',
    school: '福和國中',
    class: '一年三班',
    teacher: 'ˊ蘇小鳴',
    startTime: new Date('2024-10-09:09:00:00').toLocaleString("zh-TW"),
    endTime: new Date('2024-10-09:09:50:00').toLocaleString("zh-TW"),
    deviceId: 'hsntnu-0107',
});
const selectedCodes = ref({});
const selectedSegment = ref(null);
const selectedCodesType = ref('content');
const learningCodes = {};


// 学习内容和学习表现的选项
const contentId = ref('main-content');


function openChat(){
    menuController.open("chatMenu");
}

function filterCodesInEditMenu(event) {
    const searchText = event.target.value.toLowerCase();

    const filteredCodes = learningCodes[selectedCodesType.value].filter(code => {
        return code.id.toLowerCase().includes(searchText) || code.description.toLowerCase().includes(searchText);
    });
    selectedCodes.value = sortCodes(filteredCodes);
}

function sortCodes(codes) {
    //User selected > AI selected > not selected, otherwise by id
    const cs = codes;
    cs.sort((a, b) => {
        if (isUserSelectedCode(b.id) && !isUserSelectedCode(a.id)) return 1;
        if (!isUserSelectedCode(b.id) && isUserSelectedCode(a.id)) return -1;
        if (isAISelectedCode(b.id) && !isAISelectedCode(a.id)) return 1;
        if (!isAISelectedCode(b.id) && isAISelectedCode(a.id)) return -1;
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    });

    return cs;
}

function openCodesMenu(segment,codesType) {
    selectedCodesType.value = codesType;    
    selectedSegment.value = segment;
    selectedCodes.value = sortCodes(learningCodes[codesType]);
    menuController.open("codesMenu");
}

function aiReason(codeId) {
    const codes = selectedSegment.value.codes[selectedCodesType.value];
    if (!codes) return '';
    if (!codes[codeId]) return '';
    return codes[codeId].reason;
}

function isAISelectedCode(codeId) {
    const codes = selectedSegment.value.codes[selectedCodesType.value];
    if (!codes) return false;
    if (!codes[codeId]) return false;
    return codes[codeId].aiSelected;
}

function isUserSelectedCode(codeId) {
    const codes = selectedSegment.value.codes[selectedCodesType.value];
    if (!codes) return false;
    if (!codes[codeId]) return false;
    return codes[codeId].userSelected;
}

function sendMessage() {
    const input = document.querySelector('ion-input');
    const messageText = input.value;
    if (messageText.trim() === '') return;

    messages.value.push({ text: messageText, sender: 'user' });
    input.value = '';

    // 模拟 AI 回复
    setTimeout(() => {
        messages.value.push({ text: "這是AI的回覆", sender: 'ai', name: 'AI助理' });
        scrollToBottom();
    }, 1000);
}

async function toggleSelection(id) {
    const codes = selectedSegment.value.codes[selectedCodesType.value];
    if (!codes) return;
    if (codes[id]){
        codes[id].userSelected = !codes[id].userSelected;
    } else {
        codes[id] = {
            id: id,
            userSelected: true,
            aiSelected: false,
            reason: ''
        };
    }
    
    //selectedCodes.value = sortCodes(learningCodes[selectedCodesType.value]);

    const db_code = {id:id, userSelected: codes[id].userSelected, codeType:selectedCodesType.value};

    const resp = await fetch(AppConfig.ServiceUrl + `/segments/${selectedSegment.value.id}/codes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(db_code)
    });

    if(resp.ok) {
        //console.log('選擇的學習內容編碼：', selectedCodes.value);
    } else {
        const text = await resp.text();
        throw new Error('Failed to update selection: ' + text);
    }

}

function submitSelection() {
    //console.log('選擇的學習內容編碼：', selectedCodes.value);
    // 您可以在此處執行提交操作，例如發送到後端
}

// fetch session_id from route params
async function fetchSession() {
    const sessionId = route.params.sessionId;
    if (sessionId) {
        const resp = await fetch(AppConfig.ServiceUrl + `/sessions/${sessionId}`);
        if (!resp.ok) {
            throw new Error('Failed to load session');
        }
        const data = await resp.json();
        // data is an object with shape:
        // {
        //   courseName, school, class, teacher, startTime, endTime, deviceId
        // }
        const tzOffsetInMs = new Date().getTimezoneOffset() * 60000
        metadata.value.courseName = data.title;
        metadata.value.school = data.organization;
        metadata.value.class = data.department;
        metadata.value.teacher = data.teacher;
        metadata.value.subject = data.subject;
        metadata.value.startTime = new Date(new Date(data.date).getTime() - tzOffsetInMs).toLocaleString("zh-TW");
        metadata.value.endTime = new Date(new Date(data.date + data.duration).getTime() - tzOffsetInMs).toLocaleString("zh-TW");
        metadata.value.deviceId = "YouTube";
    }
}

function arrayToObject(arr) {
    const obj = {};
    arr.forEach(item => {
        obj[item.id] = item;
    });
    return obj;
}

async function fetchSegments() {
    const sessionId = route.params.sessionId;
    if (sessionId) {
        const resp = await fetch(AppConfig.ServiceUrl + `/sessions/${sessionId}/segments`);
        if (!resp.ok) {
                    throw new Error('Failed to load segments');
                }
        const data = await resp.json();
        
        for (let i = 0; i < data.segments.length; i++) {
            const segment = data.segments[i];
            segment.codes = {};
            segment.codes["content"] = arrayToObject(segment.contentCodes);
            segment.codes["performance"] = arrayToObject(segment.performanceCodes);
        }

        segments.value = data.segments;
        

        for (let i = 0; i < segments.value.length; i++) {
            const segment = segments.value[i];
            segment.title = (i + 1) + ". " + segment.title;
        }
    }
}

/**
 * Extract all codes from the data, regardless of
 * whether they appear at the category level or subcategory level.
 *
 * @param {Object} data - The JSON object containing categories.
 * @returns {Array} An array of code objects: [{ id, description }, ...]
 */
 function extractAllCodes(data) {
  const allCodes = [];

  // Helper function: recursively process a category or subcategory
  function processCategory(cat) {
    // If cat has a codes array, push them
    if (cat.codes) {
        allCodes.push(...cat.codes);
        /*
      for (const code of cat.codes) {
        // Check if the code is already in allCodes
        
        if (!allCodes[code.id]) {
          allCodes[code.id] = code;
        }else{
            // If the code already exists, append the new text
            console.warn(`Duplicate code found: ${code.id}`);
        }
      }*/
    }
    // If cat has subcategories, recurse
    if (cat.subcategories) {
      cat.subcategories.forEach(sub => {
        processCategory(sub);
      });
    }
  }

  // We expect data.categories to be an array
  if (!data.categories) {
    console.warn('No categories found in data');
    return allCodes; // empty
  }

  // Traverse each top-level category
  data.categories.forEach(category => {
    processCategory(category);
  });

  return allCodes;
}

async function fetchLearningContents(subject) {
    const resp = await fetch(AppConfig.ServiceUrl + `/codes/7_9/content/${subject}`);
    if (!resp.ok) {
        throw new Error('Failed to load learning contents');
    }
    const data = await resp.json();
    learningCodes["content"] = extractAllCodes(data);
    //console.log(learningCodes);
}

async function fetchLearningPerformances(subject) {
    const resp = await fetch(AppConfig.ServiceUrl + `/codes/7_9/performance/${subject}`);
    if (!resp.ok) {
        throw new Error('Failed to load learning performances');
    }
    const data = await resp.json();
    learningCodes["performance"] = extractAllCodes(data);
}


onMounted(async () => {
    try{
        await fetchSegments();
        await fetchSession();
        await fetchLearningContents(metadata.value.subject);
        await fetchLearningPerformances(metadata.value.subject);
        setTimeout(() => {
            showLoading.value = false;
        }, 18);
    } catch (error) {
        setTimeout(() => {
            showLoading.value = false;
            alertController.create({
                header: '錯誤',
                message: error.message,
                buttons: [{text: '確定', handler: async () => {router.push({ name: 'Calendar' })}}]
            }).then(alert => {
                alert.present();
            });
        }, 18);
        
    }
   
});


</script>

<style scoped>
.segment {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid var(--ion-color-light);
    border-radius: 8px;
}

.note-properties-badge {
    margin-left: 1rem;
}

.note-properties-value {
    margin-left: 1rem;
}

.classification-label {
    font-weight: bold;
}


.codes-type-label{
 text-decoration: underline;
}

.codes-type-label:hover {
background-color: #e5e5ea;
cursor: pointer;
}

.classification-audio {
    width: 100%;
}

.classification-select-item-title {
    display: flex;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message-content {
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
}

.message.user .message-content {
  background-color: #007aff;
  color: #ffffff;
}

.message.ai .message-content {
  background-color: #e5e5ea;
  color: #000000;
}

.input-area {
  padding: 10px;
  background-color: #f1f1f1;
}

.message-name.ai {
    color: #65676b;
    font-size: 0.75rem;
    margin-top: auto;
    margin-bottom: 0px;
}
</style>