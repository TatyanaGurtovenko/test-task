<template>
  <div class="content">
    <div class="search-input">
      <img src="../assets/img/search.svg" alt="">
      <input type="text" placeholder="Поиск" v-model="searchQuery" @input="searchItem">
    </div>
    <div class="enrolled__table">
      <div class="mobile-sort">
        <select v-model="sortField" @change="sort(sortField)">
          <option value="" disabled selected>Сортировать по</option>
          <option v-for="item in headers" :value="item.sortBy">{{ item.title }}
          </option>
        </select>
        <div class="mobile-btns">
          <button @click.prevent="sortDirection = 'asc'" :class="{active: sortDirection === 'asc'}">
            <svg class="icon icon-arrow">
              <use xlink:href="../../src/assets/sprite.svg#arrow"></use>
            </svg>
          </button>
          <button @click.prevent="sortDirection = 'desc'" :class="{active: sortDirection === 'desc'}">
            <svg class="icon icon-arrow">
              <use xlink:href="../../src/assets/sprite.svg#arrow"></use>
            </svg>
          </button>
        </div>
      </div>
      <table>
        <thead>
        <tr>
          <th v-for="item in headers">
            <div @click="sort(item.sortBy)">
              {{ item.title }}
              <svg class="icon icon-arrow" :class="{bottom: sortField=== item.sortBy && sortDirection === 'asc'}">
                <use xlink:href="../../src/assets/sprite.svg#arrow"></use>
              </svg>
            </div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in sortedList">
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.date.slice(0, 10).split('-').reverse().join('.') }}
          </td>
          <td v-for="sub in item.subjects" class="score" :class="{
            'red': sub.score < 3,
            'yellow': sub.score >= 3 && sub.score < 4,
            'green': sub.score >= 4,
          }">
            {{ sub.score }}
          </td>
          <td class="score" :class="{
            'red': sumScores(item) < 7,
            'yellow': sumScores(item) >= 7 && sumScores(item) < 12,
            'green': sumScores(item) >= 12,
          }">
            {{ sumScores(item) }}
          </td>
          <td>
            <vc-donut
                background="#fff" foreground="#D5E7FF"
                :size="45" unit="px" :thickness="17"
                :total="100"
                :start-angle="0"
                :sections="[{ value: calcPercent(sumScores(item)), color: getColor(calcPercent(sumScores(item)))}]"
            >{{ calcPercent(sumScores(item)) }}%
            </vc-donut>
            <div class="mobile-percent">
              <span>{{ calcPercent(sumScores(item)) }}%</span>
              <div class="shell">
                <div class="bar"
                     :style="{ width: calcPercent(sumScores(item)) + '%', background: getColor(calcPercent(sumScores(item)))}">
                </div>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="searchMessage" v-if="searchMessage">Абитуриент не найден:(</div>
    </div>
  </div>
</template>

<script>

export default {
  props: ["data"],
  components: {},
  data() {
    return {
      searchQuery: '',
      sortField: 'name',
      sortDirection: 'asc',
      headers: [
        {
          title: 'ФИО',
          sortBy: 'name'
        },
        {
          title: 'Дата подачи заявления',
          sortBy: 'date'
        },
        {
          title: 'Балл по русскому',
          sortBy: 'scoreRu'
        },
        {
          title: 'Балл по математике',
          sortBy: 'scoreMath'
        },
        {
          title: 'Балл по информатике',
          sortBy: 'scoreInf'
        },
        {
          title: 'Суммарный балл',
          sortBy: 'sum'
        },
        {
          title: 'Процент',
          sortBy: 'percent'
        },
      ],
      sortedList: this.data.slice().sort((a, b) => a.name.localeCompare(b.name)),
      searchMessage: false
    }
  },
  created() {
    const savedState = localStorage.getItem('myApp');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.searchQuery = state.searchQuery;
      this.sortField = state.sortField;
      this.sortDirection = state.sortDirection;
    }
  },
  mounted() {
    this.$watch('searchQuery', this.saveState);
    this.$watch('sortField', this.saveState);
    this.$watch('sortDirection', this.saveState);
  },
  methods: {
    saveState() {
      const state = {
        searchQuery: this.searchQuery,
        sortField: this.sortField,
        sortDirection: this.sortDirection,
      };
      localStorage.setItem('myApp', JSON.stringify(state));
    },
    sumScores(student) {
      let total = 0;
      for (let i = 0; i < student.subjects.length; i++) {
        total += parseFloat(student.subjects[i].score);
      }
      return total;
    },
    calcPercent(sum) {
      return Math.round(sum / (15 / 100))
    },
    getColor(sum) {
      if (sum >= 75) {
        return '#01AA88'
      } else if (sum < 75 && sum > 50) {
        return '#FFA200'
      } else {
        return '#FF0000'
      }
    },
    sort(field) {
      if (field === this.sortField) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
      this.getSortedList()
    },
    searchItem() {
      let copyList = this.data.slice()
      let searchedList = this.sortedList
      if (this.searchQuery.trim() === '') {
        this.sortedList = copyList
      }
      if (this.sortedList.length === 0) {
        this.searchMessage = true
      }
      const queries = this.searchQuery.trim().toLowerCase().split(/\s+/)
      searchedList = this.sortedList.filter(result =>
          queries.every(query => result.name.toLowerCase().includes(query))
      )
      this.sortedList = searchedList
    },
    getSortedList() {
      if (this.sortField === 'name') {
        this.sortedList.sort((a, b) => {
          let comparison = a.name.localeCompare(b.name)
          return this.sortDirection === 'asc' ? comparison : -comparison
        })
      } else if (this.sortField === 'date') {
        this.sortedList.sort((a, b) => {
          let comparison = new Date(a.date) - new Date(b.date)
          return this.sortDirection === 'asc' ? comparison : -comparison
        })
      } else if (this.sortField === 'scoreRu') {
        this.sortedList.sort((a, b) => {
          let comparison = a.subjects[0].score - b.subjects[0].score
          return this.sortDirection === 'asc' ? comparison : -comparison
        })
      } else if (this.sortField === 'scoreMath') {
        this.sortedList.sort((a, b) => {
          let comparison = a.subjects[1].score - b.subjects[1].score
          return this.sortDirection === 'asc' ? comparison : -comparison
        })
      } else if (this.sortField === 'scoreInf') {
        this.sortedList.sort((a, b) => {
          let comparison = a.subjects[2].score - b.subjects[2].score
          return this.sortDirection === 'asc' ? comparison : -comparison
        })
      } else if (this.sortField === 'sum') {
        this.sortedList.sort((a, b) => {
          let comparison = this.sumScores(a) - this.sumScores(b)
          return this.sortDirection === 'asc' ? comparison : -comparison;
        })
      } else if (this.sortField === 'percent') {
        this.sortedList.sort((a, b) => {
          let comparison = this.sumScores(a) - this.sumScores(b)
          return this.sortDirection === 'asc' ? comparison : -comparison;
        })
      }
    },
  },
  watch: {
    sortDirection() {
      this.getSortedList()
    }
  },
}
</script>

<style lang="scss">

.mobile-percent {
  align-items: center;
  display: none;

  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 1;
    color: #1C1D1F;
    margin-right: 8px;
  }

  @media screen and (max-width: 700px) {
    display: flex;
  }
}

.shell {
  height: 4px;
  width: 117px;
  background: #D5E7FF;
}

.bar {
  height: 4px;
  width: 15px;
  border-radius: 9px;
}

.cdc-container {
  @media screen and (max-width: 700px) {
    display: none !important;
  }
}

.mobile-sort {
  align-items: center;
  margin-bottom: 8px;
  display: none;
  @media screen and (max-width: 700px) {
    display: flex;
  }

  select {
    width: 100%;
    margin-right: 12px;
    padding: 12px;
    border: 1px solid #D5E7FF;
    border-radius: 4px;

    &:focus-visible {
      outline: none;
      border: 1px solid #006CFE;
    }

    background-image: linear-gradient(45deg, transparent 50%, #006CFE 50%),
    linear-gradient(135deg, #006CFE 50%, transparent 50%);
    background-position: calc(100% - 20px) calc(1em + 4px),
    calc(100% - 15px) calc(1em + 4px),
    100% 0;
    background-size: 5px 5px,
    5px 5px,
    2.5em 2.5em;
    background-repeat: no-repeat;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
  }
}

.mobile-btns {
  display: flex;
  align-items: center;

  button {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #006CFE;
    border-radius: 2px;
    background: transparent;

    &.active {
      background: #006CFE;
      border: 1px solid #006CFE;

      svg {
        fill: #fff;
      }
    }

    &:first-child {
      transform: rotate(180deg);
      margin-right: 4px;
    }

    svg {
      height: 30%;
      width: 30%;
    }
  }
}

.enrolled__table {
  @media screen and (max-width: 1900px) {
    overflow-x: scroll;
  }

  table {
    width: 1250px;
    min-width: 100%;
    @media screen and (max-width: 700px) {
      overflow-x: hidden;
      min-width: 100%;
      width: auto;
      thead {
        display: none;
      }
      td {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }

    th, td {
      text-align: left;
    }

    th {
      padding: 10px 0;
      cursor: pointer;
    }

    th {
      font-weight: 700;
      font-size: 12px;
      line-height: 1;
      color: #006CFE;
      transition: 0.2s;

      .icon-arrow {
        margin-left: 4px;
      }

      &:hover {
        color: #004199;

        .icon-arrow {
          fill: #004199;
        }
      }
    }

    td {
      background: #FFFFFF;
      border-right: 1px solid #D5E7FF;
      padding: 10px 20px;
      transition: 0.2s;
      @media screen and (max-width: 700px) {
        border-bottom: 1px solid #D5E7FF;
        border-right: none;
      }
    }

    tr {
      @media screen and (max-width: 700px) {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 8px;
      }
    }

    tr:hover {
      td {
        background: #EDF5FF;
      }

      @media screen and (max-width: 700px) {
        td {
          background: #fff;
        }
      }
    }
  }
}

.icon-arrow {
  fill: #006CFE;
  stroke-width: 2px;
  height: 11px;
  width: 10px;
  transition: 0.2s;

  &.bottom {
    transform: rotate(180deg);
  }
}

table th {
  div {
    display: flex;
    align-items: center;
  }
}

table td {
  &:before {
    font-weight: 700;
    font-size: 12px;
    color: #8D9FB7;
    display: none;
    @media screen and (max-width: 700px) {
      display: block;
    }
  }

  &:nth-child(1) {
    &:before {
      content: 'ФИО'
    }
  }

  &:nth-child(2) {
    &:before {
      content: 'Дата подачи заявления'
    }
  }

  &:nth-child(3) {
    &:before {
      content: 'Балл по русскому'
    }
  }

  &:nth-child(4) {
    &:before {
      content: 'Балл по математике'
    }
  }

  &:nth-child(5) {
    &:before {
      content: 'Балл по информатике'
    }
  }

  &:nth-child(6) {
    &:before {
      content: 'Суммарный балл'
    }
  }

  &:nth-child(7) {
    &:before {
      content: 'Процент'
    }
  }
}

.searchMessage {
  color: #006CFE;
  margin-top: 20px;
  font-size: 23px;
}

.search-input {
  max-width: 100%;
  margin-bottom: 20px;
  border: 1px solid #D5E7FF;
  border-radius: 4px;
  transition: 0.2s;
  background: #fff;
  padding: 16px;
  display: flex;
  align-items: center;

  img {
    margin-right: 8px;
  }

  &:hover {
    border: 1px solid #80B6FF;
  }

  input {
    width: 100%;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #1C1D1F;
    box-sizing: border-box;
    border: none;
    background: transparent;

    &:focus-visible {
      outline: none;
    }

    &::placeholder {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      color: #8D9FB7;
    }
  }
}

.cdc-text {
  font-size: 14px !important;
  color: #1C1D1F !important;
}

.score {
  font-weight: 700;
  font-size: 14px;
}

.red {
  color: #FF0000;
}

.yellow {
  color: #FFA200;
}

.green {
  color: #01AA88;
}

</style>
