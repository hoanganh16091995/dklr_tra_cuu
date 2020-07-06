import 'vuetify/dist/vuetify.min.css'
import 'toastr/build/toastr.min.css'
import './stylus/main.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { store } from './store'
import VueContentPlaceholders from 'vue-content-placeholders'
import VueMoment from 'vue-moment'
import Datetime from 'vue-datetime-2'
import eventBus from './event-bus/eventBus'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import currency from 'v-currency-field'
import 'v-currency-field/dist/index.css'

Vue.use(VuejsDialog)
Vue.use(VueMoment)
Vue.use(VueContentPlaceholders)
Vue.use(Vuetify)
Vue.use(Datetime)
Vue.use(currency)

export { eventBus }

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App),
  props: ['type', 'documentTypeCode', 'documentStatusCode'],
  created () {
    var vm = this
    vm.$nextTick(function () {
      var url = window.location.href
      let coma = window.location.href.lastIndexOf('#/')
      url = window.location.href.substr(coma, url.length) ? window.location.href.substr(coma, url.length) : ''
      // if (window.location.href.indexOf('ho-so') <= 0) {}
      if (url === '#/' || !url) {
        vm.$store.dispatch('loadInitResource').then(function (result) {
          router.push('/tra-cuu')
        })
      }
    })
  }
})
