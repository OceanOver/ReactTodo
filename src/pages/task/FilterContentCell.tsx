import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { TaskStateType, TaskType } from '@/models/task';
import './style/FilterContentCell.less';

interface FilterContentCellProps {
  dispatch: Dispatch<AnyAction>;
  task: TaskStateType;
  data: TaskType;
}

class FilterContentCell extends Component<FilterContentCellProps> {
  _deleteItem = (id: number) => {
    console.log(`####删除${id}####`);
    const {
      dispatch,
      task: { selectIndex },
    } = this.props;
    if (selectIndex === 1) {
      dispatch({
        type: 'task/deleteTask',
        payload: {
          type: 3,
          id,
        },
      });
    } else if (selectIndex === 2) {
      dispatch({
        type: 'task/deleteTask',
        payload: {
          type: 2,
          id,
        },
      });
    }
  };

  render() {
    const { data } = this.props;
    return (
      <li
        style={{
          listStyle: 'none',
          borderBottom: '1px dotted #e0e0e0',
        }}
      >
        <div className="cell">
          <Row>
            <Col span={20}>
              <p>{data.content}</p>
            </Col>
            <Col span={4}>
              <a
                onClick={() => {
                  const { id } = data;
                  if (id) {
                    this._deleteItem(id);
                  }
                }}
              >
                删除
              </a>
            </Col>
          </Row>
        </div>
      </li>
    );
  }
}

export default connect(({ task }: ConnectState) => ({
  task,
}))(FilterContentCell);
