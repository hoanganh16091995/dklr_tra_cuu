<template>
    <div class="input-group date" style="position: relative;">
      <masked-input v-model="value" mask="11/11/1111 11:11" @change="handlerChange()" @keyupenter="handlerKeyUpEnter()" @input="selectStringToDate(value)" />
      <v-icon size="16" v-if="clearable && value" @click="clearDate"
        style="
            position: absolute;
            right: 27px !important;
            top: 3px !important;
            font-size: 20px !important;
            cursor: pointer;
      ">clear</v-icon>
      <v-menu
        :close-on-content-click="false"
        transition="slide-y-transition"
        bottom
        left
        nudge-top="-20"
        v-model="menuDate"
        >
        <v-icon size="16" slot="activator" @click="toggleDisplay"
        style="
            position: absolute;
            right: 24px !important;
            top: 3px !important;
            font-size: 18px !important;
            cursor: pointer;
        ">event</v-icon>
        <v-card>
          <div class="bootstrap-datetimepicker-widget-2 dropdown-menu">
            <ul style="padding: 0px;z-index: 20;">
                <li>
                    <div class="datepicker">
                        <div class="datepicker-days">
                            <table class="table-condensed">
                                <thead>
                                <tr>
                                    <th class="prev" @click.stop="goPrev" @keydown.left="goPrev">&#8249;</th>
                                    <th colspan="5" class="text-center">{{ getTitle(currentMonth) }}</th>
                                    <th class="next" @click.stop="goNext" @keydown.right="goNext">›</th>
                                </tr>
                                <tr>
                                    <th class="dow"
                                        v-for="(dayIndex, index) in 7" v-bind:key="index">
                                        {{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(week, index) in weeks" v-bind:key="index">
                                    <td v-for="(day, indexDay) in week" v-bind:key="indexDay"
                                        :class="['day',
                                            day.isSelected? 'active': null,
                                            day.isToday? 'today': null,
                                            !day.isCurrentMonth? 'not-present': null]"
                                        @click="selectDate(day.date)"
                                    >{{ (showDst && day.date.isDST()?'*':'') + day.date.format('D') }}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="timepicker">
                        <div class="timepicker-picker">
                            <table class="table-condensed">
                                <tbody>
                                <tr>
                                    <td v-if="showHours">
                                        <a href="#" class="btn" @click.prevent="incrementHours">&#x25B2;</a>
                                    </td>
                                    <td v-if="showHours" class="separator"></td>
                                    <td v-if="showMinutes">
                                        <a href="#" class="btn" @click.prevent="incrementMinutes">&#x25B2;</a>
                                    </td>
                                    <td v-if="showSeconds" class="separator"></td>
                                    <td v-if="showSeconds">
                                        <a href="#" class="btn" @click.prevent="incrementSeconds">&#x25B2;</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td v-if="showHours">
                                      <v-menu open-on-hover top offset-y>
                                        <span class="timepicker-hour" slot="activator">{{' '+selectedDateTimeObject.format('HH')}} : giờ</span>
                                        <v-list>
                                          <v-list-tile v-for="n in 24" :key="n" @click.prevent="selectChangeHours(n)">
                                            <v-list-tile-title>{{ n }} : giờ</v-list-tile-title>
                                          </v-list-tile>
                                        </v-list>
                                      </v-menu>
                                    </td>
                                    <td v-if="showHours" class="separator">:</td>
                                    <td v-if="showMinutes">
                                      <v-menu open-on-hover top offset-y>
                                        <span class="timepicker-minute" slot="activator">{{' '+selectedDateTimeObject.format('mm')}} : phút</span>
                                        <v-list>
                                          <v-list-tile v-for="n in minuteArray" :key="n" @click.prevent="selectChangeMinutes(n)">
                                            <v-list-tile-title>{{ n }} : phút</v-list-tile-title>
                                          </v-list-tile>
                                        </v-list>
                                      </v-menu>
                                    </td>
                                    <td v-if="showSeconds" class="separator">:</td>
                                    <td v-if="showSeconds">
                                        <span class="timepicker-second">Sec:{{' '+selectedDateTimeObject.format('ss')}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td v-if="showHours">
                                        <a href="#" class="btn" @click.prevent="decrementHours">&#x25BC;</a>
                                    </td>
                                    <td v-if="showHours" @click.prevent="selectDateOK()" class="separator red--text text--darken-3" style="cursor: pointer;">Ok</td>
                                    <td v-if="showMinutes">
                                        <a href="#" class="btn" @click.prevent="decrementMinutes">&#x25BC;</a>
                                    </td>
                                    <td v-if="showSeconds" class="separator"></td>
                                    <td v-if="showSeconds">
                                        <a href="#" class="btn" @click.prevent="decrementSeconds">&#x25BC;</a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        </v-card>
      </v-menu>
    </div>
</template>

<script>
  import moment from 'moment'
  import vuemaskedinput from 'vue-masked-input'
  export default {
    components: {
      'masked-input': vuemaskedinput
    },
    data () {
      return {
        menuDate: false,
        originalValue: '',
        showMyself: false,
        currentMonth: moment().startOf('month'),
        selectedDateTimeObject: moment(),
        closePicker: 0,
        minuteArray: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
      }
    },
    props: [
      'value',
      'firstDay',
      'showDst',
      'showHours',
      'hourStep',
      'showMinutes',
      'minuteStep',
      'showSeconds',
      'secondStep',
      'clearable'
    ],
    mounted () {
      this.selectedDateTimeObject = moment(this.value)
      this.currentMonth = moment(this.selectedDateTimeObject).startOf('month')
      this.originalValue = (this.value)
    },
    computed: {
      weeks () {
        let me = this
        let monthMomentObject = this.getMonthViewStartDate(this.currentMonth, this.firstDay)
        let numberOfWeeks = 5
        let weeks = []
        let lastMonth = moment(monthMomentObject)
        let daysFromLastMonth = lastMonth.daysInMonth() - lastMonth.locale('vi').format('D') + 1
        let daysInCurrentMonth = lastMonth.add(1, 'month').daysInMonth()
        let diff = daysFromLastMonth + daysInCurrentMonth - 35
        if (diff === 1 || diff === 2) {
          numberOfWeeks = 6
        }
        for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
          weeks.push(me.getWeekObject(monthMomentObject))
        }
        return weeks
      },
      locale: function () {
        return (typeof i18n !== 'undefined') ? 'vi' : 'vi'
      }
    },
    methods: {
      pickerDataMouse (state) {
        let vm = this
        vm.closePicker = state
        setTimeout(() => {
          if (vm.closePicker === 0) {
            vm.showMyself = false
          }
        }, 200)
      },
      getMonthViewStartDate (date, firstDay) {
        firstDay = parseInt(firstDay)
        let start = moment(date)
        let startOfMonth = moment(start.startOf('month'))
        start.subtract(startOfMonth.day(), 'days')
        if (startOfMonth.day() < firstDay) {
          start.subtract(7, 'days')
        }
        start.add(firstDay, 'days')
        return start
      },
      getDayObject (monthMomentObject, dayIndex) {
        return {
          isToday: monthMomentObject.isSame(moment(), 'day'),
          isSelected: monthMomentObject.isSame(this.selectedDateTimeObject, 'day'),
          isPastDay: monthMomentObject.isBefore(moment(), 'day'),
          isCurrentMonth: monthMomentObject.isSame(this.currentMonth, 'month'),
          weekDay: dayIndex,
          isWeekEnd: (dayIndex === 5 || dayIndex === 6),
          date: moment(monthMomentObject)
        }
      },
      getWeekObject (monthMomentObject) {
        let week = []
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          week.push(this.getDayObject(monthMomentObject, dayIndex))
          monthMomentObject.add(1, 'day')
        }
        return week
      },
      getTitle (momentObject) {
        if (!momentObject) return
        return momentObject.locale(this.locale).format('MMMM YYYY')
      },
      selectStringToDate (value) {
        if (value !== null && value !== undefined && value !== '' && value.indexOf('_') === -1) {
          this.selectedDateTimeObject = moment(this.value, 'DD/MM/YYYY HH:mm')
          this.currentMonth = this.selectedDateTimeObject
          this.$emit('input', this.selectedDateTimeObject.locale('vi').format('DD/MM/YYYY HH:mm'))
        } else if (value === null || value === '') {
          this.$emit('input', '')
        }
      },
      handlerKeyUpEnter (value) {
        this.$emit('keyupenter', '')
      },
      handlerChange (value) {
        this.$emit('change', '')
      },
      selectDate (date) {
        this.selectedDateTimeObject = date.hours(this.selectedDateTimeObject.hours())
          .minutes(this.selectedDateTimeObject.minutes())
          .seconds(this.selectedDateTimeObject.seconds())
        this.currentMonth = this.selectedDateTimeObject
        this.$emit('input', this.selectedDateTimeObject.locale('vi').format('DD/MM/YYYY HH:mm'))
        if (!this.showHours && !this.showMinutes) {
          this.$emit('change-value', this.selectedDateTimeObject.locale('vi').format('DD/MM/YYYY HH:mm'))
        }
      },

      goPrev () {
        this.currentMonth = moment(this.currentMonth).subtract(1, 'months')
          .hours(this.selectedDateTimeObject.hours())
          .minutes(this.selectedDateTimeObject.minutes())
          .seconds(this.selectedDateTimeObject.seconds())
      },
      goNext () {
        this.currentMonth = moment(this.currentMonth).add(1, 'months')
          .hours(this.selectedDateTimeObject.hours())
          .minutes(this.selectedDateTimeObject.minutes())
          .seconds(this.selectedDateTimeObject.seconds())
      },
      goToday () {
        this.currentMonth = moment()
      },
      selectChangeHours (n) {
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).set({h: n})
        this.selectDate(this.selectedDateTimeObject)
      },
      selectChangeMinutes (n) {
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).set({m: n})
        this.selectDate(this.selectedDateTimeObject)
      },
      incrementHours () {
        let step = this.hourStep ? this.hourStep : 1
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).add(step, 'hours')
        this.selectDate(this.selectedDateTimeObject)
      },
      decrementHours () {
        let step = this.hourStep ? this.hourStep : 1
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).subtract(step, 'hours')
        this.selectDate(this.selectedDateTimeObject)
      },
      incrementMinutes () {
        let step = this.minuteStep ? this.minuteStep : 1
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).add(step, 'minutes')
        this.selectDate(this.selectedDateTimeObject)
      },
      decrementMinutes () {
        let step = this.minuteStep ? this.minuteStep : 1
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).subtract(step, 'minutes')
        this.selectDate(this.selectedDateTimeObject)
      },
      incrementSeconds () {
        let step = this.secondStep ? this.secondStep : 1
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).add(step, 'seconds')
        this.selectDate(this.selectedDateTimeObject)
      },
      decrementSeconds () {
        let step = this.secondStep ? this.secondStep : 1
        this.selectedDateTimeObject = moment(this.selectedDateTimeObject).subtract(step, 'seconds')
        this.selectDate(this.selectedDateTimeObject)
      },
      reset () {
        this.$emit('input', this.value)
        this.showMyself = false
      },
      hideMenu () {
        this.showMyself = false
      },
      toggleDisplay () {
        // console.log('cccc')
        // this.menuDate = !this.menuDate
        if (this.value === null || this.value === '') {
          this.selectedDateTimeObject = moment()
          this.currentMonth = moment(this.selectedDateTimeObject).startOf('month')
          this.originalValue = (moment().locale('vi').format('DD/MM/YYYY HH:mm'))
        } else {
          this.selectedDateTimeObject = moment(this.value, 'DD/MM/YYYY HH:mm')
          this.currentMonth = moment(this.selectedDateTimeObject).startOf('month')
          this.originalValue = (moment(this.value, 'DD/MM/YYYY HH:mm').locale('vi').format('DD/MM/YYYY HH:mm'))
        }
        this.showMyself = !this.showMyself
      },
      selectDateOK () {
        var vm = this
        vm.showMyself = false
        vm.menuDate = !vm.menuDate
        vm.$emit('change-value', '')
      },
      clearDate: function () {
        var vm = this
        vm.value = ''
        vm.$emit('input', '')
        vm.$emit('clearDate', '')
      }
    },
    filters: {
      localeWeekDay (weekday, firstDay, locale) {
        firstDay = parseInt(firstDay)
        let localMoment = moment().locale(locale)
        return localMoment.localeData().weekdaysMin()[(weekday + firstDay) % 7]
      }
    }
  }
</script>
