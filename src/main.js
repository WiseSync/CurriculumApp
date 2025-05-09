
import { createApp } from 'vue'
import App from './app.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import { alertController } from '@ionic/vue';
/* Theme variables */
//import './theme/variables.css';

let isErrrorDialogOpen = false;

async function showWarningDialog(msg){
    if(!isErrrorDialogOpen){
        const alert = await alertController.create({
            header: '發收未處理錯誤',
            message: msg,
            buttons: ["確定"]
        });
        isErrrorDialogOpen = true;
        await alert.present();
        alert.onDidDismiss().then(() => {
            isErrrorDialogOpen = false;
        });
    }else{
        console.warn('Warning dialog is already open. Ignoring new message:', msg);
    }
}

const app = createApp(App)
  .use(IonicVue)
  .use(router);
  
router.isReady().then(() => {
  app.mount('#app');
});

// Global error handler for Vue 3
app.config.errorHandler = (err, instance, info) => {
    console.error('[Vue Error Handler]', err, info);
    // Show it in an alert
    showWarningDialog(err.message || String(err));
  };
  
  // Optionally handle unhandled rejections (promise-based)
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[unhandledrejection]', event.reason);
    showWarningDialog(event.reason?.message || String(event.reason));
  });
  
  // You can also catch raw window error
  window.addEventListener('error', (event) => {
    console.error('[window.onerror]', event.error);
    showWarningDialog(event.error?.message || String(event.error));
  });