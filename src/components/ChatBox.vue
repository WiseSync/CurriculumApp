<template>
    <ion-page>
      <ion-header :translucent="true">
        <!-- Optionally a title or close button if needed -->
        <ion-toolbar>
          <ion-title>AI小助手</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">
                <ion-icon :icon="close" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <!-- Chat Box -->
        <section class="chat-box" >
          <div class="messages" ref="contentRef">
            <!-- Loop through dialogHistory to display messages -->
            <div v-for="(item, idx) in dialogHistory" :key="idx">
              <div v-if="item.role !== 'system'" :class="['message', item.role==='user' ? 'user' : 'bot']">
                <!-- Bot Avatar -->
                <img
                  src="../../assets/images/ai_Avatar.png"
                  alt="Bot Avatar"
                  class="avatar-img"
                  v-if="item.role==='assistant'"
                />
                <!-- Message Content -->
                <div :class="['message-content', item.role==='user' ? 'right' : 'left']">
                  <p :class="[item.role==='user' ? 'user-text' : 'bot-text']">
                    <span style = "white-space: pre-wrap;">{{ item.content }}
                    </span>
                    
                  </p>
                </div>
                <!-- User Avatar -->
                <img
                  :src="props.userAvatar"
                  alt="User Avatar"
                  class="avatar-img right-avatar"
                  v-if="item.role==='user'"
                />
              </div>
            </div>
          </div>
  
          <!-- Input Box -->
          <div class="input-box">
            <ion-input
              class="ChatInput"
              placeholder="Say something..."
              ref="chatInput"
              @ionChange="onInputChange"
                @keyup.enter="send"
            />
            <ion-button color="secondary" @click="send" :disabled="isSendBtnDisabled"
              >送出</ion-button
            >
          </div>
        </section>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonInput,
    IonIcon
  } from '@ionic/vue';
  import { ref, onMounted } from 'vue';
  import AppConfig from '../app_config';
  import {close} from 'ionicons/icons';
  const props = defineProps(['userAvatar', 'dialogHistory']);
  const emit = defineEmits(['closed']);
  const contentRef = ref(null);

  
  const chatInput = ref(null);
  const isSendBtnDisabled = ref(false);

  
  function closeModal() {
    // If parent is controlling the IonModal with is-open, parent should do the close logic.
    // Alternatively, if you're using IonModal's built-in .dismiss() approach, you can do:
    // const modal = useIonModal();
    // modal.dismiss();
    // But that approach requires some usage changes in IonModal. 
    // We'll just navigate back for demonstration:
    //router.back(); // Or call parent's method
    emit('closed');
  }
  
  // onMounted
  onMounted(() => {
    // Prevent context menu if desired
    document.addEventListener('contextmenu', evt => evt.preventDefault());
  });
  
  // The "onIonChange" event from the IonInput
  function onInputChange(e) {
    // e.detail.value is the typed text
    // We might store it in some local ref
    //lastInputText = e.detail.value;
  }

  function scrollToBottom() {
    setTimeout(() => {
      contentRef.value.scrollTop = contentRef.value.scrollHeight;
    }, 18);
  }
  
  // The function to handle sending messages
  async function send() {
    if (!chatInput.value) return;
  
    // read IonInput's .value
    const typedValue = chatInput.value.$el.value?.trim();
    if (!typedValue) return;
  
    // Push user message
    props.dialogHistory.push({ role: 'user', content: typedValue });
    scrollToBottom();
  
    // Clear input
    chatInput.value.$el.value = '';
    
  
    // Construct messages array
    const messages = props.dialogHistory.map((item) => {
      return { role: item.role, content: item.content };
    });
  
    await sendMsg(messages);
    isSendBtnDisabled.value = false;
  }


  
  // Actually calls the remote openAI function
  async function sendMsg(messages) {
    if(isSendBtnDisabled.value) return;
    isSendBtnDisabled.value = true;
    const resp = await fetch(
      AppConfig.ServiceUrl + '/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages),
      }
    );

    if (!resp.ok) {
      console.error('Error: ' + resp.statusText);
      throw new Error('Network response was not ok');
    }

    const data = await resp.json();
  
    if (data?.choices?.length && data.choices[0].message?.content) {
      const assistantReply = data.choices[0].message.content;
      // Optional TTS 
      /*
      const utter = new SpeechSynthesisUtterance(assistantReply);
      utter.lang = 'zh-TW';
      speechSynthesis.speak(utter);*/
  
      // Append AI message
      props.dialogHistory.push({ role: 'assistant', content: assistantReply });
        //console.log(contentRef.value.scrollHeight);
        scrollToBottom();
      //contentRef.value.scrollTop = contentRef.value.scrollHeight;
    } else {
      console.error('Error: ' + JSON.stringify(data));
    }
  }
  </script>
  
  <style scoped>
  
  .header-logo img {
    max-width: 200px;
    margin: 0 auto;
    display: block;
  }
  
  /* Basic chat style from your snippet */
  .chat-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0 auto;
    max-width: 600px;
    border: 1px solid #eee;
    background-color: #fff;
    position: relative;
  }
  
  .messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
  }
  
  .message {
    display: flex;
    margin-bottom: 10px;
    align-items: flex-start;
  }
  .message.bot {
    justify-content: flex-start;
  }
  .message.user {
    justify-content: flex-end;
  }
  
  .avatar-img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 8px;
  }
  .right-avatar {
    margin-left: 8px;
    margin-right: 0;
  }
  
  .message-content {
    max-width: 65%;
    word-wrap: break-word;
  }
/* Text Bubble Styles */
.bot-text, .user-text {
    max-width: 100%;
    padding: 10px;
    border-radius: 15px;
    font-size: 16px;
    line-height: 1.4;
}

.user-text {
    background-color: #f5f5f5;
    color: #D87C04;
    text-align: right;
}

.bot-text {
    background-color: #b8b8b8;
    color: #eeeeee;
    text-align: left;
}

/* Input Box Styles */
.input-box {
    position: relative;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    padding: 10px;
    background-color: #000;
    border-top: 2px solid #ddd;
    z-index: 1000;
}

.input-box input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
}

.send-btn {
    background-color: rgb(245, 140, 31);
    color: white;
    border: none;
    padding: 10px 20px;
    margin-left: 10px;
    border-radius: 5px;
    cursor: pointer;
}
  
  .input-box {
    display: flex;
    padding: 10px;
    background-color: #f8f8f8;
  }
  ion-input.ChatInput {
    flex: 1;
    margin-right: 6px;
  }
  </style>