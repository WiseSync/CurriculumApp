<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button  :menu="commonMenuId"></ion-menu-button>
                </ion-buttons>
                <ion-title>課綱對齊</ion-title>
                <h1 style="visibility:hidden;display: none;">{{pageTitle}}</h1>
                <ion-button slot="end"  @click="openChat">
                    <ion-icon :icon="chatboxEllipses"  alt="關閉的圖示" aria-label="關閉的圖示"></ion-icon>
                </ion-button>
            </ion-toolbar>
        </ion-header>
        <CommonMenu :content-id="contentId" :menu-id="commonMenuId">
        </CommonMenu>
        <!-- <ion-router-outlet :id="contentId"></ion-router-outlet>-->

        <ion-menu side="end" :content-id="contentId" :menu-id="codesMenuId" type="overlay" style="--width:35%">
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
            </ion-content>
        </ion-menu>
        <ion-menu-toggle auto-hide="false">
            <ion-button id="open-menu" style="display: none;"></ion-button>
        </ion-menu-toggle>
        <ion-content :id="contentId" >
            <!-- 显示元数据 -->
            <div  style="display: flex;">
            <ion-card v-if="!showLoading" style="width: 85%;">
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
            <!--<div id="player-container"  style="width: 20%; height: 100%;"/>-->
            <div  ref="playerContainerRef" style="width: 15%; align-content: center;"></div>
            </div>
            
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
                <ion-item v-if="showAlignment">
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
                <ion-item v-if="showAlignment">
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
        <ion-modal :is-open="showChatModal" swipe-to-close="true" presenting-element="ion-router-outlet"
                @will-dismiss="onChatModalWillDismiss">
                <ChatBox @closed="onChatModalWillDismiss" :userAvatar="unknownImgUrl" :dialogHistory="chatDialogHistory" />
            </ion-modal>
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
    IonIcon,
    IonModal, onIonViewDidLeave, onIonViewDidEnter
} from '@ionic/vue';
import { menuController } from '@ionic/vue';
import CommonMenu from '@/components/menu.vue';
import { useRoute } from 'vue-router';
import AppConfig from '../app_config';
import { useRouter } from 'vue-router';
import { chatboxEllipses} from 'ionicons/icons';
import Utils from '../utils';
import ChatBox from '@/components/ChatBox.vue'; // The second view described below
import unknownImgUrl from "../../assets/images/unknown.jpeg?url";

const segments = ref([]);
const showLoading = ref(true);
const router = useRouter();
const route = useRoute();
const chatDialogHistory = ref([]);

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
const playerContainerRef = ref(null);
const showAlignment = ref(route.params.type === 'alignment');
const showChatModal = ref(false);
const commonMenuId = ref('noteCommonMenu-'+route.params.sessionId+'-'+route.params.typ);
const codesMenuId = ref('codesMenu'+route.params.sessionId+'-'+route.params.type);
const mediaPlayerId = ref('mediaPlayer'+route.params.sessionId+'-'+route.params.type);
const pageTitle = ref('');
if (showAlignment.value) {
    pageTitle.value = '課綱對齊';
} else {
    pageTitle.value = '課程筆記';
}

// Callback for IonModal "willDismiss" event
function onChatModalWillDismiss() {
    showChatModal.value = false;
}


// 学习内容和学习表现的选项
const contentId = ref('main-content');


function openChat(){
    showChatModal.value = true;
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
    const cs = [...codes];
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
    menuController.open(codesMenuId.value);
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

function getMediaType(url) {
    if(Utils.isYoutubeUrl(url)){
        return 'youtube';
    }else{
        const ext = url.split('.').pop().toLowerCase();
        const mimetype = Utils.getMimeTypeFromExtension(ext);

        if(mimetype.includes('video')){
            return 'video';
        }else if(mimetype.includes('audio')){
            return 'audio';
        }else{
            console.warn('Unknown media type for URL:', url);
            return 'unknown';
        }
    }
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
        metadata.value.endTime = new Date(new Date(new Date(data.date).getTime() + data.duration).getTime() - tzOffsetInMs).toLocaleString("zh-TW");
        metadata.value.deviceId = Utils.isYoutubeUrl(data.url) ? "YouTube" : "雲端檔案";

        const mediaType = getMediaType(data.url);
        let player = document.getElementById(mediaPlayerId.value);
        if(player){
            player.remove();
        }
        if(mediaType==='youtube'){
            // Create a YouTube player
            const vid = getYouTubeId(data.url);

            player = document.createElement('iframe');
            //player.style.padding = '0.1em';
            player.src = 'https://www.youtube.com/embed/' + vid;
            player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            player.referrerpolicy = 'strict-origin-when-cross-origin';
            player.allowFullscreen = true;
            player.title = 'YouTube播放器';

        }else if(mediaType==='video'){
            // Create a video player
           player = document.createElement('video');
            player.controls = true;
            player.src = AppConfig.ServiceUrl+"/"+data.url;
        }else if(mediaType==='audio'){
            // Create an audio player
            player = document.createElement('audio');
            player.controls = true;
            player.src = AppConfig.ServiceUrl+"/"+data.url;
        }else{
            console.warn('Unknown media type for URL:', data.url);
        }

        if(player) {
            player.id = mediaPlayerId.value;
            player.style.height = '90%';
            player.style.width = '100%';
            player.style.marginTop = '0.75em';
            player.style.marginBottom = '0.75em';
            playerContainerRef.value.appendChild(player);
        }

        //youtubePlayerRef.value.src = 'https://www.youtube.com/embed/' + vid + '?si=d07_yddNCh0g8foi';

    }
}

function arrayToObject(arr) {
    const obj = {};
    arr.forEach(item => {
        obj[item.id] = item;
    });
    return obj;
}

function filtrSegmentsText(segments){
    const newSegments = [];
    segments.forEach(segment => {
        segment.text = segment.text.replace("加入標點符號，並輸出繁體中文。", "");

        if(segment.text.length>0){
            newSegments.push(segment);
        }
    });

    return newSegments;
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
        //To do: workaround to remove 加入標點符號，並輸出繁體中文。 text
        segments.value = filtrSegmentsText(data.segments);
        

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

/**
 * Remove codes inside each segment that do not exist in the overall learningCodes list.
 * Ensures segment.codes only keeps valid codes present in learningCodes.
 */
function filterSegmentCodes() {
    segments.value.forEach(segment => {
        ['content', 'performance'].forEach(type => {
            const codesObj = segment.codes[type];
            if (!codesObj) return;
            Object.keys(codesObj).forEach(id => {
                const exists = learningCodes[type]?.some(c => c.id === id);
                if (!exists) {
                    delete codesObj[id];
                }
            });
        });
    });
}

/**
 * Extracts the YouTube Video ID (11 chars) from various YouTube URLs.
 * Returns null if no valid ID found.
 *
 * Supported forms:
 * 1) https://www.youtube.com/watch?v=XXXXXXXXXXX ... &other=params
 * 2) https://youtu.be/XXXXXXXXXXX ... ?other=params
 */
 function getYouTubeId(url) {
  try {
    const parsed = new URL(url.trim());
    //remove leading 'www.'
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    
    // Check short link style: youtu.be/<id>
    if (hostname === 'youtu.be') {
      // /XXXXXXXXXXX
      const path = parsed.pathname.slice(1); // remove leading '/'
      if (path.length === 11) {
        return path;
      }
      return null;
    }
    // Otherwise, assume youtube.com/watch
    else if (hostname === 'youtube.com') {
      const vParam = parsed.searchParams.get('v');
      if (vParam && vParam.length === 11) {
        return vParam;
      }
    }
    return null;
  } catch (err) {
    console.warn('Invalid URL:', err);
    return null;
  }
}


onIonViewDidEnter(async () => {
    try{
        await fetchSegments();
        await fetchSession();
        await fetchLearningContents(metadata.value.subject);
        await fetchLearningPerformances(metadata.value.subject);

        // Filter out any codes in segments that are not present in learningCodes
        filterSegmentCodes();
        
        const fullText = segments.value.map(segment => segment.text).join('');

        chatDialogHistory.value = [{ role: 'system', content: String.raw`你是AI小助手，專門本課內所有相關的知識點，請先熟悉下列授課的逐字稿內容:
        ### TRANSCRIPTION Start ###
        ${fullText}
        ### TRANSCRIPTION End ###
        請依據逐字稿內容來回答使用者的提問，如果問題超出本課程的範圍，請勿回答。` }];

        setTimeout(() => {
            showLoading.value = false;
        }, 60);
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
        }, 60);
        
    }
   
});

onIonViewDidLeave(() => {
    menuController.close(commonMenuId.value);
    menuController.close(codesMenuId.value);
    const player = document.getElementById(mediaPlayerId.value);
    if (player) {
        player.remove();
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
</style>
