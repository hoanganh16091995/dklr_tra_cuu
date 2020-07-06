<template>
  <div style="background: #ffff;">
    <div class="ml-0">
      <div class="row-header">
        <div class="background-triangle-big"> Thông tin chung doanh nghiệp</div>
        <div class="layout row wrap header_tools row-blue">

          <div class="flex xs12 text-right pr-3" style="margin-left: auto;">
            
            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="saveRegistration(0)">
              <v-icon class="mr-2">save</v-icon>
              Lưu nháp
            </v-btn>

            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="saveRegistration(1)">
              <v-icon class="mr-2">send</v-icon>
              Gửi
            </v-btn>

            <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="quayLai()">
              <v-icon class="mr-2">undo</v-icon>
              Quay lại
            </v-btn>

          </div>

        </div>

      </div>
      <v-layout row wrap class="pt-2 ml-0">
        <input type="hidden" name="registrationId" id="registrationId" :value="id">
        <input type="hidden" name="referenceUid" id="referenceUid" :value="thongTinDoanhNghiep['referenceUid']">
        <v-flex xs12 sm12 class="text-xs-right">
          <v-btn small color="primary" :id="'btn-save-formalpaca' + thongTinDoanhNghiep['referenceUid']" @click="saveForm()">Ghi lại</v-btn>
        </v-flex>
        <v-flex xs12 sm12>
          <div style="height: 500px; overflow: auto;" class="formAlpacaRegistration px-2" :id="'formPartNo' + thongTinDoanhNghiep['formNo']" 
          data-referenceuid="thongTinDoanhNghiep['referenceUid']" data-formname="thongTinDoanhNghiep['formName']" data-pk="TTCDN">
          </div>
        </v-flex>
        <v-flex xs12 sm2>
          <v-subheader style="float: right;">Chọn xưởng</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <!-- <v-select
          return-object
          :items="listXuongItems"
          item-text="display"
          item-value="referenceUid"
          v-model="thongTinXuong"
          outline
          ></v-select> -->

          <v-list two-line subheader style="max-height: 200px;">

            <v-list-tile avatar v-for="(item, index) in listXuongItems" @click="slectXuong(item, index)" :key="'list-xuong-' + index" :style="{'background-color': indexSelect === index ? '#ded9d9' : '#fff'}">
              <v-list-tile-content>
                <v-list-tile-title>{{item['display']}}</v-list-tile-title>
                <v-list-tile-sub-title>{{item['referenceUid']}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>
        </v-flex>
        <v-flex xs12 sm6>
          <v-btn color="primary" small @click="addThongTinXuong()"><v-icon style="font-size: 18px;">add</v-icon>&nbsp; Thêm mới</v-btn>
          <v-btn color="primary" :disabled="!thongTinXuong['formNo']" small @click="toDetailThongTinXuong('VIEW')"><v-icon style="font-size: 18px;">visibility</v-icon>&nbsp; Xem</v-btn>
          <v-btn color="primary" :disabled="!thongTinXuong['formNo']" small @click="toDetailThongTinXuong('UPDATE')"><v-icon style="font-size: 18px;">save</v-icon>&nbsp; Sửa</v-btn>
        </v-flex>

        <v-flex xs12 sm12 class="text-xs-right">
          <v-btn color="primary" @click="saveRegistration(0)"><v-icon>save</v-icon>&nbsp; Lưu nháp</v-btn>
          <v-btn color="primary" @click="saveRegistration(1)"><v-icon>send</v-icon>&nbsp; Gửi</v-btn>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
// import supportData from '../store/support_data.json'
import $ from 'jquery'
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
    headers: [],
    payment: false,
    formTTDN: {},
    thongTinXuong: {},
    thongTinDoanhNghiep: {},
    listXuongItems: [],
    listRegistrationTemplate: [],
    indexSelect: -1
  }),
  computed: {
    thongTinChung () {
      /* eslint-disable */
      let item = this.$store.getters.thongTinChung || {}
      console.log('return item', item)
      return item
      /* eslint-disable */
    }
  },
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  created () {
  },
  mounted () {
    var vm = this
    // Xử lý ban đầu trong mount là do có hàm load form cần truy cập tới DOM
    vm.$nextTick(function () {
      vm.thongTinChung['registrationState'] = 1
      if (!vm.id || vm.id === '0') {
        // Khởi tạo dữ liệu ban đầu (các dữ liệu lấy từ applicant) cho registration trc khi thêm mới
        // Khi thêm mới cần phải thêm vào 2 bảng Registration và Registration Form
        vm.mapThongTinChungToForm().then(result => {
          // Thêm mới registration
          vm.addRegistration().then(resultRegistration => {
            // Lấy ds thông tin doanh nghiệp
            // Form của thông tin doanh nghiệp có formNo là TTCDN
            vm.loadDsXuong().then(resultDsXuong => {
              // Nếu không tìm thấy tin doanh nghiệp nào thì lấy thông tin doanh nghiệp từ ds Registration Template rồi đổ vào Registration Form
              if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
                // Lấy ds Registrtion Template
                vm.loadRegistrationtemplate().then(resultTemplate => {
                  // Check có dữ liệu thì gọi hàm add Registration Form (Bản chất là lấy thông tin doanh nghiệp từ Registration Template add vào Registration Form )
                  if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
                    vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
                      // Sau khi add form thành công thì load form lên để hiển thị 
                      // Vì form này là thêm mới nên truyền thêm key addNew vào để build sẵn dữ liệu từ applicant vào form
                      vm.loadForm({
                        addNew: true
                      })
                    })
                  }
                })
              // Trường hợp tìm thấy thông tin doanh nghiệp trong Registration Form thì hiển thi ra thông tin
              } else {
                for (var i = 0; i < resultDsXuong.length; i++) {
                  if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
                    vm.thongTinDoanhNghiep = resultDsXuong[i]
                    vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
                    vm.loadForm()
                    break
                  }
                }
              }
            })
          })
        })
      } else {
        vm.loadDsXuong().then(resultDsXuong => {
          if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
            vm.loadRegistrationtemplate().then(resultTemplate => {
              if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
                vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
                  vm.loadForm({
                    addNew: true
                  })
                })
              }
            })
          } else {
            for (var i = 0; i < resultDsXuong.length; i++) {
              if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
                vm.thongTinDoanhNghiep = resultDsXuong[i]
                vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
                vm.loadForm()
                break
              }
            }
          }
        })
      }
    })
  },
  watch: {
    id (val) {
      let vm = this
      if (val && val !== '0') {
        vm.loadDsXuong().then(resultDsXuong => {
          if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
            vm.loadRegistrationtemplate().then(resultTemplate => {
              if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
                vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
                  vm.loadForm({
                    addNew: true
                  })
                })
              }
            })
          } else {
            for (var i = 0; i < resultDsXuong.length; i++) {
              if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
                vm.thongTinDoanhNghiep = resultDsXuong[i]
                vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
                vm.loadForm()
                break
              }
            }
          }
        })
      } else {
        vm.thongTinChung['registrationState'] = 1
        // Khởi tạo dữ liệu ban đầu (các dữ liệu lấy từ applicant) cho registration trc khi thêm mới
        // Khi thêm mới cần phải thêm vào 2 bảng Registration và Registration Form
        vm.mapThongTinChungToForm().then(result => {
          // Thêm mới registration
          vm.addRegistration().then(resultRegistration => {
            // Lấy ds thông tin doanh nghiệp
            // Form của thông tin doanh nghiệp có formNo là TTCDN
            vm.loadDsXuong().then(resultDsXuong => {
              // Nếu không tìm thấy tin doanh nghiệp nào thì lấy thông tin doanh nghiệp từ ds Registration Template rồi đổ vào Registration Form
              if (!resultDsXuong || (Array.isArray(resultDsXuong) && !resultDsXuong.length)) {
                // Lấy ds Registrtion Template
                vm.loadRegistrationtemplate().then(resultTemplate => {
                  // Check có dữ liệu thì gọi hàm add Registration Form (Bản chất là lấy thông tin doanh nghiệp từ Registration Template add vào Registration Form )
                  if (resultTemplate && Array.isArray(resultTemplate) && resultTemplate.length) {
                    vm.addRegistrationForm(resultTemplate[0]).then(resultForm => {
                      // Sau khi add form thành công thì load form lên để hiển thị 
                      // Vì form này là thêm mới nên truyền thêm key addNew vào để build sẵn dữ liệu từ applicant vào form
                      vm.loadForm({
                        addNew: true
                      })
                    })
                  }
                })
              // Trường hợp tìm thấy thông tin doanh nghiệp trong Registration Form thì hiển thi ra thông tin
              } else {
                for (var i = 0; i < resultDsXuong.length; i++) {
                  if (resultDsXuong[i] && resultDsXuong[i]['formNo'] === 'TTCDN') {
                    vm.thongTinDoanhNghiep = resultDsXuong[i]
                    vm.$store.commit('setThongTinDoanhNghiep', resultDsXuong[i])
                    vm.loadForm()
                    break
                  }
                }
              }
            })
          })
        })
      }
    },
    '$route': function (newRoute, oldRoute) {
      // let vm = this
      // let query = newRoute.query
    }
  },
  methods: {
    slectXuong (item, index) {
      this.thongTinXuong = item
      this.indexSelect = index
    },
    addRegistrationForm (thongTinDoanhNghiep) {
      let vm = this
      return new Promise((resolve, reject) => {
        if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
          console.log('not thongTinChung+++++++', vm.thongTinChung)
          return
        } else {
          reject({
            message: 'NOT FOUND FORM NO'
          })
        }
        let data = {
          registrationId: vm.thongTinChung['registrationId'],
          formNo: thongTinDoanhNghiep['formNo']
        }
        vm.$store.dispatch('addForm', data).then(result => {
          vm.$store.commit('setThongTinDoanhNghiep', result)
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadRegistrationtemplate () {
      let vm = this
      return new Promise((resolve, reject) => {
        if (!vm.listRegistrationTemplate.length) {
          vm.$store.dispatch('loadRegistrationTemplate', {}).then(result => {
            let arrRes = []
            if (result.data) {
              for (var i = 0; i < result.data['length']; i++) {
                if (result.data[i].formNo === 'TTCDN') {
                  arrRes.push(result.data[i])
                }
              }
            }
            vm.listRegistrationTemplate = arrRes
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
    fnMapFormTTCDNtoReg () {
      let vm = this
      vm.thongTinChung = Object.assign(vm.thongTinChung, {
        applicantName: $("#ten_doanh_nghiep").val(),
        applicantIdType: '',
        applicantIdNo: $("#ma_so_doanh_nghiep").val(),
        address: $("#dia_chi_chinh_doanh_nghiep").val(),
        contactName: $("#nguoi_dai_dien_doanh_nghiep").val(),
        contactTelNo: $("#so_dien_thoai_doanh_nghiep").val(),
        contactEmail: $("#email_doanh_nghiep").val(),
        cityCode__hidden: $("#tinh").val(),
        districtCode__hidden: $("#huyen").val(),
        wardCode__hidden: $("#xa").val()
      })
    },
    mapThongTinChungToForm () {
      let vm = this
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadInitResource').then(function (result) {
          vm.loading = false
          if (!vm.id || vm.id === '0') {
            vm.thongTinChung = Object.assign(vm.thongTinChung, {
              applicantName: result.applicant['applicantName'],
              applicantIdType: result.applicant['applicantIdType'],
              applicantIdNo: result.applicant['applicantIdNo'],
              applicantIdDate: result.applicant['applicantIdDate'],
              address: result.applicant['address'],
              cityCode: result.applicant['cityCode'],
              districtCode: result.applicant['districtCode'],
              wardCode: result.applicant['wardCode'],
              contactName: result.applicant['contactName'],
              contactTelNo: result.applicant['contactTelNo'],
              contactEmail: result.applicant['contactEmail'],
              govAgencyCode: result.applicant['govAgencyCode'],
              representativeEnterprise: result.applicant['representativeEnterprise']
            })
          }
          resolve(vm.thongTinChung)
        }).catch(xhr => {
          vm.loading = false
          reject(xhr)
        })
      })
    },
    loadForm (param) {
      let vm = this
      if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
        console.log('not thongTinChung+++++++', vm.thongTinChung)
        return
      }
      if (!vm.thongTinDoanhNghiep || (Object.keys(vm.thongTinDoanhNghiep).length === 0 && vm.thongTinDoanhNghiep.constructor === Object)) {
        console.log('not thongTinDoanhNghiep+++++++', vm.thongTinDoanhNghiep)
        return
      }
      let data = {
        registrationId: vm.thongTinChung['registrationId'],
        referenceUid: vm.thongTinDoanhNghiep['referenceUid'],
        formNo: vm.thongTinDoanhNghiep['formNo'],
        ...param
      }
      vm.$store.dispatch('showAlpacaJSFORMRegist', data).then(result => {
        console.log('resultForm==========>>>>>>>>', result)
      }).catch(xhr => {
        console.log('error load form=============>>>>', xhr)
      })
    },
    saveForm () {
      let vm = this
      if (!vm.thongTinChung || (Object.keys(vm.thongTinChung).length === 0 && vm.thongTinChung.constructor === Object)) {
        console.log('not thongTinChung+++++++', vm.thongTinChung)
        return
      }
      if (!vm.thongTinDoanhNghiep || (Object.keys(vm.thongTinDoanhNghiep).length === 0 && vm.thongTinDoanhNghiep.constructor === Object)) {
        console.log('not thongTinDoanhNghiep+++++++', vm.thongTinDoanhNghiep)
        return
      }
      return new Promise((resolve, reject) => {
        var formType = $('#formPartNo' + vm.thongTinDoanhNghiep['referenceUid'] + ' .formType').val()
        var value = ''
        value = window.$('#formPartNo' + vm.thongTinDoanhNghiep['formNo']).alpaca('get').getValue();
        var errorMessage = '';
        $('#formPartNo' + vm.thongTinDoanhNghiep['referenceUid'] + ' div[class*="has-error"] > label').each(function (index) {
          errorMessage = 'notValid'
        })
        if (errorMessage === '' && vm.thongTinDoanhNghiep['referenceUid']) {
          vm.$store.dispatch('saveForm', {
            registrationId: vm.thongTinChung['registrationId'],
            referenceUid: vm.thongTinDoanhNghiep['referenceUid'],
            value: value
          }).then(result => {
            resolve(result)
            toastr.success('Lưu thông tin thành công!')
          }).catch(xhr => {
            reject(xhr)
            toastr.error('Lưu thất bại, vui lòng thử lại!')
            console.log('save form error =====================>>>>', xhr)
          })
        }
      })
    },
    addRegistration () {
      let vm = this
      return new Promise((resolve, reject) => {
        vm.thongTinChung['registrationState'] = 0
        vm.thongTinChung['type'] = 'POST'
        vm.$store.dispatch('saveRegistration', vm.thongTinChung).then(result => {
          vm.$store.commit('setThongTinChung', result)
          vm.changeUrl(result['registrationId'])
          toastr.success('Lưu thông tin thành công!')
          resolve(result)
        }).catch(xhr => {
          toastr.error('Lưu thất bại, vui lòng thử lại!')
          console.log('save form error =====================>>>>', xhr)
          reject(xhr)
        })
      })
    },
    saveRegistration (state) {
      let vm = this
      vm.fnMapFormTTCDNtoReg()
      vm.saveForm().then(result => {
        vm.thongTinChung['registrationState'] = state
        if (vm.id && vm.id !== '0') {
          vm.thongTinChung['type'] = 'PUT'
        } else {
          vm.thongTinChung['type'] = 'POST'
        }
        vm.$store.dispatch('saveRegistration', vm.thongTinChung).then(result => {
          toastr.success('Lưu thông tin thành công!')
        }).catch(xhr => {
          toastr.error('Lưu thất bại, vui lòng thử lại!')
          console.log('save form error =====================>>>>', xhr)
        })
      })
    },
    addThongTinXuong () {
      this.$router.push('/thong-tin-xuong/0')
    },
    toDetailThongTinXuong (state) {
      let vm = this
      vm.$store.commit('setThongTinXuong', vm.thongTinXuong)
      vm.$router.push({
        path: '/thong-tin-xuong/' + vm.thongTinXuong['formNo'],
        query: {
          state: state
        }
      })
    },
    loadDsXuong () {
      let vm = this
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('loadListForms', {
          registrationId: vm.id
        }).then(result => {
          vm.listXuongItems = result.filter(item => {
            let code = item['referenceUid'] ? item['referenceUid'].substring(item['referenceUid'].length - 12, item['referenceUid'].length) : ''
            item['display'] = code + ' - ' + item['formName']
            return item['formNo'] !== 'TTCDN'
          })
          resolve(result)
        }).catch(xhr => {
          vm.listXuongItems = []
          reject(xhr)
        })
      })
    },
    changeUrl (id) {
      this.$router.push('/thong-tin-chung/' + id)
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
