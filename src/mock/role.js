// 获取角色列表
export const getRoleList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 1,
      'list': [
        {'id': 1, 'name': '管理员', menu: ['role_management']},
        {'id': 2, 'name': 'aaa', menu: ['user_management']},
        {'id': 3, 'name': 'bbb'},
        {'id': 4, 'name': 'ccc'},
        {'id': 5, 'name': 'ddd'}
      ]
    }
  }
}

// 创建角色
export const createRole = req => {
  const data = req.body
  console.log(data)
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 角色权限
export const detailRole = req => {
  const data = req.body
  console.log(data)
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': 1,
      'name': '管理员1',
      'menu': [
        'role_management',
        'user_management'
      ],
      user: [
        {
          id: '1',
          username: '用户姓名',
          email: '333@gome.com.cn'
        }
      ]
    }
  }
}

// 修改角色
export const updateRole = req => {
  const data = req.body
  console.log(data)
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 删除角色
export const deleteRole = req => {
  const data = req.body
  console.log(data)
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}

// 获取用户列表
export const getUserList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 100,
      'page': 1,
      'page_size': 20,
      'list': [
        {
          'id': 1,
          'username': '张三',
          'email': 'aaa@qq.com',
          'is_inactivity': 0
        },
        {
          'id': 1,
          'username': '李四',
          'email': 'bbb@qq.com',
          'is_inactivity': 0
        },
        {
          'id': 1,
          'username': '王五',
          'email': 'ccc@qq.com',
          'is_inactivity': 0
        }
      ]
    }
  }
}

// 获取用户信息
export const getUserDetail = req => {
  const data = JSON.parse(req.body)
  console.log(data)
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': 1,
      'username': '张三',
      'email': 'aaa@qq.com',
      'is_inactivity': 1,
      'role': [
        {'id': 1, 'name': '管理员'},
        {'id': 2, 'name': '管xxx'},
        {'id': 3, 'name': '管理bb'}
      ]
    }
  }
}

// 保存用户权限
export const saveUser = req => {
  const data = req.body
  console.log(data)
  return {
    'errno': 10000,
    'errmsg': 'success'
  }
}
