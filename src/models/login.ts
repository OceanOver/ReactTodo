import { message } from 'antd';
import { Effect } from 'dva';
import { history } from 'umi';
import { Reducer } from 'redux';
import { localSave } from '@/utils/store';

import { requestLogin, requestRegister } from '@/services/login';

export interface LoginStateType {
  type: 'login' | 'register';
}

export interface LoginModelType {
  namespace: string;
  state: LoginStateType;
  effects: {
    login: Effect;
    register: Effect;
  };
  reducers: {
    saveType: Reducer<LoginStateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    type: 'login',
  },

  effects: {
    *login({ payload }, { call }) {
      const response = yield call(requestLogin, payload);
      console.log('requestLogin: ', response);
      const { code, msg } = response;
      if (code === 1200) {
        const { data } = response;
        if (data) {
          const { token } = data;
          message.success('登录成功', 1);
          localSave('access_token', token);
          setTimeout(() => {
            history.push('/main');
          }, 1200);
        }
      } else {
        message.warn(msg);
      }
    },
    *register({ payload }, { call }) {
      const response = yield call(requestRegister, payload);
      console.log('requestRegister: ', response);
      const { msg, code } = response;
      if (code === 1200) {
        message.success('注册成功');
        setTimeout(() => {
          history.replace('/user/login');
        }, 1200);
      } else {
        message.warn(msg);
      }
    },
  },
  reducers: {
    saveType(state, action) {
      return {
        ...state,
        type: action.payload || {},
      };
    },
  },
};

export default Model;
