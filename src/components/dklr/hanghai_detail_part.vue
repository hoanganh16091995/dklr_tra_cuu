<template>
  <div style="width: 100%; position: relative;">
    <div class="row-header" style="height: 38px;overflow: hidden;" v-if="switchPart">
      <div class="background-triangle-big" @click="backtolistpdf()"> 
        THÀNH PHẦN HỒ SƠ 
        <v-switch v-if="checkActiveVma && itineraryNo['itineraryNo']" v-model="switchPart" hide-details
        @change="changeTypePart"
        style="position: absolute;
        left: 186px;
        top: 8px;
        width: 150px;
        z-index: 10;"
        ></v-switch>
      </div>
      <div class="layout row wrap header_tools row-blue">
        <v-tooltip top v-if="checkActiveVma && !itineraryNo['itineraryNo']">
          <span slot="activator">
            <v-switch v-model="switchPart" hide-details
            disabled
            ></v-switch>
          </span>
          <span>Không có hồ sơ chuyến tàu</span>
        </v-tooltip>
      </div>
    </div>
    
    <div v-if="loadingList && switchPart">
      <content-placeholders>
        <content-placeholders-text :lines="14" />
      </content-placeholders>
    </div>
    <ul class="list thanh_phan_hoso pr-2" v-if="switchPart">
      <li class="list--group__container" v-for="(item, index) in thanhPhanLists" v-bind:key="item.code">
        <ul class="list--group__header" :index="index" :class='{"list--group__header--active": (thanhPhanSelected===item.code)}' @click.stop.prevent="selectThanhPhan(item, index, $event)">
          <li>
            <a class="list__tile list__tile--link">
              <div class="list__tile__action pl-3">
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/lenh_dieu_dong_on.png" alt="ldd" v-if="item.code === 'lenh_dieu_dong' && item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/lenh_dieu_dong_off.png" alt="ldd" v-else-if="item.code === 'lenh_dieu_dong' && !item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/giay_to_on.png" alt="gt" v-else-if=" (item.code === 'NC_23' || item.code === 'NC_24' || item.code === 'NC_25' || item.code === 'NC_2014' || item.code === 'NC_2018') && item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/giay_to_off.png" alt="gt" v-else-if=" (item.code === 'NC_23' || item.code === 'NC_24' || item.code === 'NC_25' || item.code === 'NC_2014' || item.code === 'NC_2018') && !item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/folder_on.png" alt="bk" v-else-if="item.available"/>
                <img style="margin-left: -5px;" src="/hang-hai-npm-theme/images/folder_off.png" alt="bk" v-else-if="!item.available"/>
              </div>
              <div class="list__tile__content">
                <div class="list__tile__title">
                  {{item.name}}
                </div>
              </div>
              <div class="list__tile__action" v-if="item.state == 1 && item.available">
                <v-icon color="primary">done</v-icon>
              </div>
              <div class="list__tile__action" v-else-if="item.state == 0">
                <v-icon class="orange--text">warning</v-icon>
              </div>
            </a>
          </li>
        </ul>
      </li>
    </ul>

    <div class="row-header" style="height: 38px;overflow: hidden;" v-if="!switchPart">
      <div class="background-triangle-big" @click="toQuanLyChuyenTau()"> 
        QUẢN LÝ CHUYẾN TÀU 
        <v-switch v-model="switchPart" hide-details
        @change="changeTypePart"
        style="position: absolute;
        left: 186px;
        top: 8px;
        width: 150px;
        z-index: 10;"
        ></v-switch>
      </div>
      <div class="layout row wrap header_tools row-blue">
      </div>
    </div>
    
    <div class="flex xs12" v-if="!switchPart">
      <v-list> 
        <!-- :disabled="subItem['available'] === false || (subItem.type === 'DanhSachTauDenCang' || subItem.type === 'DanhSachTauRoiCang' && !itineraryNo['itineraryNo'])" -->
        <v-list-tile v-for="(subItem, subIndex) in itemsTauBien['items']"
            v-bind:key="subIndex"
            :style="{'background': (thanhPhanSelected===subItem.type) ? '#dcdada' : ''}"
            :class='{"list--group__header--active": (thanhPhanSelected===subItem.type)}'
            @click="selectThanhPhanTauBien(subItem, subIndex)"
        >

            <v-list-tile-action style="padding-left: 4px;"> 
              <img v-if="subItem.type === 'DanhSachTauDenCang' && itineraryNo['markedAsArrival'] >= 1" src="/hang-hai-npm-theme/images/folder_on.png" alt="gt"/>
              <img v-else-if="subItem.type === 'DanhSachTauDenCang'" src="/hang-hai-npm-theme/images/folder_off.png" alt="gt"/>

              <img v-if="subItem.type === 'DanhSachTauRoiCang' && itineraryNo['markedAsDeparture'] >= 1" src="/hang-hai-npm-theme/images/folder_on.png" alt="gt"/>
              <img v-else-if="subItem.type === 'DanhSachTauRoiCang'" src="/hang-hai-npm-theme/images/folder_off.png" alt="gt"/>

              <img v-if="subItem.type !== 'DanhSachTauDenCang' && subItem.type !== 'DanhSachTauRoiCang'" src="/hang-hai-npm-theme/images/folder_on.png" alt="gt"/>
            </v-list-tile-action>

            <v-list-tile-content> 
              <v-list-tile-title> {{ subItem.title }} </v-list-tile-title>  
              <span v-if="subItem.counter > -1 && subItem.type !== 'DanhSachTauDenCang' && subItem.type !== 'DanhSachTauRoiCang'" class="status__counter">
                {{subItem.counter}}
              </span>
              <span v-else-if="subItem.type !== 'DanhSachTauDenCang' && subItem.type !== 'DanhSachTauRoiCang'" class="status__counter">
                <v-progress-circular :width="1" :size="16" indeterminate color="red"></v-progress-circular>
              </span>
            </v-list-tile-content>

            <v-list-tile-action v-if="subItem.type === 'DanhSachTauDenCang'">
              <v-icon color="primary" class="mr-3" v-if="itineraryNo['markedAsArrival'] === 8 || itineraryNo['markedAsArrival'] === 9">done</v-icon>
              <v-icon size="15" class="mr-3" color="blue-grey lighten-4" v-else-if="!itineraryNo['markedAsArrival'] || itineraryNo['markedAsArrival'] === 0 || itineraryNo['markedAsArrival'] === 1">lens</v-icon>
              <v-icon class="orange--text mr-3" v-else-if="itineraryNo['markedAsArrival'] === 6">warning</v-icon>
              <v-icon size="15" class="mr-3" color="blue" v-else>lens</v-icon>
            </v-list-tile-action>

            <v-list-tile-action v-if="subItem.type === 'DanhSachTauRoiCang'">
              <v-icon color="primary" class="mr-3" v-if="itineraryNo['markedAsDeparture'] === 8 || itineraryNo['markedAsDeparture'] === 9">done</v-icon>
              <v-icon size="15" class="mr-3" color="blue-grey lighten-4" v-else-if="!itineraryNo['markedAsDeparture'] || itineraryNo['markedAsDeparture'] === 0 || itineraryNo['markedAsDeparture'] === 1">lens</v-icon>
              <v-icon class="orange--text mr-3" v-else-if="itineraryNo['markedAsDeparture'] === 6">warning</v-icon>
              <v-icon size="15" class="mr-3" color="blue" v-else>lens</v-icon>
            </v-list-tile-action>
        </v-list-tile>

      </v-list>
    </div>
    
    <v-dialog v-model="dialogTauXC" persistent max-width="800">
      <v-card>
        <v-card-title class="headline">
          Danh sách tàu rời
          <v-btn dark icon class="mx-0 my-0 btn-top-panel" v-on:click.native="dialogTauXC = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-title>
        <div style="max-height: 370px; overflow: auto;">
          <v-progress-linear v-if="loadingDialog" :indeterminate="true"></v-progress-linear>
          <v-data-table
            :style="{'opacity': loadingDialog ? '0.6' : 1, 'pointer-events': loadingDialog ? 'none' : 'auto'}"
            :headers="headersDialog"
            :items="itemsDialog"
            hide-actions
            class="table-bordered danhSachHoSoTable__class"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-center">{{ props.index + 1 }}</td>
              <td @click="selectTauRoi(props.item)" style="cursor: pointer;" class="text-xs-center">{{ props.item['documentName'] ? props.item['documentName'] : props.item['documentNameOUT'] }}</td>
              <td @click="selectTauRoi(props.item)" style="cursor: pointer;" class="text-xs-center">{{ props.item['shipName'] ? props.item['shipName'] : props.item['nameOfShip'] }}</td>
              <td @click="selectTauRoi(props.item)" style="cursor: pointer;" class="text-xs-center">{{ props.item['callSign'] }}</td>
              <td @click="selectTauRoi(props.item)" style="cursor: pointer;" class="text-xs-center">{{ props.item['imo'] ? props.item['imo'] : props.item['imoNumber'] }}</td>
              <td @click="selectTauRoi(props.item)" style="cursor: pointer;" class="text-xs-center">{{ props.item['shipDateTo'] ? props.item['shipDateTo'] : props.item['shipDateTo'] }} LT</td>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import axios from 'axios'
const COMPONENT_NAME = 'jx-hanghai-detail-part'
import { eventBus } from '../../event-bus/eventBus.js'
import support from '../../store/support.json'

export default {
  name: COMPONENT_NAME,
  props: {
    name: String,
    group_id: 0,
    thanh_phan_ho_so_api: '',
    detail_ho_so: {},
    type: '',
    document_type_code: '',
    document_status_code: '',
    document_name: '',
    document_year: 0
  },
  computed: {
    maritimeCode () {
      return this.$store.getters.maritimeCode
    },
    loadingInitData () {
      return this.$store.getters.loadingInitData
    },
    itineraryNo () {
      var itineraryNo = this.$store.getters.itineraryNo
      if (itineraryNo) {
        return itineraryNo
      } else {
        return {}
      }
    }
  },
  created () {
    var vm = this
    vm.loadItineraryNo().then(result => {
      vm.loadDetailFromItineraryNo_NoticeShipType(result, 2)
    })
    eventBus.$on('selectTPTauBien', vm.changeThanhPhanSelected)
    eventBus.$on('eventSwitchPart', vm.eventSwitchPart)
    vm.getCheckActiveVma()
    if (vm.type === 'ke_hoach') {
      vm.itemsTauBien = support.role_filter_status_ke_hoach
    } else {
      vm.itemsTauBien = support.role_filter_status_thu_tuc
    }
    // vm.loadDsTauRoi()
  },
  destroyed () {
    var vm = this
    eventBus.$off('selectTPTauBien', vm.changeThanhPhanSelected)
    eventBus.$off('eventSwitchPart', vm.eventSwitchPart)
  },
  data () {
    return {
      switchPart: true,
      thanhPhanLists: [],
      thanhPhanSelected: '',
      loadingList: true,
      messageTypeTemp: 0,
      itemsTauBien: {
        'id': -3,
        'index': 3,
        'title': 'Quản lý chuyến tàu',
        'id_active': 'quan_ly_tau',
        'action_active': 'folder_open',
        'items': []
      },
      checkActiveVma: false,
      dialogTauXC: false,
      headersDialog: [
        {
          'text': 'STT',
          'align': 'left',
          'sortable': false
        },
        {
          'text': 'Số hồ sơ',
          'align': 'center',
          'sortable': false,
          'value': 'title'
        },
        {
          'text': 'Tên tàu',
          'align': 'center',
          'sortable': false,
          'value': 'tentau'
        },
        {
          'text': 'Hô hiệu',
          'align': 'center',
          'sortable': false,
          'value': 'tentau'
        },
        {
          'text': 'IMO',
          'align': 'center',
          'sortable': false,
          'value': 'tentau'
        },
        {
          'text': 'Thời gian dự kiến rời',
          'align': 'center',
          'sortable': false,
          'value': 'tentau'
        }
      ],
      itemsDialog: [],
      loadingDialog: false,
      detailTauRoiCang: null
    }
  },
  watch: {
    switchPart (val) {
      if (!val) {
        let vm = this
        if (vm.document_name && vm.document_name !== '0' && !vm.itineraryNo['itineraryNo']) {
          vm.loadItineraryNo().then(result => {
            vm.doTauBienFilterCount()
          })
        } else {
          vm.doTauBienFilterCount()
        }
        let currentUrl = this.$router.history.current
        if (currentUrl && currentUrl.params) {
          if (currentUrl.params['code'] === 'DanhSachTau' || !currentUrl.params['code']) {
            this.$router.push({
              path: '/ho-so-phuong-tien/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/DanhSachTau'
            })
          }
        }
      } else {
        this.$router.push({
          path: '/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code
        })
      }
    }
  },
  methods: {
    loadDetailFromItineraryNo_NoticeShipType: function (itineraryNo, noticeShipType) {
      var vm = this
      return new Promise((resolve, reject) => {
        let param = {
          itineraryNo: itineraryNo['itineraryNo'],
          noticeShipType: noticeShipType
        }
        vm.$store.dispatch('loadDetailFromItineraryNo_NoticeShipType', param).then(function (result) {
          if (!result.hasOwnProperty('errorCode')) {
            vm.detailTauRoiCang = result
          } else {
            vm.detailTauRoiCang = null
          }
          resolve(result)
        }).catch(function (xhr) {
          console.log(xhr)
          reject(xhr)
        })
      })
    },
    selectTauRoi: function (item) {
      var vm = this
      item['itineraryNo'] = vm.itineraryNo['itineraryNo']
      // eventBus.$emit('selectTauRoi', item)
      vm.$store.dispatch('setSelectTauRoi', item)
      setTimeout(function () {
        vm.dialogTauXC = false
        vm.$router.push({
          path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.document_name + '/' + vm.document_year + '/' + vm.document_type_code + '/' + vm.document_status_code + '/DanhSachTauRoiCang'
        })
      }, 300)
    },
    eventSwitchPart: function (data) {
      var vm = this
      console.log('switch data')
      vm.switchPart = data
      if (!vm.switchPart) {
        // vm.doTauBienFilterCount()
        // vm.$router.push({
        //   path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.document_name + '/' + vm.document_year + '/' + vm.document_type_code + '/' + vm.document_status_code + '/DanhSachViTriNeoDauTaiCang'
        // })
      } else {
        vm.$nextTick(function () {
          vm.$store.dispatch('loadInitResource').then(function (result) {
            vm.initData = result
            if (vm.initData !== null) {
              var url = vm.initData.getThanhPhanHoSo
              vm.reloadThanhPhanParam(url)
            }
          })
        })
      }
    },
    changeThanhPhanSelected: function (data) {
      var vm = this
      console.log('changeThanhPhanSelected++++++++++++++++', data)
      vm.thanhPhanSelected = data
    },
    loadItineraryNo: function () {
      var vm = this
      return new Promise((resolve, reject) => {
        let param = {
          documentName: vm.document_name,
          documentYear: vm.document_year,
          type: vm.type
        }
        vm.$store.dispatch('loadItineraryNo', param).then(result => {
          resolve(result)
        }).catch(xhr => {
          reject(xhr)
        })
      })
    },
    loadDsTauRoi: function (query) {
      var vm = this
      vm.loadingDialog = true
      // let query = {}
      vm.$store.dispatch('loadDsTauRoi', query).then(result => {
        if (result && result['data']) {
          vm.itemsDialog = result['data']
        } else {
          vm.itemsDialog = []
        }
        vm.loadingDialog = false
      }).catch(xhr => {
        vm.itemsDialog = []
        vm.loadingDialog = false
      })
    },
    loadDsTempDocument: function (query) {
      var vm = this
      vm.loadingDialog = true
      vm.$store.dispatch('loadDsTempDocument', query).then(result => {
        if (result && result['data']) {
          vm.itemsDialog = result['data']
        } else {
          vm.itemsDialog = []
        }
        vm.loadingDialog = false
      }).catch(xhr => {
        vm.itemsDialog = []
        vm.loadingDialog = false
      })
    },
    loadRoleFilterStatus: function () {
      var vm = this
      let filter = {
        documentType: vm.document_type_code
      }
      vm.$store.getters.roleFilterStatus(filter).then(function (result) {
        // if (result && Array.isArray(result)) {
        //   for (var i = 0; i < result.length; i++) {
        //     if (result[i].id_active === 'quan_ly_tau') {
        //       vm.itemsTauBien = result[i]
        //       // vm.doTauBienFilterCount()
        //     }
        //   }
        // }
      })
    },
    backtolistpdf: function () {
      this.thanhPhanSelected = 0
      this.$router.push({ path: '/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code,
        query: {
          'renew': Math.floor(Math.random() * (10 - 1 + 1)) + 1
        }
      })
    },
    reloadThanhPhanParam: function (url) {
      let vm = this
      let currentParams = vm.$router.history.current.params
      if (currentParams.hasOwnProperty('messageType')) {
        vm.messageTypeTemp = currentParams.messageType
      }
      vm.thanh_phan_ho_so_api = url
      vm.reloadThanhPhan()
      vm.loadRoleFilterStatus()
    },
    reloadThanhPhan: function () {
      var vm = this
      vm.thanhPhanLists = []
      if (vm.thanh_phan_ho_so_api !== '') {
        let config = {
          params: {
            'documentType': vm.document_type_code,
            'documentName': vm.document_name,
            'documentYear': vm.document_year,
            'roleUserFilterselectedType': -1
          }
        }
        if (vm.type !== 'ke_hoach') {
          config.params.roleUserFilterselectedType = 0
        }
        vm.loadingList = true
        axios
          .get(vm.thanh_phan_ho_so_api, config)
          .then(function (response) {
            var serializable = response.data
            vm.thanhPhanLists = serializable
            eventBus.$emit('thanhphanlist', vm.thanhPhanLists)
            vm.loadingList = false
            vm.checkAvailableKhDenCang()
          })
          .catch(function (error) {
            console.log(error)
            vm.loadingList = false
          })
      }
    },
    doTauBienFilterCount () {
      let vm = this
      let query = vm.$router.history.current.query
      vm.loadingInitData.then(function (result) {
        var listDS = vm.itemsTauBien.items
        for (var i = 0; i < listDS.length; i++) {
          let item = listDS[i]
          let param = null
          param = {
            url: result[item.url]
          }
          if (item.type === 'DanhSachTauBien') {
            param['shipBoat'] = 'SHIP'
          }
          if (item.type === 'DanhSachPhuongTienThuyNoiDia') {
            param['shipBoat'] = 'BOAT'
          }
          if (item.type === 'DanhSachTauDenCang') {
            param['shipBoat'] = 'SHIP'
            param['shipPosition'] = 1
          }
          if (item.type === 'DanhSachTauRoiCang') {
            param['shipBoat'] = 'SHIP'
            param['shipPosition'] = 2
          }
          if (vm.code === 'DanhSachTauLaiHoTro' && !query['noticeShipType']) {
            param['noticeShipType'] = 1
          } else if (query['noticeShipType']) {
            param['noticeShipType'] = query['noticeShipType']
          }
          if (item.type === 'DanhSachPTTNDDenCang' || item.type === 'DanhSachPTTNDRoiCang') {
            param['mtgateway'] = 0
          }
          if (vm.document_name && vm.document_name !== '0') {
            param['itineraryNo'] = vm.itineraryNo['itineraryNo']
          }
          param['maritimeCode'] = vm.maritimeCode
          vm.changeCounter(i, param)
        }
      })
    },
    changeCounter (index, param) {
      var vm = this
      vm.$store.dispatch('countDanhSachTauBien', param).then(function (result) {
        if (!result) {
          result = 0
        }
        vm.itemsTauBien.items[index]['counter'] = result
      })
    },
    checkAvailableKhDenCang () {
      var vm = this
      let available = true
      if (vm.thanhPhanLists.length) {
        for (var i = 0; i < vm.thanhPhanLists.length; i++) {
          if (vm.thanhPhanLists[i].code === 'NC_3') {
            vm.itemsTauBien['items'].forEach(function (item) {
              if (item.type === 'DanhSachTauDenCang') {
                item['available'] = vm.thanhPhanLists[i].available
              }
            })
            available = vm.thanhPhanLists[i].available
          }
        }
      }
      console.log('available+++++++++++', available)
      return available
    },
    changeTypePart: function () {
      var vm = this
      if (!vm.switchPart) {
        // vm.dialogTauXC = true
        // vm.loadDsTauRoi()
        // vm.doTauBienFilterCount()
      }
    },
    selectThanhPhanTauBien: function (item, index) {
      var vm = this
      eventBus.$emit('changeStatusTable', item.title)
      vm.thanhPhanSelected = item.type
      if (item.type === 'DanhSachTauRoiCang') {
        // neu da co kế hoạch tàu rời thì vào luôn màn hình kế hoạch rời
        if (vm.detailTauRoiCang && Object.keys(vm.detailTauRoiCang).length !== 0 && vm.detailTauRoiCang.constructor === Object) {
          vm.$router.push({
            path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.document_name + '/' + vm.document_year + '/' + vm.document_type_code + '/' + vm.document_status_code + '/DanhSachTauRoiCang/0'
          })
        } else {
          vm.loadItineraryNo().then(result => {
            if (!result || (Object.keys(result).length === 0 && result.constructor === Object)) {
              console.log('NOT ITINERARY_NO !!!!!!!!!!!!!!!!!')
              return
            }
            if (vm.itineraryNo['documentNameOUT'] === 0 || vm.itineraryNo['documentYearOUT'] === 0) {
              let listDocumentTypeCodeVao = ['NC', '4', '6', '8', '10', '12', '14', '16']
              let listDocumentTypeCodeRoi = ['XC', 'QC', '5', '7', '9', '11', '13', '15', '17']
              if (listDocumentTypeCodeVao.includes(vm.document_type_code)) {
                vm.dialogTauXC = true
                if (Object.keys(vm.itineraryNo).length !== 0 && vm.itineraryNo.constructor === Object) {
                  vm.loadDsTempDocument({
                    callSign: vm.itineraryNo['callSign'],
                    imoNumber: vm.itineraryNo['imoNumber'],
                    maritimeCode: vm.itineraryNo['maritimeCode']
                  })
                } else {
                  vm.loadItineraryNo().then(result => {
                    vm.loadDsTempDocument({
                      callSign: vm.itineraryNo['callSign'],
                      imoNumber: vm.itineraryNo['imoNumber'],
                      maritimeCode: vm.itineraryNo['maritimeCode']
                    })
                  }).catch(xhr => {
                    console.log(xhr)
                  })
                }
              } else if (listDocumentTypeCodeRoi.includes(vm.document_type_code)) {
                vm.dialogTauXC = true
                if (Object.keys(vm.itineraryNo).length !== 0 && vm.itineraryNo.constructor === Object) {
                  vm.loadDsTauRoi({
                    callSign: vm.itineraryNo['callSign'],
                    imoNumber: vm.itineraryNo['imoNumber'],
                    maritimeCode: vm.itineraryNo['maritimeCode']
                  })
                } else {
                  vm.loadItineraryNo().then(result => {
                    vm.loadDsTauRoi({
                      callSign: vm.itineraryNo['callSign'],
                      imoNumber: vm.itineraryNo['imoNumber'],
                      maritimeCode: vm.itineraryNo['maritimeCode']
                    })
                  }).catch(xhr => {
                    console.log(xhr)
                  })
                }
              }
            } else {
              vm.$router.push({
                path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.document_name + '/' + vm.document_year + '/' + vm.document_type_code + '/' + vm.document_status_code + '/DanhSachTauRoiCang/0'
              })
            }
          })
        }
      } else if (item.type === 'DanhSachTauDenCang') {
        if (!vm.itineraryNo || !vm.itineraryNo['itineraryNo']) {
          vm.loadItineraryNo().then(result => {
            if (!result || (Object.keys(result).length === 0 && result.constructor === Object)) {
              console.log('NOT ITINERARY_NO !!!!!!!!!!!!!!!!!')
              return
            }
          }).catch(xhr => {
            console.log(xhr)
          })
        } else {
          vm.$router.push({
            path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.document_name + '/' + vm.document_year + '/' + vm.document_type_code + '/' + vm.document_status_code + '/' + item.type + '/0'
          })
        }
      } else if (item.type === 'DanhSachGiayToTau') {
        vm.$router.push({
          path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.document_name + '/' + vm.document_year + '/' + vm.document_type_code + '/' + vm.document_status_code + '/2014/0/-1/' + item.type
        })
      } else {
        vm.$router.push({
          path: '/ho-so-phuong-tien/' + vm.type + '/' + vm.document_name + '/' + vm.document_year + '/' + vm.document_type_code + '/' + vm.document_status_code + '/' + item.type
        })
      }
      // counter item
      if (item.type !== 'DanhSachTauRoiCang' && item.type !== 'DanhSachTauDenCang') {
        vm.loadingInitData.then(function (result) {
          let param = null
          let query = vm.$router.history.current.query
          param = {
            url: result[item.url]
          }
          if (item.type === 'DanhSachTauBien') {
            param['shipBoat'] = 'SHIP'
          }
          if (item.type === 'DanhSachPhuongTienThuyNoiDia') {
            param['shipBoat'] = 'BOAT'
          }
          if (item.type === 'DanhSachTauDenCang') {
            param['shipBoat'] = 'SHIP'
            param['shipPosition'] = 1
          }
          if (item.type === 'DanhSachTauRoiCang') {
            param['shipBoat'] = 'SHIP'
            param['shipPosition'] = 2
          }
          if (vm.code === 'DanhSachTauLaiHoTro' && !query['noticeShipType']) {
            param['noticeShipType'] = 1
          } else if (query['noticeShipType']) {
            param['noticeShipType'] = query['noticeShipType']
          }
          if (item.type === 'DanhSachPTTNDDenCang' || item.type === 'DanhSachPTTNDRoiCang') {
            param['mtgateway'] = 0
          }
          if (vm.document_name && vm.document_name !== '0') {
            param['itineraryNo'] = vm.itineraryNo['itineraryNo']
          }
          param['maritimeCode'] = vm.maritimeCode
          vm.changeCounter(index, param)
        })
        // vm.doTauBienFilterCount()
      }
    },
    getCheckActiveVma: function () {
      var vm = this
      vm.$store.dispatch('getCheckActiveVma', {}).then(function (result) {
        vm.checkActiveVma = result
      })
    },
    toQuanLyChuyenTau: function () {
      this.$router.push({
        path: '/ho-so-phuong-tien/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/DanhSachTau'
      })
    },
    selectThanhPhan: function (item, index, event) {
      var vm = this
      vm.thanhPhanSelected = item.code
      setTimeout(() => {
        if (item.available || (item.code === 'NC_23' || item.code === 'NC_24' || item.code === 'NC_25' || item.code === 'NC_2014')) {
          let requestCodeView = 0
          if (item.requestCode.length > 0) {
            requestCodeView = item.requestCode
          }
          let orginURL = window.location.href
          let coma = window.location.href.lastIndexOf('#/')
          if (coma > 0) {
            orginURL = window.location.href.substr(0, coma)
          }
          if (item.messageType === 23 || item.messageType === '23') {
            if ((event.metaKey || event.ctrlKey) && event.type === 'click') {
              window.open(orginURL + '#/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state + '?title=' + item.name)
            } else {
              location.replace(orginURL + '#/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state + '?title=' + item.name)
            }
          } else {
            if ((event.metaKey || event.ctrlKey) && event.type === 'click') {
              window.open(orginURL + '#/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state + '?title=' + item.name)
            } else {
              vm.$router.push({ path: '/ho-so/' + this.type + '/' + this.document_name + '/' + this.document_year + '/' + this.document_type_code + '/' + this.document_status_code + '/' + item.messageType + '/' + requestCodeView + '/' + item.state,
                query: {
                  title: item.name
                }
              })
            }
          }
        } else {
          alert('Không có ' + item.name + ' !')
        }
      }, 200)
    }
  }
}
</script>
