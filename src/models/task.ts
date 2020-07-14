// import { message } from 'antd';
import { Effect } from 'dva';
import { Reducer } from 'redux';
import { ConnectState } from '@/models/connect';
import {
  requestTaskList,
  requestStatistics,
  deleteTask,
  deleteTasks,
  addTask,
  updateTask,
} from '@/services/task';
import moment from 'moment';

interface ConditionType {
  page: number | string;
  startDate: string | null;
  endDate: string | null;
}

interface PageType {
  current: number;
  total: number;
}

export interface StatisticsType {
  all: number;
  complete: number;
  expire: number;
}

export interface TaskType {
  id?: number;
  user_id?: number;
  content: string;
  expire_time?: string;
  complete_time?: string;
  note?: string;
  completed?: number;
}

export interface TaskStateType {
  uncompleteItems: TaskType[];
  expireItems: TaskType[];
  completeItems: TaskType[];
  statistics: StatisticsType;
  selectIndex: number;
  condition: ConditionType;
  page: PageType;
}

export interface TaskModelType {
  namespace: string;
  state: TaskStateType;
  effects: {
    deleteTask: Effect;
    deleteTaskList: Effect;
    addTask: Effect;
    updateTask: Effect;
    uncompleteItems: Effect;
    taskList: Effect;
    fetchStatistics: Effect;
  };
  reducers: {
    save: Reducer;
  };
}

const Model: TaskModelType = {
  namespace: 'task',

  state: {
    uncompleteItems: [],
    expireItems: [],
    completeItems: [],
    statistics: {
      all: 0,
      complete: 0,
      expire: 0,
    },
    // 1 : 过期 2 : 完成
    selectIndex: -1,
    condition: {
      page: 1,
      startDate: null,
      endDate: null,
    },
    page: {
      current: 1,
      total: 0,
    },
  },

  effects: {
    *addTask({ payload }, { call, put }) {
      const response = yield call(addTask, payload);
      console.log('addTask: ', response);
      const { code } = response;
      if (code === 1200) {
        yield put({
          type: 'uncompleteItems',
        });
      }
    },
    *updateTask({ payload }, { call, put }) {
      const response = yield call(updateTask, payload);
      console.log('updateTask: ', response);
      const { code } = response;
      if (code === 1200) {
        yield put({
          type: 'uncompleteItems',
        });
      }
    },
    *deleteTask({ payload }, { call, put }) {
      const { type, id } = payload;
      const response = yield call(deleteTask, id);
      console.log('deleteTask: ', response);
      const { code } = response;
      if (code === 1200) {
        if (type === 1) {
          yield put({
            type: 'uncompleteItems',
          });
        } else {
          yield put({
            type: 'taskList',
            payload: {
              type,
            },
          });
        }
      }
    },
    *deleteTaskList({ payload }, { call, put }) {
      const { type } = payload;
      const response = yield call(deleteTasks, payload);
      console.log('deleteTasks: ', response);
      const { code } = response;
      if (code === 1200) {
        yield put({
          type: 'taskList',
          payload: {
            type,
            page: 1,
          },
        });
      }
    },
    *uncompleteItems(_, { call, put }) {
      const response = yield call(requestTaskList, { type: 1 });
      console.log('uncompleteItems: ', response);
      const { code } = response;
      if (code === 1200) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: {
            uncompleteItems: data,
          },
        });
        yield put({
          type: 'fetchStatistics',
        });
      }
    },
    *taskList({ payload }, { call, put, select }) {
      const task: TaskStateType = yield select(
        (state: ConnectState) => state.task,
      );
      const { condition } = task;
      const { type, page, startDate, endDate } = payload;
      const params = {
        ...condition,
        type,
      };
      if (page) {
        params.page = page;
      }
      if (startDate || startDate === null) {
        params.startDate = startDate;
      }
      if (endDate || endDate === null) {
        params.endDate = endDate;
      }
      const _startDate = params.startDate;
      const _endDate = params.endDate;
      const _params = {
        ...params,
      };
      if (_startDate) {
        _params.startDate = moment(_startDate).format('YYYYMMDDHHmmss');
      } else {
        delete _params.startDate;
      }
      if (_endDate) {
        _params.endDate = moment(endDate).format('YYYYMMDDHHmmss');
      } else {
        delete _params.endDate;
      }
      const response = yield call(requestTaskList, _params);
      console.log('requestTaskList: ', response);
      const { code } = response;
      if (code === 1200) {
        const { data } = response;
        const { current, total, results } = data;
        const _payload = {
          condition: params,
          page: { current, total },
        };
        if (type === 2) {
          yield put({
            type: 'save',
            payload: {
              ..._payload,
              completeItems: results,
            },
          });
        } else if (type === 3) {
          yield put({
            type: 'save',
            payload: {
              ..._payload,
              expireItems: results,
            },
          });
        }
        yield put({
          type: 'fetchStatistics',
        });
      }
    },
    *fetchStatistics({ payload }, { call, put }) {
      const response = yield call(requestStatistics, payload);
      console.log('requestStatistics: ', response);
      const { code } = response;
      if (code === 1200) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: {
            statistics: data,
          },
        });
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
  },
};

export default Model;
