export default {
  menus: [ // 菜单相关路由
    {
      key: 'sys',
      path: '/sys',
      title: '系统管理',
      subs: [{
        key: 'sys_role',
        path: '/sys/role',
        meta: {
          title: '角色管理',
        },
        component: 'RoleList'
      },
        {
          key: 'sys_user',
          path: '/sys/user',
          meta: {
            title: '用户管理',
          },
          component: 'userList'
        },
      ]
    },
    {
      key: 'home',
      path: '/home',
      meta: {
        title: '数据概览',
      },
      component: 'dataOverview'
    },
    {
      key: 'core_data',
      path: '/core_data',
      title: '核心数据',
      subs: [
        {
          key: 'core_data_boot',
          path: '/core_data/boot',
          meta: {
            title: '电视开机',
          },
          component: 'TVboot'
        },
        {
          key: 'core_data_active',
          path: '/core_data/active',
          meta: {
            title: '电视激活',
          },
          component: 'TVactive'
        },
        {
          key: 'core_data_use',
          path: '/core_data/use',
          meta: {
            title: '使用行为',
          },
          component: 'TVuse'
        },
        {
          key: 'core_data_os',
          path: '/core_data/os',
          meta: {
            title: '系统分析',
          },
          component: 'TVos'
        },
        {
          key: 'active_user',
            path: '/core_data/active_user',
          meta: {
          title: '活跃用户',
        },
          component: 'activeUser'
        }
      ]
    },
    {
      key: 'application_analysis',
      path: '/application_analysis',
      title: '应用分析',
      subs: [
        {
          key: 'application_startup',
          path: '/application_analysis/application_startup',
          meta: {
            title: '启动趋势',
          },
          component: 'applicationStartup'
        },
        {
          key: 'application_version',
          path: '/application_analysis/application_version',
          meta: {
            title: '应用版本',
          },
          component: 'applicationVersion'
        }
      ]
    },
    {
      key: 'launcher_data',
      path: '/launcher_data',
      title: 'TV桌面数据',
      subs: [
        {
          key: 'channel_access',
          path: '/launcher_data/channel_access',
          meta: {
            title: '频道访问'
          },
          component: 'channelAccess'
        },
        {
          key: 'channel_access_5s',
          path: '/launcher_data/channel_access_5s',
          meta: {
            title: '5s停留频道访问'
          },
          component: 'channelAccess5s'
        },
        {
          key: 'topic_detail',
          path: '/launcher_data/topic_detail',
          meta: {
            title: '专题详情'
          },
          component: 'topicDetail'
        },
        {
          key: 'resource_click',
          path: '/launcher_data/resource_click',
          meta: {
            title: '资源点击'
          },
          component: 'resourceClick'
        },
        {
          key: 'dropdown_page',
          path: '/launcher_data/dropdown_page',
          meta: {
            title: '下拉页面'
          },
          component: 'dropdownPage'
        }
      ]
    },
    {
      key: 'launcher_bx',
      path: '/launcher_bx',
      title: '冰箱数据',
      subs: [
        {
          key: 'active_device',
          path: '/launcher_bx/active_device',
          meta: {
            title: '活跃设备'
          },
          component: 'activeDevice'
        },
        {
          key: 'active_bx',
          path: '/launcher_bx/active_bx',
          meta: {
            title: '冰箱激活'
          },
          component: 'activeBx'
        },
        {
          key: 'app_startup',
          path: '/launcher_bx/app_startup',
          meta: {
            title: '应用启动'
          },
          component: 'appStartup'
        },
        // {
        //   key: 'launcher_bx',
        //   path: '/launcher_bx/launcher_bx',
        //   meta: {
        //     title: '桌面管理'
        //   },
        //   component: 'launcherBx'
        // }
      ]
    }
  ],
  // 非菜单相关路由
  others: [{
    key: 'sys_role',
    path: '/sys/role/add/:id',
    meta: {
      title: '新增角色',
      lightMenu: '/sys/role'  // 需要点亮图标的路径（这里当访问本页面时，tag点亮的是角色管理）
    },
    component: 'RoleAdd'
  }]
}