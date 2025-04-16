<template>
    <IonModal :isOpen="showAddModal" @didDismiss="hide">
        <ion-header>
            <ion-toolbar>
                <ion-title>加入課程</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="hide">
                        <ion-icon slot="icon-only" :icon="close"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <!-- IonLoading to show while loading orgs/depts -->
        <ion-segment v-model="uploadMode" style="margin: 1rem;" @ion-change="onSegmentChanged">
            <ion-segment-button value="youtube" content-id="youtube">
                <ion-label>YouTube</ion-label>
            </ion-segment-button>
            <ion-segment-button value="local" content-id="local">
                <ion-label>本地檔案</ion-label>
            </ion-segment-button>
        </ion-segment>
        <!-- If in YouTube mode, show the original YouTube fields -->
        <ion-segment-view>
        <ion-segment-content id="youtube">
            <ion-item>
                <ion-label position="stacked">YouTube 網址</ion-label>
                <ion-input v-model="newVideoUrl" type="url" placeholder="請輸入 YouTube 網址"></ion-input>
            </ion-item>
            <add_video_common ref="youtubeCommonRef"/>   
        </ion-segment-content>
        <!-- If in Local mode, show local file fields + teacher + localTitle -->
        <ion-segment-content id="local">
            <ion-item>
                <ion-label position="stacked">選擇檔案</ion-label>
                <input type="file" @change="onFileSelected" style="margin-top: 0.5rem;" accept="audio/*, video/*" />
            </ion-item>
            <ion-item>
                <ion-label position="stacked">教師名稱</ion-label>
                <ion-input v-model="localTeacher" placeholder="輸入教師名稱"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="stacked">影片/音訊標題</ion-label>
                <ion-input v-model="localTitle" placeholder="輸入標題"></ion-input>
            </ion-item>
        <add_video_common ref="localFileCommonRef"/>    
        </ion-segment-content>
    </ion-segment-view>
    <ion-label color="danger">{{ addErrorMessage }}</ion-label>
    <div class="ion-margin-top">
        <ion-button expand="block" color="primary" @click="submit">加入</ion-button>
    </div>

    </IonModal>

</template>

<script setup>
import { ref } from 'vue';
import {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonModal,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLoading,
    IonIcon,
    IonSegment,
    IonSegmentContent,
    IonSegmentButton,
    IonSegmentView
} from '@ionic/vue';
import AppConfig from '../app_config';
import { close } from 'ionicons/icons'; // Import the close icon
import Utils from '../utils';
import add_video_common from './add_video_common.vue';

const baseApiUrl = AppConfig.ServiceUrl;
const emits = defineEmits(['onHide', 'onShow']);
const showAddModal = ref(false);
const newVideoUrl = ref("");
//const newVideoSubject = ref("");
const addErrorMessage = ref("");
const youtubeCommonRef = ref(null); // 取得 add_video_common 的引用
const localFileCommonRef = ref(null); // 取得 add_video_common 的引用

// New data for org & dept
//const showLoading = ref(false);
const uploadMode = ref('youtube'); // 新增的變數，用於選擇上傳模式
const localTeacher = ref("");
const localTitle = ref("");
const selectedFile = ref(null); // 儲存選擇的檔案


function onSegmentChanged(event) {
    if (uploadMode.value === 'youtube') {
        youtubeCommonRef.value.update(); // 更新 YouTube 的欄位
    } else if (uploadMode.value === 'local') {
        localFileCommonRef.value.update(); // 更新 Local File 的欄位
    }else{
        addErrorMessage.value = "Invalid upload mode: "+uploadMode.value;
    }
}


function show() {
    showAddModal.value = true;
    newVideoUrl.value = "";
    //newVideoSubject.value = "";
    addErrorMessage.value = "";
    uploadMode.value = 'youtube'; // 預設為 YouTube 模式
    setTimeout(() => {
        youtubeCommonRef.value.update(); // 更新 YouTube 的欄位
    }, 18); // 延遲更新，確保 DOM 已經渲染完成
    //youtubeCommonRef.value.update(); // 更新 YouTube 的欄位
    //videoTime.value = getLocalISOString(); // 預設為當前時間
    //loadOrganizations();
    emits('onShow');
}

function hide() {
    showAddModal.value = false;
    emits('onHide');
}

function onFileSelected(evt) {
  const fileList = evt.target.files;
  if (fileList && fileList[0]) {
    selectedFile.value = fileList[0];
  }
}

// ...

async function submitLocalFile() {
  // validations
  if (!selectedFile.value) {
    addErrorMessage.value = '請選擇檔案';
    return;
  }
  if (!localTeacher.value) {
    addErrorMessage.value = '請輸入教師名稱';
    return;
  }
  if (!localTitle.value) {
    addErrorMessage.value = '請輸入標題';
    return;
  }
  if (!localFileCommonRef.value.newVideoSubject) {
    addErrorMessage.value = '請選擇科目';
    return;
  }

  if (!youtubeCommonRef.value.selectedDepartmentId) {
    addErrorMessage.value = '請選擇部門';
    return;
  }
  const localTime = new Date(localFileCommonRef.value.videoTime);

  const fd = new FormData();
  fd.append('department_id', localFileCommonRef.value.selectedDepartmentId);
  fd.append('subject', localFileCommonRef.value.newVideoSubject);
  fd.append('teacher', localTeacher.value);
  fd.append('time', localTime.toISOString());
  fd.append('title', localTitle.value);
  fd.append('file', selectedFile.value);

  try {
    const res = await fetch(`${baseApiUrl}/sessions/uploadlocal`, {
      method: 'POST',
      body: fd
    });
    if (!res.ok) {
      const text = await res.text();
      addErrorMessage.value = text || res.statusText;
      return;
    }
  } catch (error) {
    console.error('Error uploading local file:', error);
    addErrorMessage.value = error.message;
    return;
  }
  hide();
}


async function submit(){
    if(uploadMode.value === 'youtube'){
        await submitYouTube();
    }else if(uploadMode.value === 'local'){
        await submitLocalFile();
    }else{
        addErrorMessage.value = "Invalid upload mode: "+uploadMode.value;
    }
}

async function submitYouTube() {
    if (newVideoUrl.value) {
        //Check valid YouTube URL
        if (!Utils.isYoutubeUrl(newVideoUrl.value)) {
            addErrorMessage.value = "請輸入有效的 YouTube 網址";
            return;
        }
    } else {
        addErrorMessage.value = "請輸入有效的 YouTube 網址";
        return;
    }
    console.log(youtubeCommonRef.value.newVideoSubject);
    if (!youtubeCommonRef.value.newVideoSubject) {
        addErrorMessage.value = "請選擇科目";
        return;
    }

    if (!youtubeCommonRef.value.selectedDepartmentId) {
        addErrorMessage.value = '請選擇部門';
        return;
    }

    const localTime = new Date(youtubeCommonRef.value.videoTime);

    const requestBody = {
        department_id: youtubeCommonRef.value.selectedDepartmentId,
        url: newVideoUrl.value,
        subject: youtubeCommonRef.value.newVideoSubject,
        time: localTime.toISOString(), // 使用選擇的上傳時間
    };
    try {
        const res = await fetch(`${baseApiUrl}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        if (!res.ok) {
            const text = await res.text();
            addErrorMessage.value = text || res.statusText;
            //console.error('Failed to add video:', res.status, res.j);
            return;
        }
    } catch (error) {
        console.error('Error adding video:', error);
        addErrorMessage.value = error.message;
        return;
    }
    // close modal
    hide();
}



defineExpose({
    show,
    hide
});

</script>