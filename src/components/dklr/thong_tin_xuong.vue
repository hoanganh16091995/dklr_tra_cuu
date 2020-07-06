<template>
  <div style="background: #ffff;">
    <v-layout row wrap class="ml-0">
      <div class="row-header">
        <div class="background-triangle-big"> Thông tin xưởng</div>
        <div class="layout row wrap header_tools row-blue">

          <div class="flex xs12 text-right pr-3" style="margin-left: auto;">
            
            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="saveForm()">
              <v-icon class="mr-2">save</v-icon>
              Ghi lại
            </v-btn>

            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="quayLai()">
              <v-icon class="mr-2">undo</v-icon>
              Quay lại
            </v-btn>

          </div>

        </div>

      </div>
      <input type="hidden" name="registrationId" id="registrationId" :value="thongTinChung['registrationId']">
      <input type="hidden" name="referenceUid" id="referenceUid" :value="thongTinXuong['referenceUid']">
      <v-flex xs12 sm12 class="text-xs-right">
        <v-btn small color="primary" :id="'btn-save-formalpaca' + thongTinXuong['referenceUid']" @click="saveForm()">Ghi lại</v-btn>
      </v-flex>
      <div style="height: 500px; overflow: auto;" :style="{'pointer-events': stateView === 'VIEW' ? 'none' : ''}" class="formAlpacaRegistration" :id="'formPartNo' + thongTinXuong['formNo']" 
        data-referenceuid="thongTinXuong.id" data-formname="thongTinXuong['formName']" data-pk="TTCDN">
        
      </div>
    </v-layout>
  </div>
</template>

<script>
// import supportData from '../store/support_data.json'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  props: ['id'],
  components: {
  },
  data: () => ({
    loading: false,
    loadHomeDataTable: {},
    formTTDN: {},
    stateView: '',
    listRegistrationTemplate: []
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  created () {
    var vm = this
    vm.$nextTick(function () {
      let query = vm.$router.history.current.query
      if (query && query['state']) {
        vm.stateView = query['state']
      } else {
        vm.stateView = ''
      }
    })
  },
  mounted () {
    var vm = this
    if (vm.id && vm.id !== '0') {
      vm.loadForm()
    } else {
      vm.loadRegistrationtemplateThongTinXuong().then(result => {
        console.log('result++++FORM+++++', result)
        vm.addRegistrationForm(result[0])
      })
    }
  },
  computed: {
    thongTinChung () {
      /* eslint-disable */
      let item = this.$store.getters.thongTinChung || {}
      console.log('return item', item)
       return item
      /* eslint-disable */
    },
    thongTinXuong () {
      return this.$store.getters.thongTinXuong || {}
    }
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      // let vm = this
      // let query = newRoute.query
    }
  },
  methods: {
    addRegistrationForm (thongTinXuong) {
      let vm = this
      if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
        console.log('not thongTinChung+++++++', vm.thongTinChung)
        return
      }
      let data = {
        registrationId: vm.thongTinChung['registrationId'],
        formNo: thongTinXuong['formNo']
      }
      vm.$store.dispatch('addForm', data).then(result => {
        vm.$store.commit('setThongTinXuong', result)
        vm.loadForm()
      })
    },
    loadRegistrationtemplateThongTinXuong () {
      let vm = this
      return new Promise((resolve, reject) => {
        if (!vm.listRegistrationTemplate.length) {
          vm.$store.dispatch('loadRegistrationTemplate', {}).then(result => {
            let arrRes = []
            if (result.data) {
              for (var i = 0; i < result.data['length']; i++) {
                if (result.data[i].multiple) {
                  arrRes.push(result.data[i])
                }
              }
            }
            vm.listRegistrationTemplate = arrRes
            console.log('arrRes===============>>>>', arrRes)
            resolve(arrRes)
          }).catch(xhr => {
            vm.listRegistrationTemplate = []
            reject(xhr)
          })
        } else {
          resolve(vm.listRegistrationTemplate)
        }
      })
    },
    loadForm () {
      let vm = this
      if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
        console.log('not thongTinChung+++++++', vm.thongTinChung)
        return
      }
      if (!vm.thongTinXuong || (Object.keys(vm.thongTinXuong).length === 0 && vm.thongTinXuong.constructor === Object)) {
        console.log('not thongTinXuong+++++++', vm.thongTinXuong)
        return
      }
      vm.$store.dispatch('showAlpacaJSFORMRegist', {
        registrationId: vm.thongTinChung['registrationId'],
        referenceUid: vm.thongTinXuong['referenceUid'],
        formNo: vm.thongTinXuong['formNo']
      }).then(result => {
        console.log('resultForm================>>>>', result)
      }).catch(xhr => {
        console.log('error load form================>>>>>', xhr)
      })
    },
    saveForm () {
      let vm = this
      if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
        console.log('not thongTinChung+++++++', vm.thongTinChung)
        return
      }
      if (!vm.thongTinXuong || (Object.keys(vm.thongTinXuong).length === 0 && vm.thongTinXuong.constructor === Object)) {
        console.log('not thongTinXuong+++++++', vm.thongTinXuong)
        return
      }
      var formType = $('#formPartNo' + vm.thongTinXuong['referenceUid'] + ' .formType').val()
      var value = ''
      value = window.$('#formPartNo' + vm.thongTinXuong['formNo']).alpaca('get').getValue();
      var errorMessage = '';
      $('#formPartNo' + vm.thongTinXuong['referenceUid'] + ' div[class*="has-error"] > label').each(function (index) {
        errorMessage = 'notValid'
      })
      if (errorMessage === '' && vm.thongTinXuong['referenceUid']) {
        vm.$store.dispatch('saveForm', {
          registrationId: vm.thongTinChung['registrationId'],
          referenceUid: vm.thongTinXuong['referenceUid'],
          value: value
        }).then(result => {
          toastr.success('Lưu thông tin thành công!')
        }).catch(xhr => {
          toastr.error('Lưu thất bại, vui lòng thử lại!')
          console.log('save form error =====================>>>>', xhr)
        })
      }
    },
    toDetail (index, item) {
      let status = item.requestState
      if (this.type === 'thu_tuc') {
        status = item.documentStatusCode
      }
      this.$router.push('/ho-so/' + this.type + '/' + item.documentName + '/' + item.documentYear + '/' + item.documentTypeCode + '/' + status)
    },
    quayLai () {
      window.history.back()
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
