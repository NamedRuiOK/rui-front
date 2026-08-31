<template>
  <section class="dashboard-panel calendar-panel">
    <div class="panel-heading">
      <h2>日历</h2>
      <button class="text-button" type="button">查看详情 <span aria-hidden="true">›</span></button>
    </div>

    <div class="calendar-toolbar">
      <button
        class="calendar-nav"
        type="button"
        title="上个月"
        aria-label="上个月"
        @click="changeMonth(-1)"
      >
        ‹
      </button>
      <p class="calendar-month">{{ monthLabel }}</p>
      <button
        class="calendar-nav"
        type="button"
        title="下个月"
        aria-label="下个月"
        @click="changeMonth(1)"
      >
        ›
      </button>
    </div>

    <div class="calendar-grid" role="grid" :aria-label="monthLabel">
      <span
        v-for="weekday in weekdays"
        :key="weekday"
        class="calendar-weekday"
        role="columnheader"
      >
        {{ weekday }}
      </span>
      <span
        v-for="day in calendarDays"
        :key="day.key"
        class="calendar-day"
        :class="{ 'is-muted': day.isMuted, 'is-selected': day.isToday }"
        role="gridcell"
        :aria-current="day.isToday ? 'date' : undefined"
      >
        {{ day.date }}
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CalendarPanel',
  data () {
    const today = new Date()

    return {
      weekdays: ['一', '二', '三', '四', '五', '六', '日'],
      visibleDate: new Date(today.getFullYear(), today.getMonth(), 1),
      today
    }
  },
  computed: {
    monthLabel () {
      return `${this.visibleDate.getFullYear()}年${this.visibleDate.getMonth() + 1}月`
    },
    calendarDays () {
      const year = this.visibleDate.getFullYear()
      const month = this.visibleDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const firstWeekday = (firstDay.getDay() + 6) % 7
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const daysInPreviousMonth = new Date(year, month, 0).getDate()
      const days = []

      for (let index = firstWeekday; index > 0; index -= 1) {
        const date = daysInPreviousMonth - index + 1
        days.push(this.createDay(year, month - 1, date, true))
      }

      for (let date = 1; date <= daysInMonth; date += 1) {
        days.push(this.createDay(year, month, date, false))
      }

      let nextMonthDate = 1
      while (days.length % 7 !== 0) {
        days.push(this.createDay(year, month + 1, nextMonthDate, true))
        nextMonthDate += 1
      }

      return days
    }
  },
  methods: {
    createDay (year, month, date, isMuted) {
      const dayDate = new Date(year, month, date)
      const isToday = !isMuted && this.isSameDate(dayDate, this.today)

      return {
        key: `${dayDate.getFullYear()}-${dayDate.getMonth()}-${dayDate.getDate()}`,
        date: dayDate.getDate(),
        isMuted,
        isToday
      }
    },
    isSameDate (left, right) {
      return left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth() &&
        left.getDate() === right.getDate()
    },
    changeMonth (offset) {
      this.visibleDate = new Date(
        this.visibleDate.getFullYear(),
        this.visibleDate.getMonth() + offset,
        1
      )
    }
  }
}
</script>

<style scoped>
.dashboard-panel {
  border: 1px solid rgba(107, 143, 177, 0.1);
  border-radius: 7px;
  background: #0e1c2c;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.calendar-panel {
  display: flex;
  flex-direction: column;
  min-height: 304px;
  padding: 17px 15px 13px;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 29px;
}

.panel-heading h2 {
  margin: 0;
  color: #ebf3fb;
  font-size: 14px;
  font-weight: 700;
}

.text-button {
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #7d96ae;
  cursor: pointer;
  font-size: 10px;
}

.text-button:hover {
  color: #b6d6f4;
}

.calendar-toolbar {
  display: grid;
  grid-template-columns: 25px 1fr 25px;
  align-items: center;
  gap: 8px;
  margin: 12px 0 10px;
}

.calendar-nav {
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 50%;
  background: transparent;
  color: #7d95ab;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
}

.calendar-nav:hover {
  background: rgba(70, 112, 158, 0.18);
  color: #ffffff;
}

.calendar-month {
  margin: 0;
  color: #d7e5f1;
  font-size: 10px;
  text-align: center;
}

.calendar-grid {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(7, 1fr);
  align-content: space-between;
  row-gap: 4px;
  border-top: 1px solid rgba(117, 149, 178, 0.12);
  padding-top: 8px;
  text-align: center;
}

.calendar-weekday {
  color: #7d95ab;
  font-size: 9px;
}

.calendar-day {
  display: grid;
  width: 25px;
  height: 25px;
  margin: auto;
  place-items: center;
  border-radius: 50%;
  color: #c4d3e0;
  font-size: 9px;
}

.calendar-day.is-muted {
  color: #52687d;
}

.calendar-day.is-selected {
  background: #2778dd;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(39, 120, 221, 0.3);
}

@media (max-width: 1100px) {
  .calendar-panel {
    min-height: 164px;
  }
}
</style>
