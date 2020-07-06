<template>
  <div style="width: 100%; background: #ffff; position: relative;" class="filter__adv_class">
    <v-flex xs12 sm12>
      <v-layout row wrap class="ml-0 pr-3">
        <v-flex xs12 sm2>
          <v-subheader>Tên doanh nghiệp:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-text-field
            @keyup.enter="filterADV"
            v-model="ttdnMaDoanhNghiep"
            outline
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm2>
          <v-subheader>Mã số thuế:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-text-field
            @keyup.enter="filterADV"
            v-model="ttdnMaSoThue"
            outline
          ></v-text-field>
        </v-flex>

        <v-flex xs12 sm2>
          <v-subheader>Địa chỉ:</v-subheader>
        </v-flex>
        <v-flex xs12 sm10>
          <v-textarea
            @keyup.enter="filterADV"
            rows="2"
            v-model="ttdnDiaChi"
            outline
          ></v-textarea>
        </v-flex>

        <v-flex xs12 sm2>
          <v-subheader>Loại hình:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-select
          @input="filterADV"
          :items="ttdnLoaiHinhItems"
          item-text="itemText"
          item-value="itemValue"
          v-model="ttdnLoaiHinh"
          outline
          ></v-select>
        </v-flex>

        <v-flex xs12 sm2>
          <v-subheader>Nguồn:</v-subheader>
        </v-flex>
        <v-flex xs12 sm4>
          <v-select
          @input="filterADV"
          :items="ttdnNguonItems"
          item-text="itemText"
          item-value="itemValue"
          v-model="ttdnNguon"
          outline
          ></v-select>
        </v-flex>

        <v-flex xs12 sm12 class="text-xs-right">
          <v-btn small color="primary" @click="filterADV">Tìm kiếm</v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </div>
</template>

<script>
import moment from 'moment'
import router from '@/router'
const COMPONENT_NAME = 'jx-hanghai-filter-adv'

export default {
  name: COMPONENT_NAME,
  components: {
  },
  props: {
    type: '',
    code: ''
  },
  watch: {
    date4 (val) {
      this.filterAdvSearch()
    }
  },
  data () {
    return {
      ttdnMaDoanhNghiep: '',
      ttdnMaSoThue: '',
      ttdnDiaChi: '',
      ttdnLoaiHinh: '',
      ttdnTinhTrang: '',
      ttdnNguon: '',
      ttdnTrangThai: '',
      ttdnLoaiHinhItems: [
        {
          itemText: 'Thiết kế',
          itemValue: 1
        },
        {
          itemText: 'SXLR trong nước',
          itemValue: 2
        },
        {
          itemText: 'Nhập khẩu',
          itemValue: 3
        }
      ],
      ttdnNguonItems: [
        {
          itemText: 'MTCORE',
          itemValue: 'MTCORE'
        },
        {
          itemText: 'ORACLE',
          itemValue: 'ORACLE'
        }
      ]
    }
  },
  computed: {
    computedDate4Formatted () {
      return this.formatDate(this.date4)
    }
  },
  methods: {
    filterADV: function () {
      console.log('param++++++++', param)
      let vm = this
      let param = {}
      let current = vm.$router.history.current
      let newQuery = current.query
      for (var key in newQuery) {
        param[key] = newQuery[key]
      }
      router.push({
        path: '/thong-tin-doanh-nghiep/' + vm.type + '/' + vm.code,
        query: {
          ...param,
          ttdnMaDoanhNghiep: vm.ttdnMaDoanhNghiep,
          ttdnMaSoThue: vm.ttdnMaSoThue,
          ttdnDiaChi: vm.ttdnDiaChi,
          ttdnLoaiHinh: vm.ttdnLoaiHinh,
          ttdnNguon: vm.ttdnNguon
        }
      })
    },
    filterAdvSearch: function () {
      router.push({
        path: '/danh-sach-ho-so/',
        query: {
        }
      })
    },
    dateTimeCustomPicker: function (value) {
      console.log(value)
    },
    toDetail () {
      router.push({
        path: '/import-du-lieu/chi-tiet'
      })
    },
    formatDate (date) {
      if (date === null || date === undefined || date === '') return ''
      return moment(date, 'DD/MM/YYYY HH:mm').toDate().getTime()
    }
  }
}
</script>
