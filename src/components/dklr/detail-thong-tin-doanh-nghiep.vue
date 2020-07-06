<!-- TODO detailTemplate page -->
<template>
  <div style="width: 100%;">
  <div class="row-header">
    <div class="background-triangle-big"> Thông tin doanh nghiệp - {{detailRegistModel['applicantName']}}</div>
    <div class="layout row wrap header_tools row-blue">
  
      <div class="flex xs12 text-right" style="margin-left: auto;">
    
        <v-btn flat class=" my-0 py-0 btn-border-left" color="grey darken-1" v-on:click.native="quayLai()">
          <v-icon class="mr-2">undo</v-icon>
        Quay lại
        </v-btn>

      </div>
  
    </div>
  
  </div>
  
  <v-expansion-panel expand class="my-0 opencps-dossier-info" v-if="showThongTinChung">
    <v-expansion-panel-content class="expansion-header-registration" v-bind:value="true">
    
    <div slot="header" class="text-bold primary--text">I. Thông tin chung <i>({{ detailRegistModel.registrationState | registrationState }})</i></div>
    <v-layout wrap class="px-4 pb-2 pt-2">
      <v-flex xs12 sm6>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Tên tổ chức/ Doanh nghiệp (<span style="color: red;">*</span>): 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="applicantName">
            <span v-if="initData.user['id'] != detailRegistModel.userId">
            
              {{detailRegistModel.applicantName}}
              
            </span>
            <v-text-field v-else
                    v-model="detailRegistModel.applicantName"
                    placeholder="tên tổ chức, doanh nghiệp ..."
                    class="pt-0 mt--5"
                    single-line
                    :rules="[(v) => !!v || 'Tên tổ chức/ Doanh nghiệp bắt buộc phải nhập']"
                    required
                  ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Mã số thuế (<span style="color: red;">*</span>):
          </v-flex>
          <v-flex xs12 sm7 jx-bind="applicantIdNo">
            <span v-if="initData.user['id'] != detailRegistModel.userId">
            
              {{detailRegistModel.applicantIdNo}}
              
            </span>
            <v-text-field v-else
                    v-model="detailRegistModel.applicantIdNo"
                    placeholder="mã số thuế ..."
                    class="pt-0 mt--5"
                    single-line
                    :rules="[(v) => !!v || 'Mã số thuế bắt buộc phải nhập']"
                    required
                  ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Ngày cấp: 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="applicantIdDate">
            <span v-if="initData.user['id'] != detailRegistModel.userId">
            
              {{detailRegistModel.applicantIdDate | date}}
              
            </span>
            <v-menu v-else
                  lazy
                  :close-on-content-click="false"
                  v-model="menu"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    class="pt-0 mt--5"
                    placeholder="ngày ... tháng ... năm"
                    v-model="detailRegistModel.applicantIdDate"
                    append-icon="event"
                    readonly
                    @blur="detailRegistModel.applicantIdDate = parseDate(dateFormatted)"
                  ></v-text-field>
                  <v-date-picker v-model="detailRegistModel.applicantIdDate" @input="dateFormatted = formatDate($event)" no-title scrollable actions>
                  </v-date-picker>
                </v-menu>

          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Người đại diện (<span style="color: red;">*</span>): 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="contactName">
            <span v-if="initData.user['id'] != detailRegistModel.userId">
            
              {{detailRegistModel.contactName}}
              
            </span>
            <v-text-field v-else
                    v-model="detailRegistModel.contactName"
                    placeholder="tên người đại diện ..."
                    class="pt-0 mt--5"
                    single-line
                    :rules="[(v) => !!v || 'Người đại diện bắt buộc phải nhập']"
                    required
                  ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Số điện thoại liên hệ: 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="contactTelNo">
            {{detailRegistModel.contactTelNo}}
          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Địa chỉ email liên hệ (<span style="color: red;">*</span>): 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="contactEmail">
            <span v-if="initData.user['id'] != detailRegistModel.userId">
            
              {{detailRegistModel.contactEmail}}
              
            </span>
            <v-text-field v-else
                    v-model="detailRegistModel.contactEmail"
                    placeholder="địa chỉ email ..."
                    class="pt-0 mt--5"
                    single-line
                    :rules="[(v) => !!v || 'Địa chỉ email bắt buộc phải nhập']"
                    required
                  ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Địa chỉ (<span style="color: red;">*</span>): 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="address">
            <span v-if="initData.user['id'] != detailRegistModel.userId">
            
              {{detailRegistModel.address}}
              
            </span>
            <v-text-field v-else
                    v-model="detailRegistModel.address"
                    placeholder="địa chỉ ..."
                    class="pt-0 mt--5 address--height"
                    multi-line
                    :rules="[(v) => !!v || 'Địa chỉ bắt buộc phải nhập']"
                    required
                  ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Tỉnh/ Thành Phố: 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="cityCode">
            {{detailRegistModel.cityName}}
          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Quận/ Huyện: 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="districtCode">
            {{detailRegistModel.districtName}}
          </v-flex>
        </v-layout>
        <v-layout wrap class="pb-2">
          <v-flex xs12 sm5 class="text-right text-bold pr-2">
            Xã/ Phường: 
          </v-flex>
          <v-flex xs12 sm7 jx-bind="wardCode">
            {{detailRegistModel.wardName}}
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-expansion-panel expand class="my-0 opencps-dossier-info opencps-dossier-part-style" v-if="showThongTinDoanhNghiep">
    <v-expansion-panel-content class="expansion-header-registration" v-bind:value="false">
    
    <div slot="header" class="text-bold primary--text">II. Thông tin doanh nghiệp và các xưởng lắp ráp (nếu có)</div>
    <v-expansion-panel class="my-0 expansion__list_style">
          <v-expansion-panel-content v-for="(item,i) in registForms" v-if="item" :key="item.referenceUid">
          <div slot="header" @click="showAlpacaJSFORMRegist(item)">{{i + 1}}. {{item.formName}}</div>
  
          <div :id="'regist_form_'+item.referenceUid" class="expansion-panel__header"></div>
  
          </v-expansion-panel-content>
      </v-expansion-panel>

    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-expansion-panel expand class="my-0 opencps-dossier-info opencps-dossier-part-style" v-if="!stateRegisChoXN.includes(detailRegistModel.registrationState) && showCoSoSanXuatLapRap">
    <v-expansion-panel-content class="expansion-header-registration" v-bind:value="false">
    
    <div slot="header" class="text-bold primary--text">III. Cơ sở sản xuất nước ngoài được liên kết</div>
    <v-layout row wrap class="ml-0">
      <v-flex xs12 sm12 v-if="!loadingCoSoNuocNgoai_Regis">
        <v-data-table 
          :headers="headersCoSoNuocNgoai_Regis"
          :items="itemsCoSoNuocNgoai_Regis"
          no-data-text="Không có dữ liệu"
          hide-actions
          class="table__overflow ml-0 px-3 py-2"
          loading="true"
          hide-actions
        > 
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="header in props.headers" :key="header.text"
              :class="['column text-xs-center']" v-html="header.text"
              >
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td style="padding: 8px 0px 8px 0px; width: 3%; " class="text-xs-center">
              <!-- {{ pageCoSoNuocNgoai * 15 - 15 + props.index + 1 }} -->
              {{ props.index + 1 }}
            </td>
            <td style="padding: 8px;" class="text-xs-center">
              {{props.item.itemCode}}
            </td>
            <td style="padding: 8px; width: 30%;" class="text-xs-center">
              {{props.item.itemName}}
            </td>
            <td style="padding: 8px; width: 40%;" class="text-xs-center">
              {{props.item.itemDescription}}
            </td>
          </template>
        </v-data-table>
        </v-flex>
      <v-flex xs12 sm12 class="text-xs-center" v-else>
          <v-progress-circular indeterminate v-bind:size="70" v-bind:width="2" color="purple"></v-progress-circular>
      </v-flex>
    </v-layout>

    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-expansion-panel expand class="my-0 opencps-dossier-info opencps-dossier-part-style" v-if="!stateRegisChoXN.includes(detailRegistModel.registrationState) && showDanhGiaCop">
    <v-expansion-panel-content class="expansion-header-registration" v-bind:value="false">
    
    <div slot="header" class="text-bold primary--text">IV. Lịch sử đánh giá COP</div>
    <v-layout row wrap class="ml-0">
      <v-flex xs12 sm12 v-if="!loadingLichSuDanhGiaCOP">
        <v-data-table 
          :headers="headersLichSuDanhGiaCOP"
          :items="itemsLichSuDanhGiaCOP"
          no-data-text="Không có dữ liệu"
          hide-actions
          class="table__overflow ml-0 px-3 py-2"
          loading="true"
          hide-actions
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="header in props.headers" :key="header.text"
              :class="['column text-xs-center']" v-html="header.text"
              >
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td style="padding: 8px 0px 8px 0px; width: 3%; " class="text-xs-center">
              <!-- {{ pageCoSoNuocNgoai * 15 - 15 + props.index + 1 }} -->
              {{ props.index + 1 }}
            </td>
            <td style="padding: 8px;" class="text-xs-center">
              {{props.item.itemCode}}
            </td>
            <td style="padding: 8px; width: 30%;" class="text-xs-center">
              {{props.item.itemName}}
            </td>
            <td style="padding: 8px; width: 40%;" class="text-xs-center">
              {{props.item.itemDescription}}
            </td>
          </template>
        </v-data-table>
        </v-flex>
      <v-flex xs12 sm12 class="text-xs-center" v-else>
          <v-progress-circular indeterminate v-bind:size="70" v-bind:width="2" color="purple"></v-progress-circular>
      </v-flex>
    </v-layout>

    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-expansion-panel expand class="my-0 opencps-dossier-info opencps-dossier-part-style" v-if="!stateRegisChoXN.includes(detailRegistModel.registrationState) && showHoSoDenHanXN">
    <v-expansion-panel-content class="expansion-header-registration" v-bind:value="false">
    
    <div slot="header" class="text-bold primary--text">V. Hồ sơ đến hạn xác nhận hiệu lực</div>
    <v-layout row wrap class="ml-0">
      <v-flex xs12 sm12 v-if="!loadingHSDenHanXacNhan">
        <v-data-table 
          :headers="headersHSDenHanXacNhan"
          :items="itemsHSDenHanXacNhan"
          no-data-text="Không có dữ liệu"
          hide-actions
          class="table__overflow ml-0 px-3 py-2"
          loading="true"
          hide-actions
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="header in props.headers" :key="header.text"
              :class="['column text-xs-center']" v-html="header.text"
              >
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td style="padding: 8px; padding-left: 0px; text-align: center;">
              {{ props.index + 1 }}
            </td>
            <td style="padding: 8px;" class="text-xs-left">
              {{ props.item.serviceName }} 
              <br>
              {{ props.item.applicantName }} 
            </td>
            <td style="padding: 8px;" class="text-xs-left">
              {{ props.item.dossierIdCTN }} 
              <br v-if="props.item.dossierNo">
              {{ props.item.dossierNo }} 
            </td>
            <td style="padding: 8px;" class="text-xs-left">
              {{ props.item.submitDate}}
              <br v-if="props.item.submitDate">
              {{ props.item.receiveDate}}
            </td>

            <td style="padding: 8px;" class="text-xs-center">

              <span v-if="props.item.certNo">{{ props.item.certNo }}</span>
              <span v-else>---</span> <br>
              <span v-if="props.item.certDate">{{ props.item.certDate }}</span>
              <span v-else>---</span>
            </td>

            <td style="padding: 8px;" class="text-xs-left" v-html="props.item.briefNote">
            </td>
            <td style="padding: 8px;" class="text-xs-left" v-html="props.item.applicantNote"></td>
          </template>
        </v-data-table>
        </v-flex>
      <v-flex xs12 sm12 class="text-xs-center" v-else>
          <v-progress-circular indeterminate v-bind:size="70" v-bind:width="2" color="purple"></v-progress-circular>
      </v-flex>
    </v-layout>

    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-expansion-panel expand class="my-0 opencps-dossier-info opencps-dossier-part-style" v-if="!stateRegisChoXN.includes(detailRegistModel.registrationState) && showSanPhamDungSanXuat">
    <v-expansion-panel-content class="expansion-header-registration" v-bind:value="false">
    
    <div slot="header" class="text-bold primary--text">VI. Sản phẩm dừng sản xuất</div>
    <v-layout row wrap class="ml-0">
      <v-flex xs12 sm12 v-if="!loadingSpDungSanXuat">
        <v-data-table 
          :headers="headersSpDungSanXuat"
          :items="itemsSpDungSanXuat"
          no-data-text="Không có dữ liệu"
          hide-actions
          class="table__overflow ml-0 px-3 py-2"
          loading="true"
          hide-actions
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="header in props.headers" :key="header.text"
              :class="['column text-xs-center']" v-html="header.text"
              >
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td style="padding: 8px 0px 8px 0px; width: 3%; " class="text-xs-center">
              <!-- {{ pageCoSoNuocNgoai * 15 - 15 + props.index + 1 }} -->
              {{ props.index + 1 }}
            </td>
            <td style="padding: 8px;" class="text-xs-center">
              {{props.item.itemCode}}
            </td>
            <td style="padding: 8px; width: 30%;" class="text-xs-center">
              {{props.item.itemName}}
            </td>
            <td style="padding: 8px; width: 40%;" class="text-xs-center">
              {{props.item.itemDescription}}
            </td>
          </template>
        </v-data-table>
        </v-flex>
      <v-flex xs12 sm12 class="text-xs-center" v-else>
          <v-progress-circular indeterminate v-bind:size="70" v-bind:width="2" color="purple"></v-progress-circular>
      </v-flex>
    </v-layout>

    </v-expansion-panel-content>
  </v-expansion-panel>

  <v-expansion-panel expand class="my-0 opencps-dossier-info opencps-dossier-part-style" v-if="!stateRegisChoXN.includes(detailRegistModel.registrationState) && showQuanLyPhieuXuatXuong">
    <v-expansion-panel-content class="expansion-header-registration" v-bind:value="false">
    
    <div slot="header" class="text-bold primary--text">VII. Quản lý phương thức cấp phiếu xuất xưởng</div>
    <v-layout row wrap class="ml-0">
      <v-flex xs12 sm12 v-if="!loadingPtCapPhieuXX">
        <v-data-table 
          :headers="headersPtCapPhieuXX"
          :items="itemsPtCapPhieuXX"
          no-data-text="Không có dữ liệu"
          hide-actions
          class="table__overflow ml-0 px-3 py-2"
          loading="true"
          hide-actions
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="header in props.headers" :key="header.text"
              :class="['column text-xs-center']" v-html="header.text"
              >
              </th>
            </tr>
          </template>
          <template slot="items" slot-scope="props">
            <td style="padding: 8px 0px 8px 0px; width: 3%; " class="text-xs-center">
              <!-- {{ pageCoSoNuocNgoai * 15 - 15 + props.index + 1 }} -->
              {{ props.index + 1 }}
            </td>
            <td style="padding: 8px;" class="text-xs-center">
              {{props.item.itemCode}}
            </td>
            <td style="padding: 8px; width: 30%;" class="text-xs-center">
              {{props.item.itemName}}
            </td>
            <td style="padding: 8px; width: 40%;" class="text-xs-center">
              {{props.item.itemDescription}}
            </td>
          </template>
        </v-data-table>
        <div class="pl-5 pt-1 pb-2">
          <span style="font-weight: bold;">Ghi chú :</span>
          <p class="pl-4">
            -  5. Sản lượng (số phiếu đã lấy trong 1 năm, hoặc trong vòng n tháng gần nhất, hoặc từ ngày đến ngày). <br>
            -  6. Sản lượng trung bình/ tháng trong 1 năm hoặc 6 tháng gần nhất (chỉ tính những tháng phát sinh). <br>
            -  7. Sản lượng trung bình/ tháng, không tính những tháng đột biến (> 20%, 30%). <br>
            -  8. Tính thời gian COP gần nhất. <br>
            -  9. Ngày kiểm tra đột xuất gần nhất, ngày giám sát gần nhất. <br>
            -  10. Số lần kiểm tra đột xuất không đạt trong vòng 6 tháng hoặc 1 năm gần nhất. <br>
            -  11. Số lần kiểm tra đột xuất, giám sát trong tháng hiện tại. <br>
            -  12. Số lần lấy phiếu trong tháng hiện tại. <br>
            -  13. Ngày đầu tiên trong 1 chu kỳ so với ngày hiện tại. <br>
            -  14. Số lần kiểm tra trong 1 chu kỳ (đếm lùi từ 1 ngày thuộc tham số đầu vào). <br>

          </p>
        </div>
        </v-flex>
      <v-flex xs12 sm12 class="text-xs-center" v-else>
          <v-progress-circular indeterminate v-bind:size="70" v-bind:width="2" color="purple"></v-progress-circular>
      </v-flex>
    </v-layout>

    </v-expansion-panel-content>
  </v-expansion-panel>
  

  <v-btn primary class="ml-0 mr-0" v-on:click.native="registrationPheDuyet(2)" v-if="(detailRegistModel.registrationState !== 2 )&& stateButtonregistration">
    <v-icon class="mr-2">done</v-icon>
    Phê duyệt
  </v-btn>
  <v-btn primary class="ml-0 mr-0" v-on:click.native="stateLyDoChinhSua = !stateLyDoChinhSua" v-if="(detailRegistModel.registrationState !== 3 && detailRegistModel.registrationState !== 2) && stateButtonregistration" >
    <v-icon class="mr-2">undo</v-icon>
    Yêu cầu chỉnh sửa đăng kí
  </v-btn>

  <v-text-field
    v-model="lyDoSuaDangKy"
    v-if="stateLyDoChinhSua && stateButtonregistration"
    label="Lý do"
    class="pb-2"
    multi-line
  ></v-text-field>
  <v-btn class="ml-0" v-if="stateLyDoChinhSua && stateButtonregistration" color="primary" small @click="registrationPheDuyet(3)">Xác nhận</v-btn>
</div>
</template>

<script>
// import axios from 'axios'
// import router from '@/router'
const COMPONENT_NAME = 'jx-hanghai-filter-left'
const STATE_XEM_TK = 'xem-tai-khoan'
const STATE_SUA_THONG_TIN_TK = 'sua-tai-khoan'
const STATE_PHE_DUYET_TK = 'phe-duyet-tai-khoan'
const STATE_CAP_NHAT_TINH_TRANG = 'cap-nhat-tinh-trang'
const STATE_MO_TK = 'mo-khoa-tai-khoan'
const STATE_KHOA_TK = 'khoa-tai-khoan'
export default {
  name: COMPONENT_NAME,
  props: {
    type: '',
    code: '',
    id: ''
  },
  components: {
  },
  computed: {
    initData () {
      return {
        user: {
          id: 0
        }
      }
    }
  },
  data () {
    return {
      COMPONENT_NAME: COMPONENT_NAME,
      STATE_XEM_TK: STATE_XEM_TK,
      STATE_SUA_THONG_TIN_TK: STATE_SUA_THONG_TIN_TK,
      STATE_PHE_DUYET_TK: STATE_PHE_DUYET_TK,
      STATE_CAP_NHAT_TINH_TRANG: STATE_CAP_NHAT_TINH_TRANG,
      STATE_MO_TK: STATE_MO_TK,
      STATE_KHOA_TK: STATE_KHOA_TK,
      stateRegisChoXN: [3],
      loadingCoSoNuocNgoai_Regis: false,
      itemsCoSoNuocNgoai_Regis: [],
      loadingLichSuDanhGiaCOP: false,
      registForms: [],
      detailRegistModel: {},
      headersLichSuDanhGiaCOP: [
        {
          text: 'STT',
          align: 'left',
          sortable: false,
          value: 'stt'
        },
        {
          text: 'Số báo cáo đánh giá COP',
          align: 'left',
          sortable: false,
          value: 'sobaocaoCOP'
        },
        {
          text: 'Ngày đánh giá',
          align: 'left',
          sortable: false,
          value: 'ngaydanhgia'
        },
        {
          text: 'Nhà xưởng/ địa chỉ',
          align: 'left',
          sortable: false,
          value: 'nhãuongdiachi'
        },
        {
          text: 'Còn hạn/ hết hạn',
          align: 'left',
          sortable: false,
          value: 'conhanhethan'
        },
        {
          text: 'Tổng điểm',
          align: 'left',
          sortable: false,
          value: 'tongdiem'
        },
        {
          text: 'Kết quả',
          align: 'left',
          sortable: false,
          value: 'ketqua'
        },
        {
          text: 'Ngày đánh giá kế tiếp',
          align: 'left',
          sortable: false,
          value: 'ngaydanhgiaketiep'
        }
      ],
      itemsLichSuDanhGiaCOP: [],
      loadingHSDenHanXacNhan: false,
      headersHSDenHanXacNhan: [
        {
          text: 'STT',
          align: 'center',
          sortable: false,
          value: 'stt'
        },
        {
          text: 'Tên thủ tục <br> Tên doanh nghiệp',
          align: 'left',
          sortable: false,
          value: 'applicantName'
        },
        {
          text: 'Mã hồ sơ <br> Số hồ sơ',
          align: 'left',
          sortable: false,
          value: 'dossierId'
        },
        {
          text: 'Ngày gửi <br> Ngày tiếp nhận',
          align: 'left',
          sortable: false,
          value: 'submitDate'
        },
        {
          text: 'Số chứng chỉ <br> Ngày cấp',
          align: 'center',
          sortable: false,
          value: 'action'
        },
        {
          text: 'Nội dung',
          align: 'left',
          sortable: false,
          value: 'action'
        },
        {
          text: 'Ghi chú',
          align: 'left',
          sortable: false,
          value: 'lastActionNote'
        }
      ],
      itemsHSDenHanXacNhan: [],
      loadingSpDungSanXuat: false,
      headersSpDungSanXuat: [
        {
          text: 'STT',
          align: 'left',
          sortable: false,
          value: 'stt'
        },
        {
          text: 'Nhóm sản phẩm',
          align: 'left',
          sortable: false,
          value: 'nhomsanpham'
        },
        {
          text: 'Loại sản phẩm',
          align: 'left',
          sortable: false,
          value: 'loaisanpham'
        },
        {
          text: 'Nhãn hiệu',
          align: 'left',
          sortable: false,
          value: 'nhanhieu'
        },
        {
          text: 'Tên thương mại',
          align: 'left',
          sortable: false,
          value: 'tenthuongmai'
        },
        {
          text: 'Mã kiểu loại',
          align: 'left',
          sortable: false,
          value: 'makieuloai'
        }
      ],
      itemsSpDungSanXuat: [],
      loadingPtCapPhieuXX: false,
      headersPtCapPhieuXX: [
        {
          text: 'STT',
          align: 'left',
          sortable: false,
          value: 'stt'
        },
        {
          text: 'Thủ tục',
          align: 'left',
          sortable: false,
          value: 'thutuc'
        },
        {
          text: 'Phương thức cấp',
          align: 'left',
          sortable: false,
          value: 'phuongthuccap'
        },
        {
          text: 'Tần suất kiểm tra trong 1 chu kỳ <br> (90 ngày)',
          align: 'left',
          sortable: false,
          value: 'tanxuatkiemtra'
        },
        {
          text: 'Điểm cấp phát <br> (Luồng xanh, đỏ, vàng)',
          align: 'left',
          sortable: false,
          value: 'diemcapphat'
        },
        {
          text: 'Ghi chú (5)...(14)',
          align: 'left',
          sortable: false,
          value: 'ghichu'
        }
      ],
      itemsPtCapPhieuXX: [],
      stateButtonregistration: false,
      stateLyDoChinhSua: false,
      headersCoSoNuocNgoai_Regis: [
        {
          text: 'STT',
          align: 'center',
          sortable: false,
          value: 'stt'
        },
        {
          text: ' Mã CSSX/Nhà Xưởng',
          align: 'center',
          sortable: false,
          value: 'macssx'
        },
        {
          text: 'Tên CSSX/Nhà Xưởng',
          align: 'center',
          sortable: false,
          value: 'tencssx'
        },
        {
          text: 'Địa chỉ CSSX/Nhà Xưởng',
          align: 'center',
          sortable: false,
          value: 'diachicssx'
        }
      ],
      showThongTinChung: false,
      showThongTinDoanhNghiep: false,
      showCoSoSanXuatLapRap: false,
      showDanhGiaCop: false,
      showHoSoDenHanXN: false,
      showSanPhamDungSanXuat: false,
      showQuanLyPhieuXuatXuong: false
    }
  },
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
      vm.checkShowInfo()
      if (vm.showDanhGiaCop) {
        vm.loadDSLichSuDanhGiaCOP()
      }
      if (vm.showSanPhamDungSanXuat) {
        vm.loadDSSpDungSanXuat()
      }
      if (vm.showHoSoDenHanXN) {
        vm.loadDSHSDenHanXacNhan()
      }
      if (vm.showCoSoSanXuatLapRap) {
        vm.loadDSCoSoNuocNgoai_Regis()
      }
      if (vm.showQuanLyPhieuXuatXuong) {
        vm.loadDSPtCapPhieuXX()
      }
      if (vm.showThongTinDoanhNghiep) {
        vm.loadListForms()
      }
    })
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      this.checkShowInfo()
      // let vm = this
      // let query = newRoute.query
    }
  },
  methods: {
    showAlpacaJSFORMRegist (item) {
      let vm = this
      item['registrationId'] = vm.id
      vm.$store.dispatch('showAlpacaJSFORMRegist', item).then(result => {
        vm.registForms = result
      }).catch(xhr => {
        console.log('showAlpacaJSFORMRegist+++++++++++', xhr)
      })
    },
    loadListForms () {
      let vm = this
      vm.$store.dispatch('loadListForms', {
        registrationId: vm.id
      }).then(result => {
        vm.registForms = result
      }).catch(xhr => {
        console.log('loadDSPtCapPhieuXX+++++++++++', xhr)
      })
    },
    loadDSPtCapPhieuXX () {
      let vm = this
      vm.$store.dispatch('loadDSPtCapPhieuXX', {
        registrationId: vm.id
      }).then(result => {
        vm.itemsPtCapPhieuXX = result
      }).catch(xhr => {
        console.log('loadDSPtCapPhieuXX+++++++++++', xhr)
      })
    },
    loadDSCoSoNuocNgoai_Regis () {
      let vm = this
      vm.$store.dispatch('loadDSCoSoNuocNgoai_Regis', {}).then(result => {
        vm.itemsCoSoNuocNgoai_Regis = result
      }).catch(xhr => {
        console.log('loadDSCoSoNuocNgoai_Regis+++++++++++', xhr)
      })
    },
    loadDSLichSuDanhGiaCOP () {
      let vm = this
      vm.$store.dispatch('loadDSLichSuDanhGiaCOP', {}).then(result => {
        vm.itemsLichSuDanhGiaCOP = result
      }).catch(xhr => {
        console.log('loadDSLichSuDanhGiaCOP+++++++++++', xhr)
      })
    },
    loadDSSpDungSanXuat () {
      let vm = this
      vm.$store.dispatch('loadDSSpDungSanXuat', {
        registrationId: vm.id
      }).then(result => {
        vm.itemsSpDungSanXuat = result
      }).catch(xhr => {
        console.log('loadDSSpDungSanXuat+++++++++++', xhr)
      })
    },
    loadDSHSDenHanXacNhan () {
      let vm = this
      vm.$store.dispatch('loadDSHSDenHanXacNhan', {
        registrationId: vm.id
      }).then(result => {
        vm.itemsHSDenHanXacNhan = result
      }).catch(xhr => {
        console.log('loadDSHSDenHanXacNhan+++++++++++', xhr)
      })
    },
    fetchUsers (item) {
      console.log('item---------+++++++++++', item)
    },
    toDetail (item) {
    },
    contextSelected (command) {
      console.log('node++++++++', command)
    },
    selected (node) {
      this.selectedNode = node
      console.log('node++++++++', this.selectedNode)
    },
    checkShowInfo () {
      let vm = this
      if (vm.code === vm.STATE_XEM_TK) {
        vm.showThongTinChung = false
        vm.showThongTinDoanhNghiep = true
        vm.showCoSoSanXuatLapRap = true
        vm.showDanhGiaCop = true
        vm.showHoSoDenHanXN = true
        vm.showSanPhamDungSanXuat = true
        vm.showQuanLyPhieuXuatXuong = true
      } else if (vm.code === vm.STATE_SUA_THONG_TIN_TK) {
        vm.showThongTinChung = true
        vm.showThongTinDoanhNghiep = false
        vm.showCoSoSanXuatLapRap = false
        vm.showDanhGiaCop = false
        vm.showHoSoDenHanXN = false
        vm.showSanPhamDungSanXuat = false
        vm.showQuanLyPhieuXuatXuong = false
      } else if (vm.code === vm.STATE_PHE_DUYET_TK) {
        vm.showThongTinChung = false
        vm.showThongTinDoanhNghiep = true
        vm.showCoSoSanXuatLapRap = false
        vm.showDanhGiaCop = false
        vm.showHoSoDenHanXN = false
        vm.showSanPhamDungSanXuat = false
        vm.showQuanLyPhieuXuatXuong = false
      } else if (vm.code === vm.STATE_CAP_NHAT_TINH_TRANG) {
        vm.showThongTinChung = false
        vm.showThongTinDoanhNghiep = true
        vm.showCoSoSanXuatLapRap = true
        vm.showDanhGiaCop = true
        vm.showHoSoDenHanXN = true
        vm.showSanPhamDungSanXuat = true
        vm.showQuanLyPhieuXuatXuong = true
      } else {
        vm.showThongTinChung = true
        vm.showThongTinDoanhNghiep = true
        vm.showCoSoSanXuatLapRap = true
        vm.showDanhGiaCop = true
        vm.showHoSoDenHanXN = true
        vm.showSanPhamDungSanXuat = true
        vm.showQuanLyPhieuXuatXuong = true
      }
    },
    quayLai () {
      window.history.back()
    }
  },
  filters: {
    registrationState (data) {
      return ''
    },
    date (data) {
      return ''
    }
  }
}
</script>
