export default {
  bootUp: () => {
    return {
      "errno": 10000,
      "errmsg": "",
      "data": {
        "20190509": {
          "count_bootup": "28",
          "count_mac": "28"
        },
        "20190510": {
          "count_bootup": "13",
          "count_mac": "13"
        },
        "20190513": {
          "count_bootup": "8",
          "count_mac": "8"
        },
        "20190514": {
          "count_bootup": "16",
          "count_mac": "11"
        },
        "20190515": {
          "count_bootup": "15",
          "count_mac": "15"
        }
      }
    }
  },
  bootLong: () => {
    return {
      "errno": 10000,
      "errmsg": "",
      "data": {
        "20190509": {
          "time_mac": "28",
          "time_sum": "28",
        },
        "20190510": {
          "time_mac": "20",
          "time_sum": "13",
        },
        "20190513": {
          "time_mac": "8",
          "time_sum": "8",
        },
        "20190514": {
          "time_mac": "16",
          "time_sum": "16",
        },
        "20190515": {
          "time_mac": "15",
          "time_sum": "1",
        }
      }
    }
  },
  bootTime: () => {
    return {
      "errno": 10000,
      "errmsg": "",
      "data": {
        "20190509": {
          "count_mac": "28",
        },
        "20190510": {
          "count_mac": "13",
        },
        "20190513": {
          "count_mac": "50",
        },
        "20190514": {
          "count_mac": "16",
        },
        "20190515": {
          "count_mac": "15",
        }
      }
    }
  }
}