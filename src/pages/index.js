import Home from './home';
import Layout from './layout';
import Login from './login';
import {Page404, Page401} from './err-page';
import {RoleAdd, RoleList, userList} from './sys-management';
import {TVboot, TVactive, TVos, TVuse, activeUser} from './core-data-management';
import {applicationStartup, applicationVersion} from './application-analysis';
import {dataOverview} from './data-overview'
import {resourceClick, channelAccess, channelAccess5s, topicDetail, dropdownPage} from './launcher-data'
import {activeDevice, activeBx, appStartup, launcherBx} from "./launcher-bx";

export {
  Home,
  Layout,
  Login,
  Page404,
  Page401,
  RoleAdd,
  RoleList,
  userList,
  TVboot,
  TVactive,
  applicationStartup,
  applicationVersion,
  TVos,
  TVuse,
  dataOverview,
  activeUser,
  resourceClick,
  topicDetail,
  channelAccess,
  channelAccess5s,
  dropdownPage,
  activeDevice,
  activeBx,
  appStartup,
  launcherBx
};
