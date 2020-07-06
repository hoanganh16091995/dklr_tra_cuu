<template>

  <v-layout wrap>
    <v-flex>
      <danh-sach-tau-all
        :code="code"
        :type="type"
        :documentYear="''"
        :documentName="''"
        :documentTypeCode="documentTypeCode"
        :documentStatusCode="documentStatusCode"
      >
      </danh-sach-tau-all>
    </v-flex>
  </v-layout>

</template>

<script>
import supportData from '../store/support_data.json'
import {eventBus} from '@/event-bus/eventBus.js'
import DanhSachTauAll from './hang_hai/DanhSachTauAll.vue'

export default {
  props: ['type', 'documentTypeCode', 'documentStatusCode', 'code'],
  components: {
    'danh-sach-tau-all': DanhSachTauAll
  },
  data: () => ({
    loading: true,
    supportData: supportData
  }),
  beforeCreate () {
    var vm = this
    vm.$nextTick(function () {
    })
  },
  created () {
    var vm = this
    vm.emitStatusTextTable()
    vm.$nextTick(function () {
      vm.changeHeader({
        type: vm.code
      })
    })
  },
  watch: {
    code: function (val) {
      var vm = this
      vm.changeHeader({
        type: val
      })
    }
  },
  methods: {
    emitStatusTextTable () {
      var vm = this
      var statusText = ''
      switch (vm.code) {
        case 'DanhSachTauBien': {
          statusText = 'Danh sách tàu biển'
          break
        }
        case 'DanhSachPhuongTienThuyNoiDia': {
          statusText = 'Danh sách PTTNĐ'
          break
        }
        case 'DanhSachTauRoiCang': {
          statusText = 'Danh sách tàu rời cảng'
          break
        }
        case 'DanhSachTauDenCang': {
          statusText = 'Danh sách tàu đến cảng'
          break
        }
        case 'DanhSachTauDiChuyen': {
          statusText = 'Danh sách tàu di chuyển'
          break
        }
        case 'DanhSachNeoTau': {
          statusText = 'Danh sách tàu neo đậu'
          break
        }
        case 'DanhSachTauLaiHoTro': {
          statusText = 'Danh sách tàu lai hỗ trợ'
          break
        }
        case 'DanhSachHoaTieuDanTau': {
          statusText = 'Danh sách hoa tiêu dẫn tàu'
          break
        }
        case 'DanhSachXepDoHang': {
          statusText = 'Danh sách xếp dỡ hàng'
          break
        }
        case 'DanhSachNhapTachDoan': {
          statusText = 'Danh sách nhập tách đoàn'
          break
        }
        case 'DanhSachSuaChuaTau': {
          statusText = 'Danh sách sửa chữa tàu'
          break
        }
        case 'DanhSachHaXuong': {
          statusText = 'Danh sách hạ xuồng'
          break
        }
        case 'DanhSachThuTau': {
          statusText = 'Danh sách thử tàu'
          break
        }
        case 'DanhSachDuTau': {
          statusText = 'Danh sách xếp dữ tàu'
          break
        }
        case 'DanhSachGhiChuCanhBao': {
          statusText = 'Danh sách ghi chú cảnh báo'
          break
        }
        case 'DanhSachKhangNghiHangHai': {
          statusText = 'Danh sách kháng nghị hàng hải'
          break
        }
        default: {
          statusText = 'Danh sách kế hoạch chuyên tuyến'
          break
        }
      }
      eventBus.$emit('changeStatusTable', statusText)
    },
    changeHeader (item) {
      var vm = this
      vm.$emit('changeHeader', item.type)
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
