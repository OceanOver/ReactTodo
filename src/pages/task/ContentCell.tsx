import React, { Component } from 'react';
import {
  Menu,
  Dropdown,
  Spin,
  Input,
  Modal,
  DatePicker,
  TimePicker,
} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { TaskStateType, TaskType } from '@/models/task';
import './style/ContentCell.less';
import { completeIcon } from '@/assets/complete.svg';

interface ContentCellProps {
  dispatch: Dispatch<AnyAction>;
  task: TaskStateType;
  data: TaskType;
}

class ContentCell extends Component<ContentCellProps> {
  state = {
    loading: false,
    visible: false,
    modalText: '',
    modalExpireDate: undefined,
  };

  expireDateString: string | undefined = '';

  originalModalText: string | undefined = '';

  originalDateString: string | undefined = '';

  componentDidMount() {
    const {
      data: { expire_time },
    } = this.props;
    this.expireDateString = expire_time;
  }

  _removeItem = () => {
    const { data, dispatch } = this.props;
    const { id } = data;
    dispatch({
      type: 'task/deleteTask',
      payload: {
        type: 1,
        id,
      },
    });
  };

  _completeItem = () => {
    const { data, dispatch } = this.props;
    const complete_time = moment().format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'task/updateTask',
      payload: {
        ...data,
        completed: 1,
        complete_time,
      },
    });
    dispatch({
      type: 'task/save',
      payload: {
        selectIndex: -1,
      },
    });
  };

  _editItem = (editedText: string) => {
    const { expireDateString } = this;
    const { data, dispatch } = this.props;
    const { id } = data;
    const content = editedText.trim();
    const params = {
      id,
      content,
      expire_time: expireDateString,
    };
    dispatch({
      type: 'task/updateTask',
      payload: params,
    });
  };

  _clickMenu = (param: any) => {
    const { key } = param;
    if (key === '1') {
      this._removeItem();
    } else {
      this._showModal();
    }
  };

  _showModal = () => {
    const { data } = this.props;
    const { content, expire_time: expireTime } = data;
    this.originalModalText = content;
    this.originalDateString = expireTime;
    this.setState({ modalText: content });
    const date = moment(expireTime);
    this.setState({ modalExpireDate: date });
    this.setState({ visible: true });
  };

  _clickComplete = () => {
    this._completeItem();
  };

  _handleOk = () => {
    const text = this.state.modalText;
    const expireTime = this.expireDateString;
    const textHasChange =
      text === this.originalModalText || !text || text.length === 0;
    const expireHasChange = expireTime === this.originalDateString;
    if (textHasChange && expireHasChange) {
      this.setState({ visible: false });
    } else {
      this._editItem(text);
      this.setState({ visible: false });
    }
  };

  _handleDateChange = (date: any) => {
    this.expireDateString = date.format('YYYY-MM-DD HH:mm:ss');
    this.setState({ modalExpireDate: date });
  };

  render() {
    const menu = (
      <Menu onClick={this._clickMenu}>
        <Menu.Item key="1">删除</Menu.Item>
        <Menu.Item key="2">编辑</Menu.Item>
      </Menu>
    );
    const { data } = this.props;
    return (
      <Spin spinning={this.state.loading}>
        <li className="contentCell">
          <div className="cell-content">
            <div className="content-left">
              <img
                alt=""
                className="cell-complete"
                src={completeIcon}
                onClick={this._clickComplete}
              />
              <p className="cell-info">{data.content}</p>
            </div>
            <div className="cell-edit">
              <Dropdown overlay={menu} placement="bottomCenter">
                <EllipsisOutlined />
              </Dropdown>
            </div>
          </div>
          <div className="cell-line" />
        </li>
        {/*======== edit modal =======*/}
        <Modal
          title="编辑"
          visible={this.state.visible}
          onOk={this._handleOk}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <Input
            type="textarea"
            value={this.state.modalText}
            placeholder="编辑内容"
            style={{
              fontSize: 14,
              letterSpacing: 1,
              fontWeight: 200,
            }}
            onChange={e => {
              const text = e.target.value;
              this.setState({ modalText: text });
            }}
          />
          <div className="expire-picker">
            <p>&nbsp;截 止 日 期：</p>
            <DatePicker
              allowClear={false}
              value={moment(this.state.modalExpireDate)}
              format="YYYY/MM/DD"
              onChange={this._handleDateChange}
            />
            <TimePicker
              allowClear={false}
              value={moment(this.state.modalExpireDate)}
              format="HH:mm"
              style={{
                marginLeft: '10px',
              }}
              onChange={this._handleDateChange}
            />
          </div>
        </Modal>
      </Spin>
    );
  }
}

export default connect(({ task }: ConnectState) => ({
  task,
}))(ContentCell);
