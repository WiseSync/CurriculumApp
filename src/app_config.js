'use strict'

const PORT = 8080;
const url = new URL(window.location.href);
let BaseUrl = '';
if (url.hostname === 'localhost') {
    BaseUrl = `http://localhost:${PORT}`;
} else {
    BaseUrl = `${url.protocol}//${url.hostname}:${BasePort}`;
}
export default class AppConfig {
    static ASRServiceUrl= 'ws://localhost:8080';
    static LLMServiceUrl= "http://114.34.190.146:8081";
    static ServiceUrl= BaseUrl;
}