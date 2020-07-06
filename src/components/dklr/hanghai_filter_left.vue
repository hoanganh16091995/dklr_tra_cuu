<template>
  <div id="tree">
    <div id="title-danhsach" class="row-header" style="height: 38px; overflow: hidden;">
      <div class="background-triangle-big view_tp_pdf" style="font-size: 13px;">Danh sách Modules</div>
    </div>
    <v-autocomplete
      outlined
      @input="selectModuleAction()"
      v-model="selectModule"
      :items="modules"
      return-object
      item-text="name"
      item-value="module"
      autocomplete="off"
      id="input-search-module"
      placeholder="Tên Module"
      >
      <template v-slot:append-outer>
        <v-icon
        >mdi-magnify</v-icon> 
      </template>
    </v-autocomplete>
    <v-treeview
        id="treeView"
        v-model="tree"
        :open="open"
        :items="[selectModule]"
        activatable
        item-key="id"
        open-on-click
        :load-children="getItems"
    >
        <template v-slot:prepend="{ item, open }">
          <div @click="selectItem(item)">
            <v-icon v-if="!item.file && item.level === 1" color="orange darken-2">
                {{ open ? 'folder_open' : 'folder' }}
            </v-icon>
            <v-icon v-else>
                {{ files[item.file] }}
            </v-icon>
            <i class="mdi mdi-home-modern" v-if="item.level === 2"></i>
            <i class="mdi mdi-calendar"  v-if="item.level === 3"></i>
            <i class="mdi mdi-reproduction"  v-if="item.level === 4"></i>
          </div>
        </template>
        <template v-slot:append="{ item, open }">
          <v-icon class="pr-2" style="font-size: 20px;" v-if="!item.showLableSearch && item.level === 1" @click="item.showLableSearch = !item.showLableSearch">assignment_ind</v-icon>
          <v-icon class="pr-2" style="font-size: 20px;" v-if="item.showLableSearch && item.level === 1" @click="item.showLableSearch = !item.showLableSearch">clear</v-icon>
          <!-- <i class="mdi mdi-account-search" style="font-size: 20px;"  v-if="!item.showLableSearch && item.level === 1" @click="item.showLableSearch = !item.showLableSearch "></i>
          <i class="mdi mdi-window-close" style="font-size: 20px;" v-if="item.showLableSearch  && item.level === 1"  @click="item.showLableSearch=!item.showLableSearch "></i> -->
        </template>
        <template v-slot:label="{ item, open }">
           <div @click="selectItem(item)">
              
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{getName(item.name)}}</span>
                </template>
                <span>{{item.name}}</span>
              </v-tooltip>
              <div v-if="item.showLableSearch">

                <v-autocomplete
                v-model="selectModule['doannhNghiep']"
                :items="selectModule['listDoanhNghiep']"
                item-text="mappingten_cty"
                item-value="mappingma_cty"
                @change="selectDoanhNghiep($event, item)"
                :search-input.sync="searchApplicantProfile"
                cache-items
                class="mx-4"
                flat
                hide-no-data
                hide-details
                placeholder="Tìm kiếm doanh nghiệp"
                outlined
                ></v-autocomplete>
              </div>
            </div>
        </template>
    </v-treeview>
  </div>
</template>

<script>
/* eslint-disable */
import supportData from '@/store/support_data.json'
export default {
  props: {
  },
  watch: {
    selectModule (val) {
    },
    searchApplicantProfile (val) {
      this.inputSearchDoanhNghiep(val)
    },
    searchCty (val) {
      if (val && val['length'] >= 3) {
      }
    },
  },
  data: () => ({
    selectModule: {},
    modules: supportData['modules'],
    searchCty: '',
    searchApplicantProfile: '',
    open: [],
    sourceTree: '',
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-json',
      md: 'mdi-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel'
    },
    tree: [],
    tenDoanhNgiep: '',
  }),
  computed: {
  },
  created () {
    let vm = this
    vm.$nextTick(function () {
      let params = vm.$router.history.current['params']
      if (params && params['codeTable']) {
        this.selectModule = vm.modules.find(item => {
          return item['module'] === params['codeTable']
        })
      }
      if (params && params['codeTable'] === 'COP') {
        vm.sourceTree = 'vr_ProductionPlant'
      } else {
        vm.sourceTree = 'vr_VehicleTypeCertificate'
      }
      console.log(this.selectModule)
    })
  },
  methods: {
    selectModuleAction () {
      if (this.selectModule) {
        this.$router.push({
          path: '/tra-cuu/' + this.selectModule['module'],
          query: {
            page: 1
          }
        })
      }
    },
    async getItems (item) {
      if (item.level !== 1){
        let params = {}
        let level = item.level
        let path = null
        let module = item.module
        let pathParent= item.pathParent
        switch (item.level) {
          case 2:
          params = {
            productionplantid: item.primaryKey,
            start: -1,
            end: -1,
            order_asc: 'id',
            order_desc: 'report_year'
          }
          break
          case 3:
          params = {
            productionplantid: item.productionplantid,
            start: -1,
            end: -1,
            order_asc: 'id',
          }
          path = item.name
          break
        }
        let queries = {
          level,
          params,
          path,
          module,
          pathParent
        }
        await this.$store.dispatch('tracuu/getTreeViews', queries).then(res => {
          item.children = res
          if(res[0].level ===  4) {
          }
        }).catch(err => {
         item.children = []
       })
      }
    },
    async selectItem (item) {
      console.log(item)
      // await this.$store.dispatch('tracuu/setModule', item)
      // if (item.level === 1) {
      //   this.$store.dispatch('tracuu/setPage', 1)
      //   this.$store.dispatch('tracuu/setPageSize', 10)
      // }
      // if (item.level === 2) {
      //   this.$store.dispatch('tracuu/setPage', 1)
      //   this.$store.dispatch('tracuu/setPageSize', 10)
      // }
      // if (item.level === 3) {
      //   this.$store.dispatch('tracuu/setPage', 1)
      //   this.$store.dispatch('tracuu/setPageSize', 10)
      // }
    },
    selectDoanhNghiep (event, item) {
      let vm = this
      let current = vm.$router.history.current
      let newQuery = current.query
      console.log('newQuery++++++++++++++++', newQuery)
      console.log('item++++++++++++++++', item)
      vm.$router.push({
        path: '/tra-cuu',
        query: {
          applicantCode: item['applicantcode']
        }
      })
      let queries = {
        'indice': vm.sourceTree,
        'query': {
          'size': 50,
          'from': 0,
          'query': {
            'bool': {
              'must': [
                {
                  'match': {
                    'type_es': vm.sourceTree
                  }
                },
                {
                  'match': {
                    'applicantProfileId': item['applicantProfileId']
                  }
                }
              ]
            }
          }
        }
      }
      vm.$store.dispatch('getDataTable', queries).then(result => {
        console.log('result ============>>', result)
        let tmpData = result['hits']['hits'] || []
        if (tmpData && tmpData['length']) {
          tmpData = vm.convertModelCOP(tmpData)
        }
        vm.lists = tmpData
      })
    },
    inputSearchDoanhNghiep (val) {
      let vm = this
      if (val && val.length > 3) {
        let queries = {
          'indice': 'vr_ApplicantProfile',
          'query': {
            'size': 50,
            'from': 0,
            'query': {
              'bool': {
                'must': [
                  {
                    'match': {
                      'type_es': 'vr_ApplicantProfile'
                    }
                  },
                  {
                    'match': {
                      'data.vr_ApplicantProfile.applicantName': val
                    }
                  }
                ]
              }
            }
          }
        }
        vm.$store.dispatch('getDataTable', queries).then(result => {
          console.log('result ============>>', result['hits']['hits'])
          vm.selectModule['listDoanhNghiep'] = result
        })
      }
    },
    getName (name) {
      if (name && name['length'] > 40) {
        return name.substr(0, 40) + '...'
      }
      return name
    }
  }
}
/* eslint-disable */
</script>
