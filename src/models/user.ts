import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { history } from 'umi';
import { requestUserInfo, modifyPassword, uploadHeader } from '@/services/user';
import { localRemove } from '@/utils/store';

export interface UserInfoType {
  id?: number;
  username?: string;
  header?: string;
}

export interface UserStateType {
  userInfo: UserInfoType;
  headIconVisible: boolean;
}

export interface UserModelType {
  namespace: 'user';
  state: UserStateType;
  effects: {
    fetchUserInfo: Effect;
    modifyPassword: Effect;
    uploadHeader: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer;
    save: Reducer;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    userInfo: {},
    headIconVisible: false,
  },

  effects: {
    *fetchUserInfo(_, { call, put }) {
      const response = yield call(requestUserInfo);
      console.log('获取用户详情');
      console.log(response);
      const { code, data: user } = response;
      if (code === 1200) {
        yield put({
          type: 'saveCurrentUser',
          payload: user,
        });
      }
    },
    *modifyPassword({ payload }, { call }) {
      const response = yield call(modifyPassword, payload);
      console.log('modifyPassword: ', response);
      const { code } = response;
      if (code === 1200) {
        message.success('修改成功', 1);
        localRemove('access_token');
        history.replace('/user/login');
      }
    },
    *uploadHeader({ payload }, { call, put }) {
      const response = yield call(uploadHeader, payload);
      console.log('uploadHeader: ', response);
      const { code } = response;
      if (code === 1200) {
        message.success('修改成功', 1);
        yield put({ type: 'fetchUserInfo' });
        yield put({ type: 'save', payload: { headIconVisible: false } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        userInfo: action.payload || {},
      };
    },
  },
};

export default UserModel;
