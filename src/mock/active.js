// 通用数据 screeningCondition 内使用
export const getData = req => {
  return {
    "errno": 10000,
    "errmsg": "sucess",
    "data": {
      "model":[
        {
          "id":1,
          "name":"aaa",
        },
        {
          "id":2,
          "name":"bbb",
        }
      ],
      "group":[
        {
          "id":3,
          "name":"aaa",
        },
        {
          "id":4,
          "name":"bbb",
        }
      ],
      "osversion":[
        {
          "id":3,
          "name":"aaa",
        },
        {
          "id":4,
          "name":"bbb",
        }
      ],
      "district":[
        {
          "id":3,
          "name":"aaa",
        },
        {
          "id":4,
          "name":"bbb",
        }
      ],
      "app":[
        {
          "id":3,
          "name":"应用1",
        },
        {
          "id":4,
          "name":"应用2",
        }
      ]
    }
  }
}


// 数据激活
// 新增数据
export const activityNew = req => {
  return {
    "errno": 10000,
    "errmsg": "",
    "data": {
      "20190509": {
        "count": "28"
      },
      "20190510": {
        "count": "13"
      },
      "20190513": {
        "count": "8"
      },
      "20190514": {
        "count": "11"
      },
      "20190515": {
        "count": "15"
      }
    }
  }
}

// 累计数据
export const activityTotal = req => {
  return {
    "errno": 10000,
    "errmsg": "",
    "data": {
      "20190509": {
        "count": "22"
      },
      "20190510": {
        "count": "33"
      },
      "20190513": {
        "count": "44"
      },
      "20190514": {
        "count": "99"
      },
      "20190515": {
        "count": "11"
      }
    }
  }
}


// 活跃用户
export const activeUser = req => {
  return {
    "errno": 10000,
    "errmsg": "",
    "data": {
      "20190509": {
        "count": "22"
      },
      "20190510": {
        "count": "33"
      },
      "20190513": {
        "count": "44"
      },
      "20190514": {
        "count": "99"
      },
      "20190515": {
        "count": "11"
      }
    }
  }
}