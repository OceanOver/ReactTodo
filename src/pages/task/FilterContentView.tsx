import React, { Component } from 'react';
import { DatePicker, Tooltip, Row, Col, Pagination, Modal } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { TaskStateType, TaskType } from '@/models/task';
import contentNone from '@/assets/contentNone.svg';
import './style/FilterContentView.less';
import FilterContentSection, { SectionType } from './FilterContentSection';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

interface TaskListParamsType {
  type?: number;
  page?: number;
  startDate?: string | null;
  endDate?: string | null;
}

interface FilterContentViewProps {
  dispatch: Dispatch<AnyAction>;
  task: TaskStateType;
  data: TaskType;
}

class FilterContentView extends Component<FilterContentViewProps> {
  _handlePageChange = (page: any) => {
    const {
      dispatch,
      task: { selectIndex },
    } = this.props;
    if (selectIndex === 1) {
      // 已过期
      dispatch({ type: 'task/taskList', payload: { page, type: 3 } });
    } else if (selectIndex === 2) {
      // 已完成
      dispatch({ type: 'task/taskList', payload: { page, type: 2 } });
    }
  };

  _clickDelete = () => {
    const {
      dispatch,
      task: { selectIndex },
    } = this.props;
    confirm({
      title: '确定删除?',
      content: '删除后不能撤销',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (selectIndex === 1) {
          // 已过期
          dispatch({ type: 'task/deleteTaskList', payload: { type: 3 } });
        } else if (selectIndex === 2) {
          // 已完成
          dispatch({ type: 'task/deleteTaskList', payload: { type: 2 } });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  _fetchTaskList = (params: TaskListParamsType) => {
    const {
      dispatch,
      task: { selectIndex },
    } = this.props;
    if (selectIndex === 1) {
      // 已过期
      dispatch({ type: 'task/taskList', payload: { ...params, type: 3 } });
    } else if (selectIndex === 2) {
      // 已完成
      dispatch({ type: 'task/taskList', payload: { ...params, type: 2 } });
    }
  };

  _handleDateChange = (date: any) => {
    if (date===null || date.length === 0) {
      this._fetchTaskList({
        page: 1,
        startDate: null,
        endDate: null,
      });
    } else {
      const startDate = date[0].format('YYYY-MM-DD HH:mm:ss');
      const endDate = date[1].format('YYYY-MM-DD  HH:mm:ss');
      this._fetchTaskList({
        page: 1,
        startDate,
        endDate,
      });
    }
  };

  _resetDate = () => {
    this._fetchTaskList({
      page: 1,
      startDate: null,
      endDate: null,
    });
  };

  _dataSource = () => {
    const {
      task: { completeItems, expireItems, selectIndex },
    } = this.props;
    return selectIndex === 1 ? expireItems : completeItems;
  };

  _FilterContentSection = () => {
    const {
      task: { selectIndex },
    } = this.props;
    const dataSource = this._dataSource();
    if (selectIndex === -1) {
      return null;
    }
    const keys: string[] = [];
    const data = dataSource.map(item => {
      const { expire_time, complete_time } = item;
      let date;
      if (selectIndex === 1 && expire_time) {
        date = expire_time.slice(0, 10);
      } else if (selectIndex === 2 && complete_time) {
        date = complete_time.slice(0, 10);
      }
      if (date && keys.indexOf(date) === -1) {
        keys.push(date);
      }
      return Object.assign({ date }, item);
    });
    console.log('### data ###');
    console.log(data);
    console.log('### keys ###');
    console.log(keys);
    const _data: SectionType[] = [];
    keys.forEach(key => {
      const _date = moment(key).format('MM月DD日');
      const _day = moment(key).format('dddd');
      const obj: SectionType = { date: _date, day: _day, list: [] };
      const array: any[] = [];
      data.forEach(item => {
        const { date } = item;
        if (date === key) {
          array.push(item);
        }
      });
      obj.list = array;
      _data.push(obj);
    });

    console.log('### _data ###');
    console.log(_data);

    return _data.map((item, index) => {
      const key = `section-${index}`;
      return <FilterContentSection key={key} dataSource={item} />;
    });
  };

  render() {
    const {
      task: { page, condition, selectIndex },
    } = this.props;
    const { current, total } = page;
    const { startDate, endDate } = condition;

    let emptyState = 'block';
    let listState = 'none';
    if (total > 0) {
      emptyState = 'none';
      listState = 'block';
    }
    const rangeDate: any = [null, null];
    if (startDate) {
      rangeDate[0] = moment(startDate);
    }
    if (endDate) {
      rangeDate[1] = moment(endDate);
    }

    return (
      <div
        className="filter-content"
        style={{ display: selectIndex === -1 ? 'none' : 'block' }}
      >
        <Row>
          <Col span={6}>
            <Tooltip title="删除全部">
              <DeleteOutlined className="delete" onClick={this._clickDelete} />
            </Tooltip>
          </Col>
          <Col span={18}>
            <div className="date-picker">
              <RangePicker
                value={rangeDate}
                format="MM月DD日"
                style={{
                  width: '200px',
                  float: 'right',
                }}
                onChange={this._handleDateChange}
              />
              <ReloadOutlined className="reload" onClick={this._resetDate} />
            </div>
          </Col>
        </Row>
        <div
          style={{
            display: listState,
          }}
        >
          <ul>{this._FilterContentSection()}</ul>
          <Pagination
            defaultCurrent={1}
            current={current}
            total={total}
            onChange={this._handlePageChange}
          />
        </div>
        <div
          className="content-none"
          style={{
            display: emptyState,
          }}
        >
          <img alt="" className="content-none-icon" src={contentNone} />
          <p>暂无记录</p>
        </div>
      </div>
    );
  }
}

export default connect(({ task }: ConnectState) => ({
  task,
}))(FilterContentView);
