import React, { Component } from 'react';
import { Input, Affix } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { TaskStateType } from '@/models/task';
import contentNone from '@/assets/contentNone.svg';
import ContentCell from './ContentCell';
import './style/Task.less';

interface TaskProps {
  dispatch: Dispatch<AnyAction>;
  task: TaskStateType;
}

class Task extends Component<TaskProps> {
  state = {
    text: '',
  };

  _onSave = (e: any) => {
    const { dispatch } = this.props;
    const text = e.target.value.trim();
    if (text.length === 0) {
      return;
    }
    const params = {
      content: text,
    };
    dispatch({
      type: 'task/addTask',
      payload: params,
    });
    this.setState({ text: '' });
  };

  _handleChange = (e: { target: { value: any } }) => {
    this.setState({ text: e.target.value });
  };

  render() {
    let emptyState = 'block';
    let listState = 'none';
    const {
      task: { uncompleteItems },
    } = this.props;

    if (uncompleteItems.length > 0) {
      emptyState = 'none';
      listState = 'block';
    }

    return (
      <div className="todo-content">
        <Affix offsetTop={64}>
          <Input
            size="large"
            placeholder="添加新任务"
            value={this.state.text}
            onPressEnter={this._onSave}
            onChange={this._handleChange}
            style={{
              height: '40px',
              fontSize: '14px',
            }}
          />
        </Affix>
        <div className="content-line" />
        <div style={{ display: listState }}>
          <ul className="uncomplete-list">
            {uncompleteItems.map(item => {
              return <ContentCell key={item.id} data={item} />;
            })}
          </ul>
        </div>
        <div
          className="content-none"
          style={{
            display: emptyState,
          }}
        >
          <img alt="" className="content-none-icon" src={contentNone} />
          <p>暂无未完成记录</p>
        </div>
      </div>
    );
  }
}

export default connect(({ task }: ConnectState) => ({
  task,
}))(Task);
