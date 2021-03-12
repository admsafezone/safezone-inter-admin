import { ElementType } from 'react';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import ActivityList from 'pages/Activity/List';
import CompanyList from '../pages/Company/List';
import Dashboard from '../pages/Dashboard';
import ProfileManager from 'pages/Profile/Manager';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import UserList from 'pages/User/List';
import LanguageList from 'pages/Language/List';
import Queue from 'pages/Queue';

export interface MenuItem {
  path: string;
  title?: string;
  subTitle?: string;
  breadcrumbName?: string;
  component?: ElementType;
  icon?: ElementType;
  children?: MenuItem[];
  exact?: boolean;
  noHeader?: boolean;
  aclResource?: string;
}

const menus: MenuItem[] = [
  {
    path: '/',
    title: 'Dashboard',
    component: Dashboard,
    exact: true,
    icon: DashboardOutlined,
  },
  {
    path: '/activities',
    title: 'Activities',
    subTitle: 'Manager activity for web site',
    icon: UserOutlined,
    component: ActivityList,
    exact: true,
    aclResource: 'activities',
  },
  {
    path: '/companies',
    title: 'Companies',
    subTitle: 'Manager company and configurations',
    icon: UserOutlined,
    component: CompanyList,
    exact: true,
    aclResource: 'companies',
  },
  {
    path: '/users',
    title: 'Users',
    subTitle: 'Manager system users',
    icon: UserOutlined,
    component: UserList,
    exact: true,
    aclResource: 'users',
  },
  {
    path: '/profiles',
    title: 'Profiles',
    subTitle: 'Manager user profiles and ACL configurations',
    icon: ProfileOutlined,
    component: ProfileManager,
    exact: true,
    aclResource: 'profiles',
  },
  {
    path: '/languages',
    title: 'Languages',
    subTitle: 'Manager site language translation',
    icon: ProfileOutlined,
    component: LanguageList,
    exact: true,
    aclResource: 'profiles',
  },
  {
    path: '/queues',
    title: 'Queues',
    subTitle: 'Manager site queues',
    icon: ProfileOutlined,
    component: Queue,
    exact: true,
    aclResource: 'queues',
  },
  // {
  //   path: '/projects',
  //   title: 'Projetos 2',
  //   icon: UserOutlined,
  //   children: [
  //     {
  //       path: '/test2',
  //       title: 'Submenu 2',
  //       icon: UploadOutlined,
  //       children: [
  //         {
  //           path: '/test2-1',
  //           title: 'Submenu 2.1',
  //           component: Dashboard,
  //           icon: UploadOutlined,
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default menus;
