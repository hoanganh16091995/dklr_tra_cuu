<template>
  <div>
    <v-layout row wrap>
      
    </v-layout>
  </div>
</template>

<script>
import supportData from '../store/support_data.json'

export default {
  props: ['type', 'documentTypeCode', 'documentStatusCode'],
  components: {
  },
  data: () => ({
    loading: false,
    supportData: supportData,
    loadHomeDataTable: {},
    headers: [],
    payment: false,
    dataImportItems: [],
    dataImportTotal: 0,
    pageImportTable: 1,
    headersImport: [],
    paymentTypeData: {},
    paymentMarkDelete: {}
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
      vm.headersImport = vm.supportData.headersImport
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      if (!vm.loadHomeDataTable.hasOwnProperty('data')) {
        let query = vm.$router.history.current.query
        if (query && query.hasOwnProperty('page') && query['page'] !== 1) {
          vm.pageImportTable = parseInt(query['page']) || 1
        } else {
          vm.pageImportTable = 1
        }
        let param = null
        param = {
          start: vm.pageImportTable * 15 - 15,
          end: vm.pageImportTable * 15
        }
        vm.loading = true
        vm.$store.dispatch('loadHomeDataTable', param).then(function (result) {
          vm.dataImportItems = result['data'] || []
          vm.dataImportTotal = result['total'] || 0
          vm.loading = false
        }).catch(xhr => {
          vm.loading = false
        })
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      let vm = this
      let query = newRoute.query
      if (query && query.hasOwnProperty('page') && query['page']) {
        vm.pageImportTable = parseInt(query['page']) || 1
      } else {
        vm.pageImportTable = 1
      }
      let param = null
      param = {
        start: vm.pageImportTable * 15 - 15,
        end: vm.pageImportTable * 15
      }
      for (var key in query) {
        if (key !== 'page') {
          param[key] = query[key]
        }
      }
      vm.$store.dispatch('loadHomeDataTable', param).then(function (result) {
        vm.loadHomeDataTable = result
        vm.loading = false
      }).catch(xhr => {
        vm.loading = false
      })
    }
  },
  methods: {
    paggingDataImport (config) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      let queryString = '?'
      newQuery['page'] = ''
      for (let key in newQuery) {
        if (newQuery[key] !== '' && newQuery[key] !== 'undefined' && newQuery[key] !== undefined) {
          queryString += key + '=' + newQuery[key] + '&'
        }
      }
      queryString += 'page=' + config.page
      vm.$router.push({
        path: current.path + queryString
      })
    },
    toDetail (index, item) {
      let status = item.requestState
      if (this.type === 'thu_tuc') {
        status = item.documentStatusCode
      }
      this.$router.push('/ho-so/' + this.type + '/' + item.documentName + '/' + item.documentYear + '/' + item.documentTypeCode + '/' + status)
    }
  },
  filters: {
    money (value) {
      if (value) {
        var moneyCur = (value / 1).toFixed(0).replace('.', ',')
        return moneyCur.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ'
      } else {
        return ''
      }
    }
  }
}
</script>