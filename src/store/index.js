import Vue from 'vue'
import Vuex from 'vuex'
import toastr from 'toastr'
import axios from 'axios'
// import support from './support.json'
import $ from 'jquery'
// import router from '@/router'

Vue.use(toastr)
Vue.use(Vuex)
export const store = new Vuex.Store({
  state: {
    initData: null,
    loading: false,
    loadingTable: false,
    loadingSubmit: false,
    error: null,
    docTypes: null,
    roleFilterStatus: null,
    userSignsData: null,
    otherData: {},
    itineraryNo: null,
    detailHs: null,
    maritimeCode: '',
    thongTinChung: {},
    thongTinXuong: {},
    thongTinDoanhNghiep: {},
    cssxModel: {}
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    },
    loadInitResource ({commit, state}) {
      if (state.initData == null) {
        return new Promise(function (resolve, reject) {
          // let param = {}
          // let orginURL = window.location.href
          // let coma = window.location.href.lastIndexOf('#/')
          // if (coma > 0) {
          //   orginURL = window.location.href.substr(0, coma)
          // }
          // var url1 = new Promise(function (resolve, reject) {
          //   axios.get(orginURL + support.renderURLInit, param).then(function (response) {
          //     let serializable = response.data
          //     resolve(serializable)
          //   }).catch(function (error) {
          //     console.log(error)
          //     reject(error)
          //   })
          // })
          // Promise.all([url1]).then(function (results) {
          //   var data = results[0]
          //   console.log('InitData============>>>>', data)
          //   commit('setInitData', data)
          //   resolve(data)
          // }).catch(function (xhr) {
          //   commit('setInitData', null)
          //   reject(null)
          // })
          resolve({})
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve(state.initData)
        })
      }
    },
    getDataTable ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        axios.post('/o/dklr/_search', data).then(function (response) {
          const serializable = response.data
          resolve(serializable)
        }).catch(function (error) {
          reject(error)
        })
      })
    },
    loadHistoryUpdate ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          var url = '/o/rest/v2/registrations'
          var configs = {
            headers: {
              groupId: state.initData['groupId']
            },
            params: {
              owner: true,
              ...data
            }
          }
          axios.get(url, configs).then(function (response) {
            var serializable = response.data
            if (serializable['data']) {
              let item = serializable['data'][0] || {}
              commit('setThongTinChung', item)
            } else {
              commit('setThongTinChung', {})
            }
            resolve(serializable)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    },
    loadRegistrationTemplate ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/registrationtemplates',
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId']
            },
            data: {
            },
            success: function (result) {
              resolve(result)
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    addForm ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/registrations/' + data.registrationId + '/forms/' + data['formNo'],
            dataType: 'json',
            type: 'POST',
            headers: {
              'groupId': state.initData['groupId']
            },
            data: {
            },
            success: function (result) {
              resolve(result)
            },
            error: function (result) {
              reject(result)
            }
          })
        })
      })
    },
    getFormData ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formdata'
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            headers: {
              'groupId': state.initData['groupId'],
              Accept: 'application/json'
            },
            data: {
            },
            success: function (result){
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    deleteForm ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          $.ajax({
            url: '/o/rest/v2/registrations/' + data.registrationId + "/forms/" + data['referenceUid'],
            type: 'DELETE',
            dataType: 'text',
            headers: {
              'groupId': state.initData['groupId'],
            },
            success: function (result) {
              resolve(result)
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    saveForm ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formdata'
          $.ajax({
            url: url,
            dataType: 'json',
            type: 'PUT',
            headers: {
              'groupId': state.initData['groupId'],
              Accept: 'application/json'
            },
            data: {
              formdata: JSON.stringify(data.value)
            },
            success: function (result){
              resolve(result)
            },
            error: function (result){
              reject(result)
            }
          })
          /* eslint-disable */
        })
      })
    },
    saveRegistration ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          let type = data['type'] || 'PUT'
          var url = ''
          if (data['type'] === 'POST') {
            url = '/o/rest/v2/registrations'
          } else {
            url = '/o/rest/v2/registrations/' + data['registrationId']
          }
          $.ajax({
            url: url,
            dataType: "json",
            type: type,
            headers: {
              groupId: state.initData['groupId']
            },
            data: data,
            success: function (result) {
              resolve(result)
            },
            error: function (xhr) {
              reject(xhr)
            }
          })
        })
      })
    },
    showAlpacaJSFORMRegist ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          /* eslint-disable */
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formscript'
          let alapcaJSRei = {}
          window.$('#formPartNo' + data['formNo']).empty()
          let config = {
            headers: {
              groupId: state.initData['groupId']
            }
          }
          axios.get(url, config).then(function (response) {
            var serializable = response.data
            alapcaJSRei = eval('(' + serializable + ')')
            axios.get('/o/rest/v2/registrations/' + data['registrationId'] + '/forms/' + data['referenceUid'] + '/formdata', config).then(function (responseFormData) {
              alapcaJSRei['data'] = responseFormData.data
              if (data['addNew']) {
                alapcaJSRei['data']['dia_chi_chinh_doanh_nghiep'] = result.applicant['address']
                alapcaJSRei['data']['email_doanh_nghiep'] = result.applicant['contactEmail']
                alapcaJSRei['data']['ten_doanh_nghiep'] = result.applicant['applicantName']
                alapcaJSRei['data']['ma_so_doanh_nghiep'] = result.applicant['applicantIdNo']
                alapcaJSRei['data']['so_dien_thoai_doanh_nghiep'] = result.applicant['contactTelNo']
                alapcaJSRei['data']['nguoi_dai_dien_doanh_nghiep'] = result.applicant['contactName']
                alapcaJSRei['data']['chuc_danh_dai_dien_doanh_nghiep'] = result.applicant['representativeEnterprise']
              }
              window.$('#formPartNo' + data['formNo']).alpaca(alapcaJSRei)
              resolve(alapcaJSRei)
            }).catch(function (xhr) {
              reject(xhr)
            })
          }).catch(function (xhr) {
            reject(xhr)
          })
          /* eslint-disable */
        })
      })
    },
    loadListForms ({commit, state}, data) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          var url = '/o/rest/v2/registrations/' + data['registrationId'] + '/forms'
          var configs = {
            headers: {
              groupId: state.initData['groupId']
            }
          }
          axios.get(url, configs).then(function (response) {
            var serializable = response.data
            var arrFormnotRemmove = []
            if (serializable.data) {
              for (var i = 0; i < serializable.data.length; i++) {
                if (!serializable.data[i].removed) {
                  arrFormnotRemmove.push(serializable.data[i])
                }
              }
            }
            let registForms = arrFormnotRemmove
            resolve(registForms)
          }).catch(function (error) {
            console.log(error)
            reject(error)
          })
        })
      })
    }
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setLoadingTable (state, payload) {
      state.loadingTable = payload
    },
    setLoadingSubmit (state, payload) {
      state.loadingSubmit = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setInitData (state, payload) {
      state.initData = payload
    },
    clearError (state) {
      state.error = null
    },
    setDocTypes (state, payload) {
      state.docTypes = payload
    },
    setRoleFilterStatus (state, payload) {
      state.roleFilterStatus = payload
    },
    setCssxModel (state, payload) {
      state.cssxModel = payload
    },
    setThongTinChung (state, payload) {
      window.sessionStorage.setItem('thongTinChung', JSON.stringify(payload))
      state.thongTinChung = payload
    },
    setThongTinXuong (state, payload) {
      window.sessionStorage.setItem('thongTinXuong', JSON.stringify(payload))
      state.thongTinXuong = payload
    },
    setThongTinDoanhNghiep (state, payload) {
      window.sessionStorage.setItem('thongTinDoanhNghiep', JSON.stringify(payload))
      state.thongTinDoanhNghiep = payload
    }
  },
  getters: {
    initData (state) {
      return state.initData
    },
    loading (state) {
      return state.loading
    },
    cssxModel (state) {
      return state.cssxModel
    },
    thongTinChung (state) {
      let thongTinChung = state.thongTinChung
      if (!thongTinChung || Object.keys(thongTinChung).length === 0 && thongTinChung.constructor === Object) {
        let item = window.sessionStorage.getItem('thongTinChung') || '{}'
        return JSON.parse(item) || {}
      } else {
        return thongTinChung
      }
    },
    thongTinXuong (state) {
      let thongTinXuong = state.thongTinXuong
      if (!thongTinXuong || Object.keys(thongTinXuong).length === 0 && thongTinXuong.constructor === Object) {
        let item = window.sessionStorage.getItem('thongTinXuong') || '{}'
        return JSON.parse(item) || {}
      } else {
        return thongTinXuong
      }
    },
    thongTinDoanhNghiep (state) {
      let thongTinDoanhNghiep = state.thongTinDoanhNghiep
      if (!thongTinDoanhNghiep || Object.keys(thongTinDoanhNghiep).length === 0 && thongTinDoanhNghiep.constructor === Object) {
        let item = window.sessionStorage.getItem('thongTinXuong') || '{}'
        return JSON.parse(item) || {}
      } else {
        return thongTinDoanhNghiep
      }
    },
    loadingInitData (state) {
      return new Promise((resolve, reject) => {
        store.dispatch('loadInitResource').then(function (result) {
          resolve(result)
        })
      })
    }
  }
})
