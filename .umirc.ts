import { defineConfig } from 'umi';
import {Button} from 'antd'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  define: {
    ENV: process.env.ENV || '',
  },
  theme: {
    'primary-color': '#5d6164',
    'button-height': '40px',
    'button-font-size': '16px',
  },
  routes: [
    {
      path: '/user',
      component: '@/layouts/UserLayout',
      routes: [
        {
          path: '/user/login',
          title: 'Login',
        },
        {
          path: '/user/register',
          title: 'Register',
        },
      ],
    },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        {
          path: '/main',
          component: '@/pages/task',
          title: 'Task',
        },
        { path: '/', redirect: '/main' },
      ],
    },
  ],
});
