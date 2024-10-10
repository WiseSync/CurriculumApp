<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>筆記</ion-title>
          <ion-button slot="end"  @click="openChat">
                    <ion-icon :icon="chatboxEllipses"></ion-icon>
                </ion-button>
        </ion-toolbar>
      </ion-header>
        <ion-menu-toggle auto-hide="false">
        <ion-button id="open-menu" style="display: none;"></ion-button>
      </ion-menu-toggle>

      <ToggleMenu
      :content-id="contentId"
      :account-name="accountName"
      :account-type="accountType"
      :version="version"
    ></ToggleMenu>
    <ion-router-outlet :id="contentId"></ion-router-outlet>

      <ion-content :id="contentId">
        <!-- 显示元数据 -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ metadata.courseName }}</ion-card-title>
            <ion-card-subtitle>{{ metadata.school }} - {{ metadata.class }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>授課老師: {{ metadata.teacher }}</p>
            <p>課程時間: {{ metadata.startTime }} - {{ metadata.endTime }}</p>
          </ion-card-content>
        </ion-card>
  
        <!-- 文本内容分段显示 -->
        <div v-for="(segment, index) in segments" :key="index" class="segment">
            <ion-item>
            <ion-label class="classification-label" slot="start">{{ segment.title }}</ion-label>
            </ion-item>
            <ion-item>
            <ion-label>{{ segment.text }}</ion-label>
          </ion-item>
          <ion-item>
            <audio controls :src="segment.audioUrl" class="classification-audio"></audio>
          </ion-item>
        </div>
  
        <!-- 提交按钮 
        <ion-button expand="full" @click="submitMatches">儲存</ion-button>-->
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
    <ion-menu-toggle auto-hide="false">
        <ion-button id="open-menu" style="display: none;"></ion-button>
      </ion-menu-toggle>
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
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonMenuToggle,
    IonMenu,
    IonInput,
    IonRouterOutlet,
    IonButtons,
    IonMenuButton
  } from '@ionic/vue';
  import { chatboxEllipses, send} from 'ionicons/icons';
  import { menuController } from '@ionic/vue';
  import ToggleMenu from '@/components/menu.vue';

  const metadata = ref({
    courseName: '理化',
    school: '福和國中',
    class: '一年三班',
    teacher: 'ˊ蘇小鳴',
    startTime: new Date('2024-10-09:09:00:00').toLocaleString("zh-TW"),
    endTime: new Date('2024-10-09:09:50:00').toLocaleString("zh-TW"),
    deviceId: 'hsntnu-0107',
  });

  
  // 示例文本段落
  const segments = ref([
    {
      title: "1. 伽利略的斜面實驗：驗證自由落體運動的奧秘",
      text: '我們會說伽利略是實驗物理學之父。他做過什麼事情呢？第一個，我們常見的是斜面實驗。這裡有個斜面，他把小球放手之後往下滑，他要模擬自由落體，只是讓小球在斜面上滑下來。我們知道東西往下掉會越掉越快，那滑行的距離和時間之間有什麼樣的關係？他就在軌道上面放了好多個小鈴鐺，當小球滑過去的時候會撞到鈴鐺發出聲音。如果在等間隔的地方放上鈴鐺，會越滑越快，你聽到的鈴鐺聲會越來越密集。伽利略就來調整這個鈴鐺的間距，讓他聽起來覺得這個聲音一直都是穩定的頻率，比如每隔0.5秒就會叮一次。聽起來每次經過鈴鐺的時間間隔差不多，再從側面去看他們的距離關係。他用這個實驗來驗證數學假設和推論是否正確。',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/20/audio_e04dc8e716.mp3?filename=ha-long-bay-serenity-147067.mp3',
      learningContentIds: ['Eb-Ⅳ-1', 'Eb-Ⅳ-8'],
      learningPerformanceIds: ['an-Ⅳ-1', 'ai-Ⅳ-1', 'tr-Ⅳ-1', 'tm-Ⅳ-1'],
      tags : ['伽利略', '實驗物理學之父', '自由落體', '斜面實驗', '小球', '滑行距離', '時間關係', '鈴鐺', '等間距', '穩定的頻率', '數學假設', '推論驗證']
    },
    {
      title: "2. 伽利略的慣性假想實驗：揭示力量與運動狀態的關係",
      text: '第二個是慣性的假想實驗。亞里士多德認為，要保持物體的等速度運動，必須對它繼續施加力量。他認為力量是用來保持物體運動的必要條件。但是伽利略不這麼認為。他認為力量不是用來維持物體的運動狀態，而是用來改變物體運動狀態的。他設計了一個假想實驗來說明這一點。如果設計一個光滑的斜面，光滑面實際上不存在，是假想的。如果把球放在光滑的斜面上，它會滑到哪裡去？根據能量守恆，它應該會想要滑回原本的高度，來回滑動。如果把軌道傾斜一點，球放手之後依然會想要回到原本的高度。如果把傾斜的軌道放得很遠，球會一直往右滑動，直到很遠的地方才會爬上斜面。在這個假想實驗中，伽利略認為，如果沒有力量作用，物體應該維持靜止或等速度運動。力量是用來改變運動狀態的。球在水平面上等速度向右移動，如果從側邊推一下，球的方向會轉彎。所以他認為力量是用來改變物體運動狀態的。',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/20/audio_e04dc8e716.mp3?filename=ha-long-bay-serenity-147067.mp3',
      tags : ['伽利略', '慣性', '假想實驗', '亞里士多德', '力量', '運動狀態', '改變運動狀態', '光滑斜面', '能量守恆', '靜止', '方向改變'],
      learningContentIds: ['Eb-Ⅳ-1', 'Eb-Ⅳ-8'],
      learningPerformanceIds: ['an-Ⅳ-1', 'ai-Ⅳ-1', 'tr-Ⅳ-1', 'tm-Ⅳ-1'],
    },
    {
      title: "3. 伽利略的單擺實驗：探究擺動週期與繩長的關係",
      text: '伽利略的另一個實驗是單擺實驗。故事是這樣的：有一天，他去教堂，看到工人在維修吊燈。他發現吊燈在那邊來回擺動，本來大角度擺動，後來越擺越小，但擺動的週期差不多。所以他設計了實驗，用不同的繩長綁著重錘，來回擺動，看看週期和繩長、質量之間的關係。最後他得出結論，單擺擺動的週期等於2π乘上根號（L/G），L是擺繩的長度。他發現單擺在擺動的時候，週期與擺錘質量無關，只要角度不要太大，來回擺動的週期會維持穩定。因為繩長不變，G重力場的值一樣，所以週期幾乎不變。',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2023/04/20/audio_e04dc8e716.mp3?filename=ha-long-bay-serenity-147067.mp3',
      tags : ['伽利略', '單擺實驗', '擺動週期', '質量', '重力加速度', '等時性', '角度', '重力場', '週期公式', '物理實驗', '數學關係'],
      learningContentIds: ['Eb-Ⅳ-1', 'Eb-Ⅳ-8'],
      learningPerformanceIds: ['an-Ⅳ-1', 'ai-Ⅳ-1', 'tr-Ⅳ-1', 'tm-Ⅳ-1'],
    },
    // 更多段落...
  ]);


  const contentId = 'main-content';
  const messages = ref([
    {text: "你是誰?​", sender: 'user'},
    {text: "我是AI智能助手，專門用來幫助搜尋和回答與學習、課程相關的問題。我可以根據您的需求提供各種資訊，包括課業輔助、解答問題、搜尋資料等，幫助您更好地理解和學習。如果有任何問題，請隨時告訴我！", sender: 'ai', "name":"A.I."},
    {text: "哲學家學派和自然科學家學派的差異是什麼？", sender: 'user'},
    {text: "哲學家學派和自然科學家學派的主要差異在於他們解釋自然現象的方法。哲學家學派（以亞里士多德為代表）依賴主觀的思考和純粹的推理來解釋現象，不需要實驗證據。而自然科學家學派（以伽利略和阿基米德為代表）強調科學實驗，通過觀察、數學論證和實驗來檢驗假設和原理，強調實證方法。這使自然科學家學派在科學進展中扮演了更積極的角色。", sender: 'ai', "name":"A.I."},
    {text: "請解釋何謂光合作用？", sender: 'user', "name":"A.I."},
    {text: "根據本課程的文字稿，光合作用並未被討論。該逐字稿重點介紹的是物理學的簡介、涵蓋範疇以及伽利略的貢獻。如果你需要關於光合作用的解釋，可以幫你尋其他課程的內容，是否要搜尋其它課程的內容？", sender: 'ai', "name":"A.I."},
  ]);

  const accountName = '蘇小鳴';
  const accountType = 'admin';
  const version = '0.0.1';
  
  onMounted(() => {
    
  });
  
  function openChat(){
    menuController.open("chatMenu");
}

function sendMessage(){
    messages.push({text: "fewfw", sender: 'user'});
    scrollToBottom();
}
  
  </script>
  
  <style scoped>
  .segment {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid var(--ion-color-light);
    border-radius: 8px;
  }

  .note-properties-badge{
    margin-left: 1rem;
}

.note-properties-value{
    margin-left: 1rem;
}

.classification-label{
   font-weight: bold    ;
}

.classification-audio{
    width: 100%;
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