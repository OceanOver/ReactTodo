import React from 'react';
import { Row, Col } from 'antd';
import classNames from 'classnames';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { TaskStateType } from '@/models/task';
import './style/FilterView.less';

interface FilterViewProps {
  dispatch: Dispatch<AnyAction>;
  task: TaskStateType;
}

class FilterView extends React.Component<FilterViewProps> {
  _clickAction = (index: number) => {
    const {
      dispatch,
      task: { selectIndex },
    } = this.props;

    if (index === 1) {
      // 已过期的任务
      if (selectIndex === 1) {
        dispatch({ type: 'task/save', payload: { selectIndex: -1 } });
      } else {
        dispatch({ type: 'task/save', payload: { selectIndex: index } });
        dispatch({
          type: 'task/taskList',
          payload: {
            type: 3,
            page: 1,
            startDate: null,
            endDate: null,
          },
        });
      }
    } else if (index === 2) {
      // 已完成的任务
      if (selectIndex === 2) {
        dispatch({ type: 'task/save', payload: { selectIndex: -1 } });
      } else {
        dispatch({ type: 'task/save', payload: { selectIndex: index } });
        dispatch({
          type: 'task/taskList',
          payload: {
            type: 2,
            page: 1,
            startDate: null,
            endDate: null,
          },
        });
      }
    }
  };

  render() {
    const {
      task: { statistics, selectIndex },
    } = this.props;
    const { all, complete, expire } = statistics;

    return (
      <div className="filterView">
        <Row className="filter-option">
          <Col span={8}>
            <div className="filter-item">
              <span className="filter-title">统计</span>
              <span className="filter-subtitl">全部任务</span>
              <span className="filter-number">{all}</span>
            </div>
          </Col>
          <Col span={8}>
            <div
              className={classNames('filter-item', {
                select: selectIndex === 1,
              })}
              onClick={this._clickAction.bind(this, 1)}
            >
              <span className="filter-title">过期历史</span>
              <span className="filter-subtitle">累计过期的任务</span>
              <span className="filter-number">{expire}</span>
            </div>
            <div className="line" />
          </Col>
          <Col span={8}>
            <div
              className={classNames('filter-item', 'none-split', {
                select: selectIndex === 2,
              })}
              onClick={this._clickAction.bind(this, 2)}
            >
              <span className="filter-title">完成历史</span>
              <span className="filter-subtitle">累计完成的任务</span>
              <span className="filter-number">{complete}</span>
            </div>
            <div className="line" />
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ task }: ConnectState) => ({
  task,
}))(FilterView);
