import React, { useState } from 'react';
import {
  Menu,
  Row,
  Col,
  Dropdown,
  Modal,
  Form,
  Input,
  Upload,
  message,
} from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ConnectState, UserModelState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { history } from 'umi';
import { localRemove, localGet } from '@/utils/store';
import { uploadURL, preURL } from '@/utils/constants';
import logo from '@/assets/logo.svg';
import headIcon from '@/assets/userIcon.png';
import './index.less';

interface TaskHeaderProps {
  dispatch: Dispatch<AnyAction>;
  user: UserModelState;
}

const TaskHeader: React.FC<TaskHeaderProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const {
    user: { userInfo, headIconVisible },
    dispatch,
  } = props;

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };

  const _validString = (str: string) => {
    // 1：字符串为空 2：包含空格
    if (!str) {
      return 1;
    }
    const arr = str.split(' ');
    if (arr.length !== 1) {
      return 2;
    }
    return 0;
  };

  const _showModal = () => {
    setVisible(true);
  };

  const _hideModal = () => {
    setVisible(false);
  };

  const _showHeadIconModal = () => {
    dispatch({
      type: 'user/save',
      payload: {
        headIconVisible: true,
      },
    });
  };

  const _hideHeadIconModal = () => {
    setImageUrl(undefined);
    dispatch({
      type: 'user/save',
      payload: {
        headIconVisible: false,
      },
    });
  };

  const _handleMenuClick = (e: { key: string }) => {
    if (e.key === '0') {
      //修改密码
      _showModal();
    } else {
      //退出登录
      localRemove('access_token');
      message.success('已退出账户登录', 1);
      setTimeout(() => {
        history.push('/user/login');
      }, 2000);
    }
  };

  const _handleSubmit = () => {
    const reqBody = form.getFieldsValue();
    const { password, newPassword } = reqBody;
    const validPas = _validString(password);
    const validNewPas = _validString(newPassword);
    if (validPas === 1) {
      message.warn('请输入密码');
      return;
    }
    if (validPas === 2) {
      message.warn('用户名不允许有空格');
      return;
    }
    if (validNewPas === 1) {
      message.warn('请输入新密码');
      return;
    }
    if (validNewPas === 2) {
      message.warn('密码不允许有空格');
      return;
    }
    if (reqBody.newPassword !== reqBody.rePasswd) {
      message.warn('请确认密码');
      return;
    }

    dispatch({
      type: 'user/modifyPassword',
      payload: reqBody,
    });
  };

  const _uploadHeadIcon = () => {
    if (imageUrl) {
      dispatch({
        type: 'user/uploadHeader',
        payload: {
          header: imageUrl,
        },
      });
    }
  };

  const _uploadChange = (info: any) => {
    const { file } = info;
    const { status } = file;
    if (status === 'done') {
      const { response } = file;
      console.log('上传结果');
      console.log(response);
      const { code, data } = response;
      if (code === 1200) {
        setImageUrl(data);
      }
    }
  };

  const menu = (
    <Menu onClick={_handleMenuClick}>
      <Menu.Item key="0">账号</Menu.Item>
      <Menu.Item key="1">退出</Menu.Item>
    </Menu>
  );

  let headIconPath = headIcon;
  if (userInfo.header) {
    headIconPath = preURL + userInfo.header;
  }

  const userToken = localGet('access_token');

  return (
    <header className="todo-header">
      <Row
        justify="space-around"
        align="middle"
        style={{
          height: '100%',
        }}
      >
        <Col span={10}>
          <img
            alt=""
            className="task-header-icon"
            src={logo}
            onClick={() => {
              history.push('/user/login');
            }}
          />
          <p className="header-title">日常待办</p>
        </Col>
        <Col span={10}>
          <div className="user-menu">
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link">
                {userInfo.username}
                <DownOutlined style={{ marginLeft: 4 }} />
              </a>
            </Dropdown>
          </div>
          <img
            alt=""
            className="user-icon"
            src={headIconPath}
            onClick={_showHeadIconModal}
          />
        </Col>
      </Row>
      {/*======= Modal =======*/}
      <Modal
        title="上传头像"
        visible={headIconVisible}
        onOk={_uploadHeadIcon}
        onCancel={_hideHeadIconModal}
      >
        <Upload
          className="avatar-uploader"
          showUploadList={false}
          action={uploadURL}
          name="picture"
          headers={{ Authorization: `JWT ${userToken}` }}
          onChange={_uploadChange}
        >
          {imageUrl ? (
            <img alt="" src={preURL + imageUrl} className="avatar" />
          ) : (
            <div className="avatar-uploader-trigger">
              <PlusOutlined />
            </div>
          )}
        </Upload>
      </Modal>

      <Modal
        title="修改密码"
        visible={visible}
        onOk={_handleSubmit}
        onCancel={_hideModal}
      >
        <Form form={form}>
          <Form.Item {...formItemLayout} label="原密码" name="password">
            <Input type="password" autoComplete="off" />
          </Form.Item>
          <Form.Item {...formItemLayout} label="新密码" name="newPassword">
            <Input type="password" autoComplete="off" />
          </Form.Item>
          <Form.Item {...formItemLayout} label="确认密码" name="rePasswd">
            <Input type="password" autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </header>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(TaskHeader);
