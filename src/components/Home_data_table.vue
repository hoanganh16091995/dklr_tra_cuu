<template>

  <div style="width:100%">  
        <div id="title-danhsach" class="row-header" style="height: 38px; overflow: hidden;display: flex; justify-content: space-between;">
          <div class="background-triangle-big view_tp_pdf" ><span>Tra cứu thông tin {{ module['pathParent']}}</span></div>
          <div class="collapsible1 mr-3" style="cursor: pointer;">
            <span @click="isToggle=!isToggle" style="font-weight: bold; color: blue;">Tìm kiếm <i class="mdi mdi-chevron-down" v-if="!isToggle"></i><i class="mdi mdi-chevron-up" v-if="isToggle"></i></span>
          </div>
        </div>      
        <div class="collapsible-content" v-if="isToggle">
            <v-layout row wrap class="ml-0">
              <v-flex xs12 sm12 md 12>
                
              </v-flex>
              <v-flex md3>
                    <div class="ml-2">
                      <v-chip
                        style="height: 22px;"
                        color="primary"
                        label
                        @click="addSearch"
                        >
                        <v-icon size="17" style="color: #fff;">add</v-icon>
                      </v-chip>
                    
                        <span style="font-size:15px;">Điều kiện tìm kiếm: </span>
                    </div>
                </v-flex>
                <v-flex md9>
                    <div class="filter-item" v-for="(item, index) in listSearch" :key="index">
                        <v-autocomplete
                            style="display: inline-block;margin: 0 10px; width: 30%;"
                            outlined
                            @input="changeCondition(item)"
                            :items="conditions"
                            item-text="value"
                            v-model="item['conditionsSelect']"
                            height="15"
                            return-object
                        ></v-autocomplete>
                        <v-text-field
                            style="display: inline-block;margin: 0 10px; width: 30%;"
                            v-if="item['conditionsSelect']['type'] === 'string'"
                            outlined
                            placeholder="Nhập từ khóa"
                            v-model="item['valueSearch']"
                            height="15"
                            clearable
                        >
                        </v-text-field>
                        <v-text-field
                            style="display: inline-block;margin: 0 10px; width: 30%;"
                            v-if="item['conditionsSelect']['type'] === 'number'"
                            outlined
                            type="number"
                            placeholder="Nhập số"
                            v-model="item['valueSearch']"
                            height="15"
                        >
                        </v-text-field>
                        <DateTimePicker
                            style="display: inline-block;margin: 0 10px; width: 25%;"
                            v-if="item['conditionsSelect']['type'] === 'date'"
                            v-model="item['fromDate']"
                            :first-day="1"
                            :show-dst="false"
                            :show-hours="true"
                            :show-minutes="true"
                            :show-seconds="false"
                        ></DateTimePicker>

                        <DateTimePicker
                            style="display: inline-block;margin: 0 10px; width: 25%;"
                            v-if="item['conditionsSelect']['type'] === 'date'"
                            v-model="item['toDate']"
                            :first-day="1"
                            :show-dst="false"
                            :show-hours="true"
                            :show-minutes="true"
                            :show-seconds="false"
                        ></DateTimePicker>
                        <v-autocomplete
                            style="display: inline-block;margin: 0 10px; width: 30%;"
                            v-if="item['conditionsSelect']['type'] === 'select'"
                            v-model="item['valueSearch']"
                            :items="getSelect(item['conditionsSelect'], item['key'])"
                            outlined
                            item-text="itemText"
                            item-value="itemValue"
                            height="15"
                            clearable
                        >
                        </v-autocomplete>

                        <v-autocomplete
                            v-if="item['conditionsSelect']['type'] === 'string' || item['conditionsSelect']['type'] === 'number'"
                            v-model="item['typeSearch']"
                            :items="item['typeSearchItems']"
                            item-text="name"
                            item-value="altername"
                            style="display: inline-block;margin: 0 10px; width: 20%;"
                            outlined
                            height="15"
                        ></v-autocomplete>
                        
                        <v-chip
                          style="height: 22px;"
                          label
                          @click="removeSearch(item, index)"
                          >
                          <v-icon size="18" color="red">delete_outline</v-icon>
                        </v-chip>
                        <!-- <v-btn text icon color="red" v-if="listSearch.length > 1" @click="removeSearch(item, index)">
                            <v-icon size="18">delete</v-icon>
                        </v-btn> -->
                        
                    </div>
                </v-flex>
                <v-btn small color="primary"  @click="searchActionBtn()" style="margin: 0 10px;">Tìm kiếm</v-btn>  
            </v-layout>
          
        </div>
        <v-layout row wrap class="ml-0">
          <v-flex xs12 sm12>
            <div style=" overflow-x: auto;" >
              <div>
                <v-data-table
                :headers="headers"
                :items="lists"
                hide-actions
                no-data-text = "Không có dữ liệu"
                :hide-default-header="false"
                hide-default-footer
                >
                <template slot="items" slot-scope="props">
                  <tr>
                    <td v-for="(itemHeader, index) in headers" class="text-xs-center">
                      <span v-if="itemHeader['display'] === 'stt'">{{page * 15 - 15 + props.index + 1}}</span>
                      <span v-else-if="itemHeader['display'] === 'action'">
                        <span style="color: blue; cursor: pointer;" @click="xemGiayChungNhan(props.item)">Xem giấy chứng nhận</span>
                        <span style="color: blue; cursor: pointer;" @click="xemBienBan(props.item)">Xem biên bản</span>
                      </span>
                      <span v-else>{{getDisplay(props.item, itemHeader['display'])}}</span>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </div>
        </v-flex>
        <v-flex xs12 sm12>
          <tiny-pagination :page="page" :pagesize="pageSize" @tiny:change-page="paggingData" :total="totalTraCuu"/>
        </v-flex>
      </v-layout>
    </div>
</template>

<script>
import supportData from '../store/support_data.json'
import FilterAdv from './dklr/hanghai_filter_adv.vue'
import TinyPagination from './dklr/hanghai_pagination.vue'
import DateTimePicker from './dklr/DateTimePicker.vue'
// import $ from 'jquery'
import toastr from 'toastr'
toastr.options = {
  'closeButton': true,
  'timeOut': '3000'
}
export default {
  props: ['codeTable'],
  components: {
    'tiny-pagination': TinyPagination,
    'jx-hanghai-filter-adv': FilterAdv,
    'DateTimePicker': DateTimePicker
  },
  computed: {
  },
  data: () => ({
    sourceTable: '',
    module: {},
    listSearch: [
      {
        index: 0,
        value: '',
        searchType: '',
        dataitem: '',
        dataCollection: [],
        conditionsSelect: {}
      }
    ],
    totalTraCuu: 0,
    pageSize: 15,
    page: 1,
    isToggle: false,
    conditions: [],
    dataItem: supportData['dataItem'],
    dataItemString: supportData['dataItemString'],
    supportData: supportData,
    headers: [],
    lists: [],
    rules: {
      required: (value) => !!value || 'Trường yêu cầu bắt buộc.',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Email không hợp lệ.'
      }
    }
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
      if (query && query['page']) {
        vm.page = parseInt(query['page']) || 1
      } else {
        vm.page = 1
      }
      this.getHeader(this.codeTable)
      this.search()
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      // let vm = this
      // let query = newRoute.query
      let query = newRoute.query
      if (query && query['page']) {
        this.page = parseInt(query['page']) || 1
      } else {
        this.page = 1
      }
      this.getHeader(this.codeTable)
      this.search()
    }
  },
  methods: {
    getDisplay (item, link) {
      let result = ''
      if (!link) {
        return ''
      } else {
        let arrKey = link.split('.')
        for (var i = 0; i < arrKey.length; i++) {
          let key = arrKey[i]
          if (typeof result === 'object' && result.constructor === Object) {
            result = result[key]
          } else {
            result = item[key]
          }
        }
      }
      return result
    },
    getSelect (item, key) {
      if (item && item['items']['length']) {
        return item['items']
      } else {
        return []
      }
    },
    getHeader (code) {
      let vm = this
      if (code === 'COP') {
        vm.headers = supportData['headersCOP']
        vm.conditions = supportData['conditionsCOP']
        vm.sourceTable = 'vr_COPReportRepository'
      } else {
        vm.headers = supportData['headersCNCLKL']
        vm.conditions = supportData['conditionsCNCLKL']
        vm.sourceTable = 'vr_VehicleTypeCertificate'
      }
    },
    searchActionBtn () {
      this.page = 1
      let path = this.$router.history.current.path
      let query = this.$router.history.current.query
      this.$router.push({
        path: path,
        query: {
          ...query,
          page: 1
        }
      })
    },
    async search (query) {
      console.log(this.module)
      let vm = this
      console.log('query================', vm.$router.history.current.query)
      let queryTmp = {}
      if (!query) {
        queryTmp = vm.$router.history.current.query
        console.log('queryTmp================', queryTmp)
        delete queryTmp['page']
      }
      let queries = vm.generateQuery(queryTmp)
      this.$store.dispatch('getDataTable', queries).then(result => {
        console.log('result ============>>', result)
        let tmpData = result['hits']['hits'] || []
        if (tmpData && tmpData['length']) {
          if (vm.codeTable === 'COP') {
            tmpData = vm.convertModelCOP(tmpData)
          } else {
            tmpData = vm.convertModelCNCLKL(tmpData)
          }
        }
        console.log('tempData==============', tmpData)
        vm.lists = tmpData
        vm.totalTraCuu = result['hits']['total'] || 0
      })
    },
    convertModelCOP (model) {
      if (!model) {
        return []
      }
      return model.map(item => {
        return {
          vr_COPProductionPlantEquipment: item['_source']['data']['vr_COPProductionPlantEquipment'],
          vr_COPProductType: item['_source']['data']['vr_COPProductType'],
          vr_COPReportRepository: item['_source']['data']['vr_COPReportRepository'],
          vr_COPProductionPlantEmployee: item['_source']['data']['vr_COPProductionPlantEmployee'],
          vr_COPReport_Attach: item['_source']['data']['vr_COPReport_Attach'],
          vr_COPProductLine: item['_source']['data']['vr_COPProductLine'],
          vr_COPProductionPlantProdEquipment: item['_source']['data']['vr_COPProductionPlantProdEquipment'],
          dossierId: item['_source']['dossierId'],
          id: item['_source']['id']
        }
      })
    },
    convertModelCNCLKL (model) {
      if (!model) {
        return []
      }
      return model.map(item => {
        return {
          vr_technicalspec_xmy: item['_source']['data']['vr_technicalspec_xmy'],
          vr_cfg_technicalspec: item['_source']['data']['vr_cfg_technicalspec'],
          vr_VehicleSpecification: item['_source']['data']['vr_VehicleSpecification'],
          vr_inspectionstandard: item['_source']['data']['vr_inspectionstandard'],
          vr_technicalspec_xcg: item['_source']['data']['vr_technicalspec_xcg'],
          vr_VehicleEquipment: item['_source']['data']['vr_VehicleEquipment'],
          vr_technicalspec_lkxmy: item['_source']['data']['vr_technicalspec_lkxmy'],
          vr_technicalspec_xdd: item['_source']['data']['vr_technicalspec_xdd'],
          vr_technicalspec_xcnbb: item['_source']['data']['vr_technicalspec_xcnbb'],
          vr_cfg_limit_technicalspec: item['_source']['data']['vr_cfg_limit_technicalspec'],
          vr_technicalspec_lkxcg: item['_source']['data']['vr_technicalspec_lkxcg'],
          vr_technicalspec_xchbb: item['_source']['data']['vr_technicalspec_xchbb'],
          vr_VehicleTypeCertificate: item['_source']['data']['vr_VehicleTypeCertificate'],
          dossierId: item['_source']['dossierId'],
          id: item['_source']['id']
        }
      })
    },
    changeCondition (item) {
      let conditionsSelect = item['conditionsSelect']
      if (conditionsSelect && conditionsSelect['type']) {
        if (conditionsSelect['type'] === 'string') {
          item['typeSearch'] = 'like'
          item['typeSearchItems'] = this.dataItemString
        } else if (conditionsSelect['type'] === 'number') {
          item['typeSearch'] = '='
          item['typeSearchItems'] = this.dataItem
        }
      } else {
        item['typeSearch'] = '='
      }
    },
    generateQuery (query) {
      let vm = this
      let queries = {
        'indice': vm.sourceTable,
        'query': {
          'size': 15,
          'from': this.page * 15 - 15,
          'query': {
            'bool': {
              'must': mustQuery
            }
          }
        }
      }
      let mustQuery = [
        {
          'match': {
            'type_es': vm.sourceTable
          }
        }
      ]
      for (var i = 0; i < vm.listSearch.length; i++) {
        if (vm.listSearch[i] && vm.listSearch[i]['conditionsSelect']) {
          let conditionsSelect = vm.listSearch[i]['conditionsSelect']
          let key = conditionsSelect['key']
          let tmpObj = {}
          if (vm.listSearch[i]['conditionsSelect']['type'] === 'string') {
            if (conditionsSelect && vm.listSearch[i]['valueSearch']) {
              tmpObj[key] = vm.listSearch[i]['valueSearch']
              mustQuery.push({
                'match': tmpObj
              })
            }
          } else if (vm.listSearch[i]['conditionsSelect']['type'] === 'date') {
            if (conditionsSelect) {
              tmpObj[key] = {
                gte: vm.listSearch[i]['fromDate'],
                lte: vm.listSearch[i]['toDate']
              }
              mustQuery.push({
                'range': tmpObj
              })
            }
          } else if (vm.listSearch[i]['conditionsSelect']['type'] === 'number') {
            console.log('typeSearch+++++++++++++++++++', vm.listSearch[i]['typeSearch'])
            if (conditionsSelect) {
              tmpObj[key] = {
              }
              if (vm.listSearch[i]['typeSearch'] === 'gte') {
                tmpObj[key] = {
                  gte: vm.listSearch[i]['valueSearch']
                }
                mustQuery.push({
                  'range': tmpObj
                })
              } else if (vm.listSearch[i]['typeSearch'] === 'lte') {
                tmpObj[key] = {
                  lte: vm.listSearch[i]['valueSearch']
                }
                mustQuery.push({
                  'range': tmpObj
                })
              } else {
                tmpObj[key] = vm.listSearch[i]['valueSearch']
                mustQuery.push({
                  'match': tmpObj
                })
              }
            }
          } else {
            if (vm.listSearch[i]['valueSearch']) {
              tmpObj[key] = vm.listSearch[i]['valueSearch']
              mustQuery.push({
                'match': tmpObj
              })
            }
          }
        }
      }
      if (query) {
        for (var key in query) {
          if (query[key]) {
            let tmpObj = {}
            let keyTmp = `data.${vm.sourceTable}.${key}`
            tmpObj[keyTmp] = query[key]
            mustQuery.push({
              'match': tmpObj
            })
          }
        }
      }
      queries = {
        'indice': vm.sourceTable,
        'query': {
          'size': 15,
          'from': this.page * 15 - 15,
          'query': {
            'bool': {
              'must': mustQuery
            }
          }
        }
      }
      console.log(queries)
      return queries
    },
    addSearch () {
      const index = this.listSearch.length + 1
      const item = {
        index,
        value: null,
        searchType: null,
        dataitem: null,
        dataCollection: [],
        conditionsSelect: {}
      }
      this.listSearch.push(item)
    },
    removeSearch (item, index) {
      this.listSearch.splice(index, 1)
    },
    paggingData (config) {
      this.page = config['page']
      let path = this.$router.history.current.path
      let query = this.$router.history.current.query
      this.$router.push({
        path: path,
        query: {
          ...query,
          page: config['page']
        }
      })
    }
  },
  filters: {
    maXuong (value) {
      if (!value) {
        return
      }
      return value.substring(value.length - 12, value.length)
    },
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
