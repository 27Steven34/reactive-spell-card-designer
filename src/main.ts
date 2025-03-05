import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import vueDompurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import FontAwesomeIcon from './components/icons/font-awesom-icons'
import customDirectives from './directives'
import router from './router'

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(vueDompurifyHTML, {
  default: {
    ALLOWED_TAGS: [
      'em',
      'i',
      'b',
      'strong',
      'mark',
      's',
      'sub',
      'small',
      'sup',
      'q',
      'br',
      'wbr',
      'code',
    ],
  },
})

customDirectives.forEach((element) => {
  app.directive(element.name, element.hooks)
})

app.mount('#app')
