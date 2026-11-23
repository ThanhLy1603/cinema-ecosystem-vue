import './assets/main.css';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp, type App as VueApp } from 'vue';

import App from './App.vue';
import { vueQueryPluginOptions } from './plugins/vueQuery';
import router from './router';

const app: VueApp = createApp(App);

app.use(createPinia());
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(router);

app.mount('#app');
