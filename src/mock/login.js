export const login = req => {
  return {
    'errno': 10000,
    'errmsg': '登陆成功'
  }
}

export const getUserInfo = req => {
  return {
    'errno': 10000,
    'errmsg': '',
    'data': {
      'id': 1,
      'username': '张三',
      'email': 'aaa@qq.com',
      'is_inactivity': 0,
      'is_admin': 1,
      'menu': [
        'home',
        'application_version'
      ]
    }
  }
}

export const logout = req => {
  return null
}
