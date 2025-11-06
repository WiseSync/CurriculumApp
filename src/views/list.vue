<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button menu="listCommonMenu" aria-label="開啟選單"></ion-menu-button>
                </ion-buttons>
                <ion-title>課程列表</ion-title>

            </ion-toolbar>
        </ion-header>
        <CommonMenu content-id="ListContent" menu-id="listCommonMenu" />
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton @click="openAddVideoAlert" aria-label="新增影片">
                <IonIcon :icon="add" aria-hidden="true"/> <!-- displays a "+" icon -->
            </IonFabButton>
        </IonFab>
        <IonContent id="ListContent" role="main" aria-labelledby="page-title">

            <h1 id="page-title" class="visually-hidden">課程列表</h1>
            <p id="videos-status" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{{ videosStatus }}</p>
            <IonList id="courses-list" role="list" :aria-describedby="'videos-status'">
                <IonItem v-for="video in courses" :key="video.id" button="true" @click="onVideoClick(video)" :aria-labelledby="`video-${video.id}-title`">
                    <!-- YouTube Thumbnail -->
                    <IonThumbnail slot="start">
                        <IonImg :src="getThumbnailUrl(video)" :alt="video.title+'的縮圖'" />
                    </IonThumbnail>

                    <!-- Title and status info -->
                    <IonLabel>
                        <h3 :id="`video-${video.id}-title`">{{ Utils.subjectText(video.subject) + "科: " + (video.title === null ? "無標題" : video.title) }}</h3>
                        <!-- Error message displayed if status is error: -->
                        <IonLabel color="medium" style="font-size: small;">
                            {{ timeText(video.duration) }}
                        </IonLabel>
                        <IonNote v-if="video.status === 'error'" color="danger">
                            失敗: {{ video.error }}
                        </IonNote>
                        <IonNote v-else color="medium">
                            {{ Utils.statusText(video.status) }}
                        </IonNote>
                        <!-- Progress bar for processing states: -->
                        <IonProgressBar v-if="video.status !== 'done' && video.status !== 'error'"
                            :value="getProgressValue(video.status)" color="medium"
                            role="progressbar"
                            aria-label="處理進度"
                            aria-valuemin="0" aria-valuemax="100"
                            :aria-valuenow="Math.round(getProgressValue(video.status) * 100)"
                            :aria-valuetext="Utils.statusText(video.status)">
                        </IonProgressBar>
                    </IonLabel>

                    <!-- Delete icon (trash can) -->
                    <IonButton slot="end" v-if="video.status === 'error'" @click.stop="resumeVideo(video.id)" :aria-label="`重新處理：${video.title === null ? '無標題' : video.title}`" type="button">
                        <IonIcon :icon="refresh" aria-hidden="true" slot="icon-only" />
                    </IonButton>
                    <IonButton slot="end" color="danger" @click.stop="deleteVideo(video)" :aria-label="`刪除：${video.title === null ? '無標題' : video.title}`" type="button">
                        <IonIcon :icon="trash" aria-hidden="true" slot="icon-only" />
                    </IonButton>
                </IonItem>
            </IonList>
        </IonContent>
        <add_video ref="addVideoDialog" @onHide="fetchCourses" />
        <IonLoading :is-open="showLoading" message="載入中..." />
    </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
    IonList, IonItem, IonThumbnail, IonImg, IonLabel, IonNote, IonProgressBar, alertController,
    IonIcon, IonButton, IonFab, IonFabButton, IonPage, IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton,
    IonContent,onIonViewDidEnter,onIonViewWillLeave, IonLoading
} from '@ionic/vue';
import { add, trash, refresh } from 'ionicons/icons';  // (importing the icon if needed for IonFabButton)
import AppConfig from '../app_config';
import add_video from '../components/add_video.vue';
import Utils from '../utils';
import { useRouter } from 'vue-router';
import CommonMenu from '../components/menu.vue';

const baseApiUrl = AppConfig.ServiceUrl;
const courses = ref([]);
const addVideoDialog = ref(null);
const router = useRouter();
const showLoading = ref(false);
const videosStatus = computed(() => courses.value.length ? `共 ${courses.value.length} 筆課程` : '目前無課程');


function openAddVideoAlert() {
    // Open the add video dialog
    addVideoDialog.value.show();
}

function timeText(ms) {
    // Convert milliseconds to seconds
    ms = Math.floor(ms / 1000);
    // If less than 1 second, return "0秒"
    if (ms < 1) return "0秒";
    // Convert time in seconds to a human-readable format
    const minutes = Math.floor(ms / 60);
    const seconds = Math.floor(ms % 60);
    const hours = Math.floor(minutes / 60);
    const minutesText = minutes % 60;
    return `${hours > 0 ? hours + '小時' : ''}${minutesText > 0 ? minutesText + '分鐘' : ''}${seconds > 0 ? seconds + '秒' : ''}`;
}





function getProgressValue(status) {
    // The order of stages from start (0%) to completion (100%)
    const stages = [
        "idle",
        "download",
        "split-audio",
        "transcribe",
        "split-text",
        "coding",
        "done",
    ];

    // Find the index of the current status
    const idx = stages.indexOf(status);
    // If the status is not recognized or is "error", return 0
    if (idx < 0) {
        return 0;
    }
    // Convert index to a 0-1 fraction
    // If status is "done", this yields 1.0
    return idx / (stages.length - 1);
}

async function deleteVideo(video) {
    // Delete the video and refresh the list
    const alert = await alertController.create({
        header: '刪除影片',
        subHeader: '這個動作無法復原',
        message: '請確認是否要刪除這個影片: ' + (video.title === null ? "無標題" : video.title) + '?',
        buttons: ["取消", {
            text: '刪除',
            handler: async () => {
                await fetch(`${baseApiUrl}/sessions/${video.id}`, { method: 'DELETE' });
                fetchCourses();
            }
        }]
    });
    await alert.present();
}

async function resumeVideo(videoId) {
    // Retry logic for a specific video
    await fetch(`${baseApiUrl}/sessions/${videoId}/resume`, { method: 'POST' });
    // Optionally refresh the list to update status immediately
    fetchCourses();
}

async function onVideoClick(video) {
    if (video.status === 'done') {
        // Navigate to detail page for this video
        router.push({ name: 'Note', params: { sessionId: video.id, type:"alignment" } });
    } else if (video.status === 'error') {
        // Resume processing this video
        await fetch(`${baseApiUrl}/sessions/${video.id}/resume`, { method: 'POST' });
        // Optionally refresh the list to update status immediately
        fetchCourses();
    }
    // (No action if video is still processing)
}

/**
* Extracts the 'v' parameter from a typical YouTube URL,
* then returns the corresponding thumbnail.
*/
function getThumbnailUrl(video) {
    // Example: video.url = "https://www.youtube.com/watch?v=XYZ123"
    // or short link like "https://youtu.be/XYZ123"
    const url = video.url;
    if (!url) {
        // fallback image or default thumbnail if no url
        return 'https://img.youtube.com/vi/xyz/default.jpg';
    }

    try {
        // 1) Try parsing as a normal watch URL (e.g. youtube.com/watch?v=...)
        const parsed = new URL(url);
        const v = parsed.searchParams.get('v');
        if (v) {
            return `https://img.youtube.com/vi/${v}/default.jpg`;
        }

        // 2) If there's no 'v' param, maybe it's a youtu.be short link, e.g. youtu.be/XYZ
        // The path after '/' is the video ID
        // Example: https://youtu.be/XYZ123
        // parsed.pathname might be "/XYZ123"
        const pathname = parsed.pathname;
        if (pathname.length > 1) {
            const vid = pathname.slice(1); // remove the leading '/'
            return `https://img.youtube.com/vi/${vid}/default.jpg`;
        }
    } catch (err) {
        //console.warn('Failed to parse YouTube URL.', err);
    }

    // Fallback (invalid or unknown format)
    return 'https://img.youtube.com/vi/xyz/default.jpg';
}

async function fetchCourses() {
    try{
        const res = await fetch(`${baseApiUrl}/sessions`);
        courses.value = await res.json();
    }finally{
        setTimeout(() => {
            showLoading.value = false;
        }, 60);
    }
}



let pollInterval;

onIonViewDidEnter(()=>{
    showLoading.value = true;
    fetchCourses();
    // Poll every 15 seconds:
    pollInterval = setInterval(fetchCourses, 15000);
});

onIonViewWillLeave(() => {
    if (pollInterval) clearInterval(pollInterval);
    showLoading.value = false;
});

</script>
<style scoped>
#ion-add-note {
    display: flex;
    justify-content: center;
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
