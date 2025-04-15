<template>
        <ion-item>
            <ion-select label="科目" label-placement="stacked" v-model="newVideoSubject" interface="popover"
                placeholder="選擇科目">
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
            <ion-select label="組織/學校" label-placement="stacked" v-model="selectedOrganizationId"
                @ionChange="onOrganizationChange($event.detail.value)" interface="popover" placeholder="選擇組織/學校">
                <ion-select-option v-for="org in organizations" :key="org.id" :value="org.id">
                    {{ org.name }}
                </ion-select-option>
            </ion-select>
        </ion-item>
        <ion-item>
            <ion-select label="部門/班級" label-placement="stacked" v-model="selectedDepartmentId" placeholder="選擇部門/班級"
                interface="popover">
                <ion-select-option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                </ion-select-option>
            </ion-select>
        </ion-item>
        <!-- 上傳時間選擇欄位：使用 IonDatetime 元件 -->
            <IonItem>
                <IonLabel position="stacked">授課開始時間</IonLabel>
                <!-- IonDatetime 元件，提供日期與時間選擇器，預設值為當前時間 -->
                <IonDatetime v-model="videoTime" />
            </IonItem>
            <IonLoading :is-open="showLoading" message="載入中..." />
</template>

<script setup>
import { IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonLoading
 } from '@ionic/vue';
import { ref} from 'vue';
import AppConfig from '../app_config';

const organizations = ref([]);
const departments = ref([]);
const selectedOrganizationId = ref(null);
const selectedDepartmentId = ref(null);
const newVideoSubject = ref('');
const videoTime = ref(new Date().toISOString().slice(0, 16)); // YYYY-MM-DDTHH:mm
const showLoading = ref(false);
const baseApiUrl = AppConfig.ServiceUrl;

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

const update = ()=>{
    newVideoSubject.value = '';
    videoTime.value = getLocalISOString();
    loadOrganizations();
};

defineExpose({
    organizations,
    departments,
    selectedOrganizationId,
    selectedDepartmentId,
    newVideoSubject,
    videoTime,
    update
});



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

</script>
