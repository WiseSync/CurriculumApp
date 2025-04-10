<template>
    <IonModal :isOpen="showAddModal" @didDismiss="hide">
        <ion-header>
            <ion-toolbar>
                <ion-title>加入 YouTube 影片</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="hide">
                        <ion-icon slot="icon-only" :icon="close"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <!-- IonLoading to show while loading orgs/depts -->
        <IonLoading :is-open="showLoading" message="載入中..." />
        <ion-item>
            <ion-label position="stacked">YouTube 網址</ion-label>
            <ion-input v-model="newVideoUrl" type="url" placeholder="請輸入 YouTube 網址"></ion-input>
        </ion-item>

        <ion-item>
            <ion-select label="科目"  label-placement="stacked" v-model="newVideoSubject" interface="popover" placeholder="選擇科目">
                <ion-select-option value="chinese">國文</ion-select-option>
                <ion-select-option value="english">英文</ion-select-option>
                <ion-select-option value="math">數學</ion-select-option>
                <ion-select-option value="nature">自然 (生物/地科/理化)</ion-select-option>
                <ion-select-option value="history">歷史</ion-select-option>
                <ion-select-option value="geography">地理</ion-select-option>
                <ion-select-option value="civics">公民與社會</ion-select-option>
            </ion-select>
        </ion-item>
        <!-- 同一行: Organization  Department -->
        <ion-item>
            <ion-select label="組織/學校"  label-placement="stacked" v-model="selectedOrganizationId" @ionChange="onOrganizationChange($event.detail.value)" interface="popover"  placeholder="選擇組織/學校">
                <ion-select-option v-for="org in organizations" :key="org.id" :value="org.id">
                    {{ org.name }}
                </ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item>
            <ion-select label="部門/班級"  label-placement="stacked" v-model="selectedDepartmentId" placeholder="選擇部門/班級" interface="popover" >
                <ion-select-option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                </ion-select-option>
            </ion-select>
        </ion-item>
        <!-- 上傳時間選擇欄位：使用 IonDatetime 元件 -->
        <ion-content class="ion-padding">
            <IonItem>
                <IonLabel position="stacked">影片時間</IonLabel>
                <!-- IonDatetime 元件，提供日期與時間選擇器，預設值為當前時間 -->
                <IonDatetime v-model="videoTime" />
            </IonItem>
        </ion-content>
        <div class="ion-margin-top">
            <ion-button expand="block" color="primary" @click="submitNewVideo">加入</ion-button>
        </div>
        <ion-label color="danger" id="ion-add-note">{{ addErrorMessage }}</ion-label>

    </IonModal>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonModal,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonDatetime,
    IonLoading,
    IonIcon
} from '@ionic/vue';
import AppConfig from '../app_config';
import { close } from 'ionicons/icons'; // Import the close icon
import Utils from '../utils';

const baseApiUrl = AppConfig.ServiceUrl;
const emits = defineEmits(['onHide', 'onShow']);
const showAddModal = ref(false);
const newVideoUrl = ref("");
const newVideoSubject = ref("");
const addErrorMessage = ref("");
const videoTime = ref('')      // 儲存選擇的上傳時間（日期與時間）

// New data for org & dept
const organizations = ref([]);
const departments = ref([]);
const selectedOrganizationId = ref(null);
const selectedDepartmentId = ref(null);
const showLoading = ref(false);

function getLocalISOString() {
    const date = new Date()
    // 取得與 UTC 的時差（分鐘）再轉為毫秒
    const tzOffsetInMs = date.getTimezoneOffset() * 60000
    // 生成「當前時區」對應的時間
    const localDate = new Date(date.getTime() - tzOffsetInMs)
    // localDate.toISOString() 仍會是 ISO 字串，但會是已做過偏移校正的「本地時區」時間
    // 去掉最後的 'Z'，以免 IonDatetime 解讀為 UTC
    return localDate.toISOString().slice(0, -1)
}

function show() {
    showAddModal.value = true;
    newVideoUrl.value = "";
    newVideoSubject.value = "";
    addErrorMessage.value = "";
    videoTime.value = getLocalISOString(); // 預設為當前時間
    loadOrganizations();
    emits('onShow');
}

function hide() {
    showAddModal.value = false;
    emits('onHide');
}

async function loadOrganizations() {
    showLoading.value = true;
    try {
        const resp = await fetch(`${baseApiUrl}/organizations`);
        if (!resp.ok) {
            console.error('Failed to load organizations');
            return;
        }
        const data = await resp.json();
        organizations.value = data; // array of { id, name }
        if (organizations.value.length > 0) {
            selectedOrganizationId.value = organizations.value[0].id;
            await loadDepartments(selectedOrganizationId.value);
        }
    } catch (err) {
        console.error('Error loading organizations:', err);
    } finally {
        showLoading.value = false;
    }
}

async function loadDepartments(orgId) {
    showLoading.value = true;
    try {
        const resp = await fetch(`${baseApiUrl}/organizations/${orgId}/departments`);
        if (!resp.ok) {
            console.error('Failed to load departments');
            return;
        }
        const data = await resp.json();
        departments.value = data; // array of { id, name }
        if (departments.value.length > 0) {
            selectedDepartmentId.value = departments.value[0].id;
        } else {
            selectedDepartmentId.value = null;
        }
    } catch (err) {
        console.error('Error loading departments:', err);
    } finally {
        showLoading.value = false;
    }
}

async function onOrganizationChange(value) {
    selectedOrganizationId.value = value;
    await loadDepartments(value);
}


async function submitNewVideo() {
    if (newVideoUrl.value) {
        //Check valid YouTube URL
        const youtubeRegex = new RegExp(
            '^(https?:\\/\\/)?(www\\.)?(' +
            // 1) youtube.com/watch? with anything, then v=, then 11 chars, then anything
            'youtube\\.com\\/watch\\?.*v=[\\w-]{11}.*' +
            '|' +
            // 2) short link: youtu.be/ + 11 chars + optional extra
            'youtu\\.be\\/[\\w-]{11}.*' +
            ')$'
        );
        if (!Utils.isYoutubeUrl(newVideoUrl.value)) {
            addErrorMessage.value = "請輸入有效的 YouTube 網址";
            return;
        }
    } else {
        addErrorMessage.value = "請輸入有效的 YouTube 網址";
        return;
    }

    if (!newVideoSubject.value) {
        addErrorMessage.value = "請選擇科目";
        return;
    }

    if (!selectedOrganizationId.value) {
        addErrorMessage.value = '請選擇組織';
        return;
    }
    if (!selectedDepartmentId.value) {
        addErrorMessage.value = '請選擇部門';
        return;
    }

    const localTime = new Date(videoTime.value);

    const requestBody = {
        department_id: selectedDepartmentId.value,
        url: newVideoUrl.value,
        subject: newVideoSubject.value,
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