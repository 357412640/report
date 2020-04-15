// 通用接口页面内使用
export const getData = req => {
  return {
    "errno": 10000,
    "errmsg": "sucess",
    "data": {
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

// 启动排名
export const startupCount = req => {
  return {
    "errno": 10000,
    "errmsg": "",
    "data": {
      "应用1": {
        "count_mac": "28",
      },
      "应用2": {
        "count_mac": "13",
      },
      "应用3": {
        "count_mac": "8",
      },
      "应用4": {
        "count_mac": "16",
      },
      "应用5": {
        "count_mac": "15",
      }
    }
  }
}


// 启动趋势
export const startupTrend = req => {
  return {
    "errno": 10000,
    "errmsg": "success",
    "data": {
      "showapp": [
        "com.gtv.launcher",
        "com.gitvguomei.video",
        "com.gtv.tvsource",
        "com.gtv.settings",
        "com.gtv.screensaver"
      ],
      "data": {
        "2019-10-16": {
          "android": {
            "count": "9",
            "count_mac": "3"
          },
          "cn.cibntv.ott": {
            "count": "3",
            "count_mac": "3"
          },
          "cn.cntvnews.tv": {
            "count": "8",
            "count_mac": "3"
          },
          "com.android.packageinstaller": {
            "count": "46",
            "count_mac": "20"
          },
          "com.android.tv.settings": {
            "count": "4",
            "count_mac": "1"
          },
          "com.baidu.rootv": {
            "count": "11",
            "count_mac": "6"
          },
          "com.bestv.ott": {
            "count": "1",
            "count_mac": "1"
          },
          "com.booslink.Wihome_videoplayer3": {
            "count": "2",
            "count_mac": "1"
          },
          "com.cibn.tv": {
            "count": "24",
            "count_mac": "12"
          },
          "com.cmhi.softmbh": {
            "count": "13",
            "count_mac": "1"
          },
          "com.dangbei.tvlauncher": {
            "count": "6",
            "count_mac": "1"
          },
          "com.dangbei.zhushou.gome": {
            "count": "25",
            "count_mac": "19"
          },
          "com.dangbeimarket": {
            "count": "2",
            "count_mac": "2"
          },
          "com.dianshijia.newlive": {
            "count": "23",
            "count_mac": "8"
          },
          "com.droidlogic.tvinput": {
            "count": "415",
            "count_mac": "93"
          },
          "com.elinkway.tvlive2": {
            "count": "10",
            "count_mac": "3"
          },
          "com.gitv.tv.launcher": {
            "count": "1",
            "count_mac": "1"
          },
          "com.gitvdemo.video": {
            "count": "4",
            "count_mac": "3"
          },
          "com.gitvguomei.video": {
            "count": "2423",
            "count_mac": "492"
          },
          "com.gome.dangbeimarket": {
            "count": "62",
            "count_mac": "32"
          },
          "com.gotokeep.androidtv": {
            "count": "3",
            "count_mac": "1"
          },
          "com.gtv.account": {
            "count": "22",
            "count_mac": "13"
          },
          "com.gtv.captiveportal": {
            "count": "4",
            "count_mac": "4"
          },
          "com.gtv.factorytest": {
            "count": "134",
            "count_mac": "31"
          },
          "com.gtv.filemanager": {
            "count": "218",
            "count_mac": "41"
          },
          "com.gtv.gallery3d": {
            "count": "46",
            "count_mac": "14"
          },
          "com.gtv.internalbrowser": {
            "count": "3",
            "count_mac": "1"
          },
          "com.gtv.launcher": {
            "count": "5276",
            "count_mac": "916"
          },
          "com.gtv.provision": {
            "count": "99",
            "count_mac": "29"
          },
          "com.gtv.screensaver": {
            "count": "440",
            "count_mac": "255"
          },
          "com.gtv.settings": {
            "count": "415",
            "count_mac": "129"
          },
          "com.gtv.systemupgrade": {
            "count": "28",
            "count_mac": "16"
          },
          "com.gtv.tvsource": {
            "count": "1707",
            "count_mac": "461"
          },
          "com.gtv.videoplayer": {
            "count": "73",
            "count_mac": "22"
          },
          "com.gtv.voice": {
            "count": "53",
            "count_mac": "6"
          },
          "com.happy.wonderland": {
            "count": "4",
            "count_mac": "2"
          },
          "com.hihex.game.plane.android": {
            "count": "2",
            "count_mac": "1"
          },
          "com.hpplay.happyplay.aw": {
            "count": "57",
            "count_mac": "29"
          },
          "com.ixigua.android.tv.wasu": {
            "count": "6",
            "count_mac": "2"
          },
          "com.jason.test.bletest": {
            "count": "10",
            "count_mac": "1"
          },
          "com.ktcp.svideo": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ktcp.video": {
            "count": "162",
            "count_mac": "72"
          },
          "com.kugou.android.tv": {
            "count": "2",
            "count_mac": "2"
          },
          "com.ljsy.tvgo": {
            "count": "4",
            "count_mac": "2"
          },
          "com.moretv.android": {
            "count": "3",
            "count_mac": "1"
          },
          "com.qclive.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.rainbow.Master": {
            "count": "1",
            "count_mac": "1"
          },
          "com.shafa.market": {
            "count": "3",
            "count_mac": "1"
          },
          "com.smart.gome.fortv": {
            "count": "38",
            "count_mac": "20"
          },
          "com.starcor.mango": {
            "count": "26",
            "count_mac": "11"
          },
          "com.syntc.snake": {
            "count": "1",
            "count_mac": "1"
          },
          "com.tencent.qqmusictv": {
            "count": "65",
            "count_mac": "30"
          },
          "com.vcinema.client.tv": {
            "count": "2",
            "count_mac": "2"
          },
          "com.viewkingdom.freak": {
            "count": "1",
            "count_mac": "1"
          },
          "com.xiaodianshi.tv.yst": {
            "count": "88",
            "count_mac": "46"
          },
          "com.zylp.sports": {
            "count": "1",
            "count_mac": "1"
          },
          "hdpfans.com": {
            "count": "7",
            "count_mac": "4"
          },
          "net.cibntv.ott.sk": {
            "count": "1",
            "count_mac": "1"
          },
          "net.myvst.v2": {
            "count": "3",
            "count_mac": "2"
          },
          "tv.fun.orange": {
            "count": "1",
            "count_mac": "1"
          }
        },
        "2019-10-17": {
          "android": {
            "count": "11",
            "count_mac": "4"
          },
          "axp.tool.apkextractor": {
            "count": "3",
            "count_mac": "2"
          },
          "cn.cntvnews.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "cn.jj.tv": {
            "count": "6",
            "count_mac": "1"
          },
          "com.android.packageinstaller": {
            "count": "24",
            "count_mac": "15"
          },
          "com.android.settings": {
            "count": "18",
            "count_mac": "1"
          },
          "com.android.tv.settings": {
            "count": "7",
            "count_mac": "2"
          },
          "com.baidu.rootv": {
            "count": "2",
            "count_mac": "2"
          },
          "com.bestv.ott": {
            "count": "1",
            "count_mac": "1"
          },
          "com.booslink.Wihome_videoplayer3": {
            "count": "4",
            "count_mac": "1"
          },
          "com.cibn.tv": {
            "count": "22",
            "count_mac": "11"
          },
          "com.cloudmedia.videoplayer": {
            "count": "1",
            "count_mac": "1"
          },
          "com.cmhi.softmbh": {
            "count": "1",
            "count_mac": "1"
          },
          "com.dangbei.tvlauncher": {
            "count": "4",
            "count_mac": "1"
          },
          "com.dangbei.zhushou.gome": {
            "count": "21",
            "count_mac": "18"
          },
          "com.dangbeimarket": {
            "count": "15",
            "count_mac": "8"
          },
          "com.dianshijia.newlive": {
            "count": "10",
            "count_mac": "5"
          },
          "com.droidlogic.tvinput": {
            "count": "403",
            "count_mac": "100"
          },
          "com.duowan.kiwitv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.elinkway.tvlive2": {
            "count": "3",
            "count_mac": "2"
          },
          "com.gitvdemo.video": {
            "count": "2",
            "count_mac": "2"
          },
          "com.gitvguomei.video": {
            "count": "2189",
            "count_mac": "491"
          },
          "com.gome.dangbeimarket": {
            "count": "61",
            "count_mac": "38"
          },
          "com.gtv.account": {
            "count": "18",
            "count_mac": "9"
          },
          "com.gtv.captiveportal": {
            "count": "4",
            "count_mac": "2"
          },
          "com.gtv.factorytest": {
            "count": "131",
            "count_mac": "40"
          },
          "com.gtv.filemanager": {
            "count": "199",
            "count_mac": "47"
          },
          "com.gtv.gallery3d": {
            "count": "36",
            "count_mac": "19"
          },
          "com.gtv.internalbrowser": {
            "count": "3",
            "count_mac": "2"
          },
          "com.gtv.launcher": {
            "count": "4908",
            "count_mac": "928"
          },
          "com.gtv.provision": {
            "count": "125",
            "count_mac": "33"
          },
          "com.gtv.screensaver": {
            "count": "429",
            "count_mac": "275"
          },
          "com.gtv.settings": {
            "count": "361",
            "count_mac": "129"
          },
          "com.gtv.systemupgrade": {
            "count": "42",
            "count_mac": "15"
          },
          "com.gtv.tvsource": {
            "count": "1692",
            "count_mac": "461"
          },
          "com.gtv.videoplayer": {
            "count": "107",
            "count_mac": "31"
          },
          "com.gtv.voice": {
            "count": "21",
            "count_mac": "8"
          },
          "com.happy.wonderland": {
            "count": "2",
            "count_mac": "2"
          },
          "com.hpplay.happyplay.aw": {
            "count": "51",
            "count_mac": "31"
          },
          "com.ixigua.android.tv.wasu": {
            "count": "3",
            "count_mac": "2"
          },
          "com.jason.test.bletest": {
            "count": "24",
            "count_mac": "1"
          },
          "com.jiajia.v6.gome": {
            "count": "2",
            "count_mac": "2"
          },
          "com.ktcp.svideo": {
            "count": "2",
            "count_mac": "1"
          },
          "com.ktcp.video": {
            "count": "163",
            "count_mac": "82"
          },
          "com.kugou.android.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.ljsy.tvgo": {
            "count": "6",
            "count_mac": "3"
          },
          "com.lutongnet.kalaok2": {
            "count": "1",
            "count_mac": "1"
          },
          "com.qclive.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.smart.gome.fortv": {
            "count": "48",
            "count_mac": "26"
          },
          "com.starcor.mango": {
            "count": "11",
            "count_mac": "8"
          },
          "com.tencent.qqmusictv": {
            "count": "63",
            "count_mac": "27"
          },
          "com.vcinema.client.tv": {
            "count": "3",
            "count_mac": "2"
          },
          "com.viewkingdom.freak": {
            "count": "2",
            "count_mac": "1"
          },
          "com.xiaodianshi.tv.yst": {
            "count": "108",
            "count_mac": "60"
          },
          "hdpfans.com": {
            "count": "6",
            "count_mac": "4"
          },
          "tv.fun.orange": {
            "count": "2",
            "count_mac": "1"
          }
        },
        "2019-10-18": {
          "air.ocean.BattlePlaneApp": {
            "count": "2",
            "count_mac": "2"
          },
          "android": {
            "count": "4",
            "count_mac": "3"
          },
          "cn.cntvnews.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "cn.jj.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "cn.kuwo.music.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "cn.vmatrices.settings": {
            "count": "1",
            "count_mac": "1"
          },
          "com.android.packageinstaller": {
            "count": "56",
            "count_mac": "31"
          },
          "com.apowersoft.mirror.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.baidu.rootv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.bestv.ott": {
            "count": "1",
            "count_mac": "1"
          },
          "com.booslink.Wihome_videoplayer3": {
            "count": "1",
            "count_mac": "1"
          },
          "com.cibn.tv": {
            "count": "40",
            "count_mac": "20"
          },
          "com.cloudmedia.videoplayer": {
            "count": "2",
            "count_mac": "1"
          },
          "com.cmgame.gamehalltv": {
            "count": "3",
            "count_mac": "1"
          },
          "com.cmhi.softmbh": {
            "count": "8",
            "count_mac": "1"
          },
          "com.dancetv.bokecc.sqaredancetv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.dangbei.tvlauncher": {
            "count": "2",
            "count_mac": "1"
          },
          "com.dangbei.zhushou.gome": {
            "count": "21",
            "count_mac": "12"
          },
          "com.dangbeimarket": {
            "count": "10",
            "count_mac": "7"
          },
          "com.dianshijia.newlive": {
            "count": "16",
            "count_mac": "6"
          },
          "com.droidlogic.tvinput": {
            "count": "365",
            "count_mac": "104"
          },
          "com.duowan.kiwitv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.elinkway.tvlive2": {
            "count": "4",
            "count_mac": "2"
          },
          "com.gitvdemo.video": {
            "count": "2",
            "count_mac": "2"
          },
          "com.gitvguomei.video": {
            "count": "2485",
            "count_mac": "514"
          },
          "com.gome.dangbeimarket": {
            "count": "116",
            "count_mac": "54"
          },
          "com.gtv.account": {
            "count": "31",
            "count_mac": "16"
          },
          "com.gtv.captiveportal": {
            "count": "8",
            "count_mac": "4"
          },
          "com.gtv.cmcall": {
            "count": "1",
            "count_mac": "1"
          },
          "com.gtv.factorytest": {
            "count": "86",
            "count_mac": "27"
          },
          "com.gtv.filemanager": {
            "count": "188",
            "count_mac": "41"
          },
          "com.gtv.gallery3d": {
            "count": "27",
            "count_mac": "10"
          },
          "com.gtv.internalbrowser": {
            "count": "5",
            "count_mac": "3"
          },
          "com.gtv.launcher": {
            "count": "5538",
            "count_mac": "950"
          },
          "com.gtv.provision": {
            "count": "100",
            "count_mac": "31"
          },
          "com.gtv.screensaver": {
            "count": "479",
            "count_mac": "295"
          },
          "com.gtv.settings": {
            "count": "331",
            "count_mac": "117"
          },
          "com.gtv.systemupgrade": {
            "count": "32",
            "count_mac": "17"
          },
          "com.gtv.tvsource": {
            "count": "1726",
            "count_mac": "487"
          },
          "com.gtv.videoplayer": {
            "count": "83",
            "count_mac": "22"
          },
          "com.gtv.voice": {
            "count": "15",
            "count_mac": "8"
          },
          "com.hpplay.happyplay.aw": {
            "count": "100",
            "count_mac": "30"
          },
          "com.ixigua.android.tv.wasu": {
            "count": "9",
            "count_mac": "4"
          },
          "com.jason.test.bletest": {
            "count": "1",
            "count_mac": "1"
          },
          "com.jiajia.v6.gome": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ktcp.svideo": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ktcp.video": {
            "count": "200",
            "count_mac": "103"
          },
          "com.kuaiyouxi.psp.lzzzwdh2": {
            "count": "1",
            "count_mac": "1"
          },
          "com.kugou.android.tv": {
            "count": "7",
            "count_mac": "4"
          },
          "com.kuyun.game": {
            "count": "2",
            "count_mac": "1"
          },
          "com.lab.mythlauncher.dbqzm": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ljsy.tvgo": {
            "count": "13",
            "count_mac": "5"
          },
          "com.putaolab.emu.qilongzhugedou2": {
            "count": "1",
            "count_mac": "1"
          },
          "com.qclive.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.qiang.nes.renzhelongjianzhuan3": {
            "count": "2",
            "count_mac": "1"
          },
          "com.rainbow.Master": {
            "count": "1",
            "count_mac": "1"
          },
          "com.smart.gome.fortv": {
            "count": "42",
            "count_mac": "30"
          },
          "com.sohuott.tv.vod": {
            "count": "2",
            "count_mac": "1"
          },
          "com.starcor.mango": {
            "count": "27",
            "count_mac": "11"
          },
          "com.tencent.karaoketv": {
            "count": "4",
            "count_mac": "2"
          },
          "com.tencent.qqmusictv": {
            "count": "64",
            "count_mac": "29"
          },
          "com.tv.kuaisou": {
            "count": "1",
            "count_mac": "1"
          },
          "com.utv.android": {
            "count": "2",
            "count_mac": "1"
          },
          "com.vcinema.client.tv": {
            "count": "3",
            "count_mac": "2"
          },
          "com.viewkingdom.freak": {
            "count": "3",
            "count_mac": "1"
          },
          "com.xiaodianshi.tv.yst": {
            "count": "129",
            "count_mac": "72"
          },
          "com.xy51.jjdg": {
            "count": "1",
            "count_mac": "1"
          },
          "com.yingzheng.jlkt3.wocheng": {
            "count": "1",
            "count_mac": "1"
          },
          "com.yodo1tier1.skizgfTV.cmcc": {
            "count": "1",
            "count_mac": "1"
          },
          "com.youloft.calendar.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.yqmb.qlz.yyw": {
            "count": "1",
            "count_mac": "1"
          },
          "hdpfans.com": {
            "count": "6",
            "count_mac": "2"
          },
          "org.fengye.kjys": {
            "count": "1",
            "count_mac": "1"
          },
          "race.mobile.main": {
            "count": "1",
            "count_mac": "1"
          },
          "sina.mobile.tianqitongtv": {
            "count": "1",
            "count_mac": "1"
          },
          "tv.fun.orange": {
            "count": "3",
            "count_mac": "1"
          },
          "tv.qiaqia.dancing": {
            "count": "1",
            "count_mac": "1"
          },
          "tv.yusi.free.xiaotang2": {
            "count": "1",
            "count_mac": "1"
          },
          "zj.hz.hzylfw": {
            "count": "29",
            "count_mac": "1"
          }
        },
        "2019-10-19": {
          "air.ocean.BattlePlaneApp": {
            "count": "4",
            "count_mac": "2"
          },
          "cn.cibntv.ott": {
            "count": "5",
            "count_mac": "5"
          },
          "cn.jj.tv": {
            "count": "8",
            "count_mac": "2"
          },
          "cn.kuwo.sing.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.android.packageinstaller": {
            "count": "75",
            "count_mac": "30"
          },
          "com.audiocn.kalaok.tv.k71": {
            "count": "1",
            "count_mac": "1"
          },
          "com.baidu.rootv": {
            "count": "3",
            "count_mac": "2"
          },
          "com.booslink.Wihome_videoplayer3": {
            "count": "1",
            "count_mac": "1"
          },
          "com.cctv.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.cibn.tv": {
            "count": "58",
            "count_mac": "24"
          },
          "com.cloudmedia.videoplayer": {
            "count": "4",
            "count_mac": "1"
          },
          "com.cmgame.gamehalltv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.dangbei.tvlauncher": {
            "count": "6",
            "count_mac": "1"
          },
          "com.dangbei.yoga": {
            "count": "1",
            "count_mac": "1"
          },
          "com.dangbei.zhushou.gome": {
            "count": "32",
            "count_mac": "21"
          },
          "com.dangbeimarket": {
            "count": "20",
            "count_mac": "5"
          },
          "com.dbtvgame.zu_zhi_na_ge_qiu": {
            "count": "2",
            "count_mac": "1"
          },
          "com.dianshijia.newlive": {
            "count": "32",
            "count_mac": "11"
          },
          "com.dlgames.ds": {
            "count": "4",
            "count_mac": "1"
          },
          "com.douyu.xl.douyutv": {
            "count": "4",
            "count_mac": "1"
          },
          "com.droidlogic.tvinput": {
            "count": "416",
            "count_mac": "107"
          },
          "com.duowan.kiwitv": {
            "count": "2",
            "count_mac": "2"
          },
          "com.edufound.ott": {
            "count": "1",
            "count_mac": "1"
          },
          "com.elinkway.tvlive2": {
            "count": "9",
            "count_mac": "3"
          },
          "com.eXiin.AfterLoop": {
            "count": "6",
            "count_mac": "1"
          },
          "com.gala.smallapk.p111826101": {
            "count": "2",
            "count_mac": "1"
          },
          "com.gitvdemo.video": {
            "count": "9",
            "count_mac": "3"
          },
          "com.gitvguomei.video": {
            "count": "2935",
            "count_mac": "565"
          },
          "com.gome.dangbeimarket": {
            "count": "134",
            "count_mac": "64"
          },
          "com.gtv.account": {
            "count": "36",
            "count_mac": "20"
          },
          "com.gtv.captiveportal": {
            "count": "8",
            "count_mac": "3"
          },
          "com.gtv.factorytest": {
            "count": "93",
            "count_mac": "30"
          },
          "com.gtv.filemanager": {
            "count": "188",
            "count_mac": "46"
          },
          "com.gtv.gallery3d": {
            "count": "22",
            "count_mac": "17"
          },
          "com.gtv.internalbrowser": {
            "count": "5",
            "count_mac": "3"
          },
          "com.gtv.launcher": {
            "count": "6443",
            "count_mac": "1015"
          },
          "com.gtv.provision": {
            "count": "110",
            "count_mac": "32"
          },
          "com.gtv.screensaver": {
            "count": "544",
            "count_mac": "311"
          },
          "com.gtv.settings": {
            "count": "352",
            "count_mac": "147"
          },
          "com.gtv.systemupgrade": {
            "count": "21",
            "count_mac": "13"
          },
          "com.gtv.tvsource": {
            "count": "1941",
            "count_mac": "516"
          },
          "com.gtv.videoplayer": {
            "count": "102",
            "count_mac": "29"
          },
          "com.gtv.voice": {
            "count": "11",
            "count_mac": "3"
          },
          "com.happy.wonderland": {
            "count": "1",
            "count_mac": "1"
          },
          "com.hpplay.happyplay.aw": {
            "count": "94",
            "count_mac": "44"
          },
          "com.ifacetv.browser": {
            "count": "3",
            "count_mac": "1"
          },
          "com.ixigua.android.tv.wasu": {
            "count": "19",
            "count_mac": "4"
          },
          "com.jiajia.v6.gome": {
            "count": "2",
            "count_mac": "1"
          },
          "com.ktcp.svideo": {
            "count": "3",
            "count_mac": "2"
          },
          "com.ktcp.video": {
            "count": "216",
            "count_mac": "102"
          },
          "com.kugou.android.tv": {
            "count": "11",
            "count_mac": "4"
          },
          "com.ljsy.tvgo": {
            "count": "13",
            "count_mac": "4"
          },
          "com.lswuyou.tv.pm": {
            "count": "1",
            "count_mac": "1"
          },
          "com.lutongnet.kalaok2": {
            "count": "1",
            "count_mac": "1"
          },
          "com.mirageengine.tv.xxtbkt.bsdb": {
            "count": "2",
            "count_mac": "2"
          },
          "com.monster.tvfm": {
            "count": "1",
            "count_mac": "1"
          },
          "com.qclive.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.rainbow.Master": {
            "count": "1",
            "count_mac": "1"
          },
          "com.smart.gome.fortv": {
            "count": "56",
            "count_mac": "39"
          },
          "com.sohuott.tv.vod": {
            "count": "2",
            "count_mac": "1"
          },
          "com.starcor.mango": {
            "count": "29",
            "count_mac": "12"
          },
          "com.syntc.snake": {
            "count": "1",
            "count_mac": "1"
          },
          "com.tencent.game.rhythmmaster": {
            "count": "3",
            "count_mac": "1"
          },
          "com.tencent.qqmusictv": {
            "count": "57",
            "count_mac": "26"
          },
          "com.tv.kuaisou": {
            "count": "2",
            "count_mac": "1"
          },
          "com.utv.android": {
            "count": "3",
            "count_mac": "3"
          },
          "com.vcinema.client.tv": {
            "count": "10",
            "count_mac": "5"
          },
          "com.viewkingdom.freak": {
            "count": "4",
            "count_mac": "1"
          },
          "com.vst.live": {
            "count": "2",
            "count_mac": "1"
          },
          "com.xiaodianshi.tv.yst": {
            "count": "140",
            "count_mac": "90"
          },
          "com.xuetangx.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.xy51.jjdg": {
            "count": "4",
            "count_mac": "1"
          },
          "com.yodo1tier1.skizgfTV.cmcc": {
            "count": "1",
            "count_mac": "1"
          },
          "com.yougu.minifight.dbTV": {
            "count": "1",
            "count_mac": "1"
          },
          "com.yuanju.comicsisland.tv": {
            "count": "3",
            "count_mac": "1"
          },
          "eu.dreamup.racingultimatefree": {
            "count": "15",
            "count_mac": "1"
          },
          "hdpfans.com": {
            "count": "5",
            "count_mac": "5"
          },
          "org.fengye.kjys": {
            "count": "2",
            "count_mac": "1"
          },
          "rca.rc.tvtaobao": {
            "count": "4",
            "count_mac": "2"
          },
          "tv.fun.orange": {
            "count": "2",
            "count_mac": "1"
          },
          "zj.hz.hzylfw": {
            "count": "15",
            "count_mac": "1"
          }
        },
        "2019-10-20": {
          "air.ocean.BattlePlaneApp": {
            "count": "1",
            "count_mac": "1"
          },
          "android": {
            "count": "1",
            "count_mac": "1"
          },
          "cn.cibntv.ott": {
            "count": "3",
            "count_mac": "3"
          },
          "cn.jj.tv": {
            "count": "9",
            "count_mac": "4"
          },
          "cn.kuwo.sing.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "cn.vszone.sf2ce": {
            "count": "2",
            "count_mac": "1"
          },
          "com.android.bluetooth": {
            "count": "1",
            "count_mac": "1"
          },
          "com.android.packageinstaller": {
            "count": "68",
            "count_mac": "33"
          },
          "com.audiocn.kalaok.tv.k71": {
            "count": "3",
            "count_mac": "1"
          },
          "com.baidu.rootv": {
            "count": "2",
            "count_mac": "2"
          },
          "com.bestv.ott": {
            "count": "1",
            "count_mac": "1"
          },
          "com.booslink.Wihome_videoplayer3": {
            "count": "3",
            "count_mac": "1"
          },
          "com.cctv.tv": {
            "count": "5",
            "count_mac": "2"
          },
          "com.cibn.tv": {
            "count": "55",
            "count_mac": "21"
          },
          "com.cloudmedia.videoplayer": {
            "count": "2",
            "count_mac": "1"
          },
          "com.cmgame.gamehalltv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.dangbei.tvlauncher": {
            "count": "3",
            "count_mac": "1"
          },
          "com.dangbei.zhushou.gome": {
            "count": "31",
            "count_mac": "21"
          },
          "com.dangbeimarket": {
            "count": "8",
            "count_mac": "5"
          },
          "com.dianshijia.newlive": {
            "count": "19",
            "count_mac": "7"
          },
          "com.dlgames.ds": {
            "count": "8",
            "count_mac": "2"
          },
          "com.droidlogic.tvinput": {
            "count": "551",
            "count_mac": "133"
          },
          "com.elinkway.tvlive2": {
            "count": "14",
            "count_mac": "2"
          },
          "com.gala.smallapk.p111826101": {
            "count": "1",
            "count_mac": "1"
          },
          "com.gameloft.android.AMAZ.GloftASAS": {
            "count": "1",
            "count_mac": "1"
          },
          "com.gitvdemo.video": {
            "count": "2",
            "count_mac": "2"
          },
          "com.gitvguomei.video": {
            "count": "2800",
            "count_mac": "567"
          },
          "com.gome.dangbeimarket": {
            "count": "197",
            "count_mac": "67"
          },
          "com.gtv.account": {
            "count": "12",
            "count_mac": "9"
          },
          "com.gtv.captiveportal": {
            "count": "7",
            "count_mac": "5"
          },
          "com.gtv.factorytest": {
            "count": "152",
            "count_mac": "46"
          },
          "com.gtv.filemanager": {
            "count": "133",
            "count_mac": "48"
          },
          "com.gtv.gallery3d": {
            "count": "20",
            "count_mac": "14"
          },
          "com.gtv.internalbrowser": {
            "count": "2",
            "count_mac": "1"
          },
          "com.gtv.launcher": {
            "count": "6321",
            "count_mac": "1050"
          },
          "com.gtv.provision": {
            "count": "195",
            "count_mac": "48"
          },
          "com.gtv.screensaver": {
            "count": "471",
            "count_mac": "306"
          },
          "com.gtv.settings": {
            "count": "385",
            "count_mac": "164"
          },
          "com.gtv.systemupgrade": {
            "count": "16",
            "count_mac": "15"
          },
          "com.gtv.tvsource": {
            "count": "2176",
            "count_mac": "561"
          },
          "com.gtv.videoplayer": {
            "count": "57",
            "count_mac": "27"
          },
          "com.gtv.voice": {
            "count": "9",
            "count_mac": "5"
          },
          "com.happy.wonderland": {
            "count": "3",
            "count_mac": "3"
          },
          "com.hisense.hicloud.edca": {
            "count": "1",
            "count_mac": "1"
          },
          "com.holyblade.gbtg.game": {
            "count": "1",
            "count_mac": "1"
          },
          "com.hpplay.happyplay.aw": {
            "count": "90",
            "count_mac": "39"
          },
          "com.ifacetv.browser": {
            "count": "7",
            "count_mac": "1"
          },
          "com.initialage.edu": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ixigua.android.tv.wasu": {
            "count": "18",
            "count_mac": "6"
          },
          "com.jiajia.v6.gome": {
            "count": "2",
            "count_mac": "2"
          },
          "com.ktcp.svideo": {
            "count": "5",
            "count_mac": "2"
          },
          "com.ktcp.video": {
            "count": "211",
            "count_mac": "106"
          },
          "com.kugou.android.tv": {
            "count": "8",
            "count_mac": "4"
          },
          "com.ljsy.tvgo": {
            "count": "11",
            "count_mac": "5"
          },
          "com.lutongnet.kalaok2": {
            "count": "1",
            "count_mac": "1"
          },
          "com.meiriq.game.androidtv.jumpingmario": {
            "count": "6",
            "count_mac": "2"
          },
          "com.mogoomobile.MotorTV.dangbei": {
            "count": "1",
            "count_mac": "1"
          },
          "com.monster.tvfm": {
            "count": "1",
            "count_mac": "1"
          },
          "com.mx.browser": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ottoojala.wrestlejumpfree": {
            "count": "2",
            "count_mac": "1"
          },
          "com.qclive.tv": {
            "count": "6",
            "count_mac": "1"
          },
          "com.qiang.nes.chaojimali": {
            "count": "1",
            "count_mac": "1"
          },
          "com.rainbow.Master": {
            "count": "2",
            "count_mac": "1"
          },
          "com.seleuco.kof97": {
            "count": "2",
            "count_mac": "1"
          },
          "com.sinyee.babybus.drinks.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.sinyee.babybus.shopping.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.slanissue.tv.erge": {
            "count": "1",
            "count_mac": "1"
          },
          "com.smart.gome.fortv": {
            "count": "45",
            "count_mac": "35"
          },
          "com.sohuott.tv.vod": {
            "count": "2",
            "count_mac": "2"
          },
          "com.starcor.mango": {
            "count": "25",
            "count_mac": "16"
          },
          "com.suning.tv.ebuy": {
            "count": "4",
            "count_mac": "1"
          },
          "com.sxiaoao.car3d2": {
            "count": "2",
            "count_mac": "1"
          },
          "com.tencent.karaoketv": {
            "count": "2",
            "count_mac": "2"
          },
          "com.tencent.qqmusictv": {
            "count": "84",
            "count_mac": "34"
          },
          "com.tianyi.sjkj.game.cfhxtj": {
            "count": "2",
            "count_mac": "1"
          },
          "com.tv.kuaisou": {
            "count": "1",
            "count_mac": "1"
          },
          "com.vcinema.client.tv": {
            "count": "5",
            "count_mac": "5"
          },
          "com.viewkingdom.freak": {
            "count": "3",
            "count_mac": "1"
          },
          "com.xiaodianshi.tv.yst": {
            "count": "149",
            "count_mac": "87"
          },
          "com.xinli001.fm.xiaomi": {
            "count": "1",
            "count_mac": "1"
          },
          "com.xxx.mame.kof97": {
            "count": "2",
            "count_mac": "1"
          },
          "com.yodo1tier1.skizgfTV.cmcc": {
            "count": "7",
            "count_mac": "2"
          },
          "gameengine.jvhe.unifyplatform.ndk.stg2tv": {
            "count": "4",
            "count_mac": "1"
          },
          "hdpfans.com": {
            "count": "7",
            "count_mac": "3"
          },
          "jd.video.basecomponent": {
            "count": "1",
            "count_mac": "1"
          },
          "net.myvst.v2": {
            "count": "4",
            "count_mac": "3"
          },
          "org.fengye.kjys": {
            "count": "3",
            "count_mac": "1"
          },
          "rca.rc.tvtaobao": {
            "count": "2",
            "count_mac": "1"
          },
          "zj.hz.hzylfw": {
            "count": "17",
            "count_mac": "1"
          }
        },
        "2019-10-21": {
          "air.ocean.BattlePlaneApp": {
            "count": "3",
            "count_mac": "1"
          },
          "android": {
            "count": "7",
            "count_mac": "4"
          },
          "cn.cibntv.ott": {
            "count": "3",
            "count_mac": "3"
          },
          "cn.jj.tv": {
            "count": "7",
            "count_mac": "3"
          },
          "com.android.packageinstaller": {
            "count": "64",
            "count_mac": "26"
          },
          "com.baxa.fctank": {
            "count": "1",
            "count_mac": "1"
          },
          "com.bestv.ott": {
            "count": "1",
            "count_mac": "1"
          },
          "com.booslink.Wihome_videoplayer3": {
            "count": "2",
            "count_mac": "1"
          },
          "com.cibn.tv": {
            "count": "23",
            "count_mac": "15"
          },
          "com.cmhi.softmbh": {
            "count": "1",
            "count_mac": "1"
          },
          "com.dangbei.tvlauncher": {
            "count": "3",
            "count_mac": "1"
          },
          "com.dangbei.zhushou.gome": {
            "count": "32",
            "count_mac": "21"
          },
          "com.dangbeimarket": {
            "count": "9",
            "count_mac": "2"
          },
          "com.dbtvgame.duo_mao_mao": {
            "count": "1",
            "count_mac": "1"
          },
          "com.dianshijia.newlive": {
            "count": "12",
            "count_mac": "5"
          },
          "com.dlgames.ds": {
            "count": "7",
            "count_mac": "2"
          },
          "com.droidlogic.tvinput": {
            "count": "408",
            "count_mac": "92"
          },
          "com.duoduo.opreatv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ecloud.eshare": {
            "count": "1",
            "count_mac": "1"
          },
          "com.elinkway.tvlive2": {
            "count": "7",
            "count_mac": "2"
          },
          "com.gitvdemo.video": {
            "count": "2",
            "count_mac": "1"
          },
          "com.gitvguomei.video": {
            "count": "2156",
            "count_mac": "521"
          },
          "com.gome.dangbeimarket": {
            "count": "94",
            "count_mac": "43"
          },
          "com.gtv.account": {
            "count": "18",
            "count_mac": "13"
          },
          "com.gtv.captiveportal": {
            "count": "12",
            "count_mac": "7"
          },
          "com.gtv.cmcall": {
            "count": "1",
            "count_mac": "1"
          },
          "com.gtv.factorytest": {
            "count": "120",
            "count_mac": "28"
          },
          "com.gtv.filemanager": {
            "count": "308",
            "count_mac": "45"
          },
          "com.gtv.gallery3d": {
            "count": "37",
            "count_mac": "15"
          },
          "com.gtv.internalbrowser": {
            "count": "3",
            "count_mac": "2"
          },
          "com.gtv.launcher": {
            "count": "5474",
            "count_mac": "978"
          },
          "com.gtv.provision": {
            "count": "179",
            "count_mac": "30"
          },
          "com.gtv.screensaver": {
            "count": "482",
            "count_mac": "285"
          },
          "com.gtv.settings": {
            "count": "501",
            "count_mac": "109"
          },
          "com.gtv.systemupgrade": {
            "count": "49",
            "count_mac": "18"
          },
          "com.gtv.tvsource": {
            "count": "1878",
            "count_mac": "509"
          },
          "com.gtv.videoplayer": {
            "count": "196",
            "count_mac": "23"
          },
          "com.gtv.voice": {
            "count": "2",
            "count_mac": "2"
          },
          "com.gugugame.gugu": {
            "count": "5",
            "count_mac": "1"
          },
          "com.happy.wonderland": {
            "count": "1",
            "count_mac": "1"
          },
          "com.holyblade.zhuzhuxia.game": {
            "count": "1",
            "count_mac": "1"
          },
          "com.hpplay.happyplay.aw": {
            "count": "117",
            "count_mac": "37"
          },
          "com.hpplay.happyplay.ent": {
            "count": "6",
            "count_mac": "1"
          },
          "com.ifacetv.browser": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ixigua.android.tv.wasu": {
            "count": "5",
            "count_mac": "2"
          },
          "com.ixoyo.anying.JFYJ": {
            "count": "1",
            "count_mac": "1"
          },
          "com.jiajia.v6.gome": {
            "count": "2",
            "count_mac": "2"
          },
          "com.joym.Warriortv.db": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ktcp.svideo": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ktcp.video": {
            "count": "175",
            "count_mac": "94"
          },
          "com.kugou.android.tv": {
            "count": "4",
            "count_mac": "4"
          },
          "com.ljsy.tvgo": {
            "count": "12",
            "count_mac": "2"
          },
          "com.moretv.android": {
            "count": "1",
            "count_mac": "1"
          },
          "com.pplive.androidxl": {
            "count": "1",
            "count_mac": "1"
          },
          "com.qclive.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.rainbow.Master": {
            "count": "4",
            "count_mac": "2"
          },
          "com.smart.gome.fortv": {
            "count": "44",
            "count_mac": "24"
          },
          "com.sohuott.tv.vod": {
            "count": "1",
            "count_mac": "1"
          },
          "com.starcor.mango": {
            "count": "27",
            "count_mac": "13"
          },
          "com.suning.tv.ebuy": {
            "count": "3",
            "count_mac": "1"
          },
          "com.tencent.karaoketv": {
            "count": "5",
            "count_mac": "1"
          },
          "com.tencent.qqmusictv": {
            "count": "73",
            "count_mac": "30"
          },
          "com.turbonuke.rockvszombies": {
            "count": "4",
            "count_mac": "1"
          },
          "com.TV.A123qibu.chinese.sync19": {
            "count": "2",
            "count_mac": "1"
          },
          "com.utv.android": {
            "count": "2",
            "count_mac": "2"
          },
          "com.vcinema.client.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.viewkingdom.freak": {
            "count": "2",
            "count_mac": "1"
          },
          "com.waxrain.airplaydmr": {
            "count": "4",
            "count_mac": "1"
          },
          "com.xiaodianshi.tv.yst": {
            "count": "98",
            "count_mac": "60"
          },
          "com.xuetangx.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.yodo1tier1.skizgfTV.cmcc": {
            "count": "2",
            "count_mac": "1"
          },
          "hdpfans.com": {
            "count": "8",
            "count_mac": "2"
          },
          "jd.video.basecomponent": {
            "count": "1",
            "count_mac": "1"
          },
          "net.cibntv.ott.sk": {
            "count": "1",
            "count_mac": "1"
          },
          "net.ebh.dianhuatv": {
            "count": "4",
            "count_mac": "1"
          },
          "tv.fun.orange": {
            "count": "2",
            "count_mac": "1"
          }
        },
        "2019-10-22": {
          "android": {
            "count": "3",
            "count_mac": "3"
          },
          "cn.cibntv.ott": {
            "count": "6",
            "count_mac": "4"
          },
          "cn.cntvnews.tv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.android.packageinstaller": {
            "count": "47",
            "count_mac": "20"
          },
          "com.audiocn.kalaok.tv.k71": {
            "count": "1",
            "count_mac": "1"
          },
          "com.bestv.ott": {
            "count": "2",
            "count_mac": "1"
          },
          "com.cibn.tv": {
            "count": "33",
            "count_mac": "13"
          },
          "com.cloudmedia.videoplayer": {
            "count": "5",
            "count_mac": "2"
          },
          "com.cmhi.softmbh": {
            "count": "3",
            "count_mac": "1"
          },
          "com.dangbei.tvlauncher": {
            "count": "5",
            "count_mac": "1"
          },
          "com.dangbei.zhushou.gome": {
            "count": "38",
            "count_mac": "24"
          },
          "com.dangbeimarket": {
            "count": "14",
            "count_mac": "5"
          },
          "com.dianshijia.newlive": {
            "count": "14",
            "count_mac": "7"
          },
          "com.droidlogic.tvinput": {
            "count": "421",
            "count_mac": "100"
          },
          "com.elinkway.tvlive2": {
            "count": "3",
            "count_mac": "3"
          },
          "com.gitvguomei.video": {
            "count": "2472",
            "count_mac": "517"
          },
          "com.gogiigames.hauntedpastamzntv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.gome.dangbeimarket": {
            "count": "69",
            "count_mac": "39"
          },
          "com.gotokeep.androidtv": {
            "count": "1",
            "count_mac": "1"
          },
          "com.gtv.account": {
            "count": "16",
            "count_mac": "10"
          },
          "com.gtv.captiveportal": {
            "count": "6",
            "count_mac": "6"
          },
          "com.gtv.factorytest": {
            "count": "163",
            "count_mac": "47"
          },
          "com.gtv.filemanager": {
            "count": "213",
            "count_mac": "51"
          },
          "com.gtv.gallery3d": {
            "count": "37",
            "count_mac": "22"
          },
          "com.gtv.gome.andlink": {
            "count": "7",
            "count_mac": "2"
          },
          "com.gtv.internalbrowser": {
            "count": "5",
            "count_mac": "2"
          },
          "com.gtv.launcher": {
            "count": "5679",
            "count_mac": "1002"
          },
          "com.gtv.provision": {
            "count": "201",
            "count_mac": "40"
          },
          "com.gtv.screensaver": {
            "count": "476",
            "count_mac": "278"
          },
          "com.gtv.settings": {
            "count": "489",
            "count_mac": "139"
          },
          "com.gtv.systemupgrade": {
            "count": "33",
            "count_mac": "15"
          },
          "com.gtv.tvsource": {
            "count": "1938",
            "count_mac": "523"
          },
          "com.gtv.videoplayer": {
            "count": "91",
            "count_mac": "25"
          },
          "com.gtv.voice": {
            "count": "18",
            "count_mac": "9"
          },
          "com.hisense.hicloud.edca": {
            "count": "1",
            "count_mac": "1"
          },
          "com.holyblade.zhuzhuxia.game": {
            "count": "1",
            "count_mac": "1"
          },
          "com.hpplay.happyplay.aw": {
            "count": "85",
            "count_mac": "30"
          },
          "com.ifacetv.browser": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ixigua.android.tv.wasu": {
            "count": "4",
            "count_mac": "3"
          },
          "com.ktcp.svideo": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ktcp.video": {
            "count": "209",
            "count_mac": "99"
          },
          "com.kugou.android.tv": {
            "count": "3",
            "count_mac": "3"
          },
          "com.leadjoy.gun": {
            "count": "1",
            "count_mac": "1"
          },
          "com.ljsy.tvgo": {
            "count": "13",
            "count_mac": "3"
          },
          "com.lutongnet.kalaok2": {
            "count": "1",
            "count_mac": "1"
          },
          "com.meiriq.game.androidtv.jumpingmario": {
            "count": "1",
            "count_mac": "1"
          },
          "com.moretv.android": {
            "count": "1",
            "count_mac": "1"
          },
          "com.otvcloud.kdds": {
            "count": "4",
            "count_mac": "1"
          },
          "com.pplive.androidxl": {
            "count": "2",
            "count_mac": "1"
          },
          "com.qclive.tv": {
            "count": "2",
            "count_mac": "1"
          },
          "com.smart.gome.fortv": {
            "count": "41",
            "count_mac": "28"
          },
          "com.starcor.mango": {
            "count": "27",
            "count_mac": "9"
          },
          "com.studioonmars.cmswatfree": {
            "count": "2",
            "count_mac": "1"
          },
          "com.suning.tv.ebuy": {
            "count": "1",
            "count_mac": "1"
          },
          "com.tencent.karaoketv": {
            "count": "6",
            "count_mac": "2"
          },
          "com.tencent.qqmusictv": {
            "count": "54",
            "count_mac": "28"
          },
          "com.tv.kuaisou": {
            "count": "1",
            "count_mac": "1"
          },
          "com.utv.android": {
            "count": "1",
            "count_mac": "1"
          },
          "com.vcinema.client.tv": {
            "count": "3",
            "count_mac": "2"
          },
          "com.viewkingdom.freak": {
            "count": "1",
            "count_mac": "1"
          },
          "com.vst.live": {
            "count": "1",
            "count_mac": "1"
          },
          "com.wukongtv.wkhelper": {
            "count": "1",
            "count_mac": "1"
          },
          "com.xiaodianshi.tv.yst": {
            "count": "89",
            "count_mac": "58"
          },
          "com.yodo1tier1.skizgfTV.cmcc": {
            "count": "1",
            "count_mac": "1"
          },
          "eu.lostvision.tipp": {
            "count": "2",
            "count_mac": "1"
          },
          "hdpfans.com": {
            "count": "8",
            "count_mac": "4"
          },
          "net.cibntv.ott.sk": {
            "count": "2",
            "count_mac": "1"
          },
          "net.myvst.v2": {
            "count": "1",
            "count_mac": "1"
          },
          "rca.rc.tvtaobao": {
            "count": "1",
            "count_mac": "1"
          },
          "tv.fun.orange": {
            "count": "3",
            "count_mac": "1"
          },
          "zj.hz.hzylfw": {
            "count": "1",
            "count_mac": "1"
          }
        }
      }
    }
  }
}
