'use strict'

const BasePort = 8080;
const url = new URL(window.location.href);
let BaseUrl = '';
if (url.hostname === 'localhost') {
    BaseUrl = `http://localhost:${BasePort}`;
} else {
    BaseUrl = "https://ej6clo2cklahc0-8080.proxy.runpod.net";
}
export default class AppConfig {
    static ASRServiceUrl= 'ws://localhost:8081';
    static LLMServiceUrl= "http://114.34.190.146:8081";
    static ServiceUrl= BaseUrl;
}