export default {
  generalBasic: () => {
    return {
      errno: 10000,
      data: {
        activity_new: 12,
        activity_all: 22,
        device_record: 44,
        activity_all_halfhour: 99
      }

    }
  },

  activeGeneral: () => {
    return {
      errno: 10000,
      data: {
        '0-1': {
          today: '1',
          yesterday: '11'
        },
        '1-2': {
          today: '22',
          yesterday: '33'
        }
      }
    }

  },
  bootupGeneral: () => {
    return {
      errno: 10000,
      data: {
        '0-1': {
          today: '44',
          yesterday: '22'
        },
        '1-2': {
          today: '89',
          yesterday: '46'
        }
      }
    }
  },
  activeCnt: () => {
    return {
      errno: 10000,
      data: {
        '20191006': {
          count: '45'
        },
        '20191007': {
          count: '78'
        }
      }
    }
  },
  activityTopModel: () => {
    return {
      errno: 10000,
      data: {
        '20191006': {
          'xinghao1': '45',
          'xinghao2': '34',
          'xinghao3': '78',
          'xinghao4': '89',
        },
        '20191007': {
          'xinghao1': '780',
          'xinghao2': '46',
          'xinghao3': '76',
          'xinghao4': '23',
        }
      }
    }
  },
  bootupCnt: () => {
    return {
      errno: 10000,
      data: {
        "20190509": {
          "count_bootup": "43",
          "count_mac": "28"
        },
        "20190510": {
          "count_bootup": "45",
          "count_mac": "13"
        },
        "20190513": {
          "count_bootup": "6",
          "count_mac": "8"
        },
        "20190514": {
          "count_bootup": "76",
          "count_mac": "11"
        },
        "20190515": {
          "count_bootup": "87",
          "count_mac": "15"
        }
      }
    }
  },
  bootupLong: () => {
    return {
      errno: 10000,
      data: {
        "20190509": {
          "time_sum": "28",
          "time_mac": "28"
        },
        "20190510": {
          "time_sum": "13",
          "time_mac": "13"
        },
        "20190513": {
          "time_sum": "8",
          "time_mac": "8"
        },
        "20190514": {
          "time_sum": "16",
          "time_mac": "11"
        },
        "20190515": {
          "time_sum": "15",
          "time_mac": "15"
        }
      }
    }
  }
}