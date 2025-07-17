import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { plugin, defaultConfig } from '@formkit/vue'
import { createProPlugin, inputs } from '@formkit/pro'
import { rootClasses } from '../formkit.theme'
import { icons } from '@formkit/icons'
const pro = createProPlugin('fk-7b820fe459a', inputs)
import { createVuetify } from 'vuetify';
import '@jsonforms/vue-vuetify/lib/jsonforms-vue-vuetify.css';
import { aliases as mdiAliases, mdi } from 'vuetify/iconsets/mdi';
import { mdiIconAliases } from '@jsonforms/vue-vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
    aliases: { ...mdiAliases, ...mdiIconAliases },
  },
});


app.use(router)
app.use(vuetify);
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
