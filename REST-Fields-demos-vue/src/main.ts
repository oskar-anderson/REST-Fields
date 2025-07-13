import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { plugin, defaultConfig } from '@formkit/vue'
import { createProPlugin, inputs } from '@formkit/pro'
import { rootClasses } from '../formkit.theme'
import { icons } from '@formkit/icons'
const pro = createProPlugin('fk-7b820fe459a', inputs)

const app = createApp(App)
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'


app.use(router)
app.use(VueMonacoEditorPlugin, {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  },
})
app.use(plugin, defaultConfig(
  {
    plugins: [pro], 
    config: { rootClasses }, 
    icons: icons
  }
))

app.mount('#app')
