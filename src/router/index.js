import Vue from 'vue'
import Router from 'vue-router'
import HomeDataTable from '@/components/Home_data_table.vue'
import Home from '@/components/Home.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/tra-cuu',
          component: HomeDataTable,
          props: true
        },
        {
          path: '/tra-cuu/:codeTable',
          component: HomeDataTable,
          props: true
        }
      ],
      props: true
    }
  ]
})
