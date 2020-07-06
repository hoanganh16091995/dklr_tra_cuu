<template>
  <div>
    <v-navigation-drawer absolute clipped floating width="350" style="overflow: auto;">
      <jx-hanghai-filter-left
				ref="filterleft"
			>
			</jx-hanghai-filter-left>
    </v-navigation-drawer>
    
    <div style="float: right; width: calc(100% - 350px);">
      <router-view></router-view>
    </div>
    
  </div>
</template>

<script>
import FilterLeft from './dklr/hanghai_filter_left.vue'
import supportData from '../store/support_data.json'
// import axios from 'axios'

export default {
  props: {},
  components: {
    'jx-hanghai-filter-left': FilterLeft
  },
  data: () => ({
    docTypes: [],
    roleFilterStatus: [],
    initData: null,
    counterHoSoAll: '',
    counterHoSoKeHoachTable: '',
    counterHoSoThuTucTable: '',
    cang_vu_name: '',
    tau_den_rois: [],
    quoc_tichs: supportData.data_state,
    khu_cuc_cangs: [],
    cang_den_tiep_theos: [],
    callBack: true,
    getFilterADVDataAPI: ''
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      vm.$store.dispatch('loadInitResource').then(function (result) {
      })
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  updated () {
    let vm = this
    vm.$nextTick(function () {
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
    }
  },
  methods: {
  }
}
</script>
