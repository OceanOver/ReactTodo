import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import validator from 'validator';

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  submitting: boolean;
}

const Login: React.FC<LoginProps> = props => {
  // location 对象，包含 pathname、search 和 hash
  const { dispatch, submitting } = props;
  const [form] = Form.useForm();
  const [loginUsernameStatus, setUsernameStatus] = useState<ValidateStatus>('');
  const [loginUsernameHelp, setUsernameHelp] = useState('');
  const [loginPasswordStatus, setPasswordStatus] = useState<ValidateStatus>('');
  const [loginPasswordHelp, setPasswordHelp] = useState('');

  const _handleSubmit = () => {
    const reqBody = form.getFieldsValue();
    const { username, password } = reqBody;
    if (!username || validator.isEmpty(username)) {
      setUsernameStatus('warning');
      setUsernameHelp('请输入用户名');
      return;
    }
    if (!password || validator.isEmpty(password)) {
      setPasswordStatus('warning');
      setPasswordHelp('请输入密码');
      return;
    }
    dispatch({
      type: 'login/login',
      payload: {
        username,
        password,
      },
    });
  };

  const _onFocusUsername = () => {
    setUsernameStatus('');
    setUsernameHelp('');
  };

  const _onFocusPassword = () => {
    const { setFieldsValue } = form;
    setFieldsValue({ password: '' });
    setPasswordStatus('');
    setPasswordHelp('');
  };

  return (
    <Form
      layout="vertical"
      form={form}
      style={{
        maxWidth: 200,
      }}
    >
      <Form.Item
        label="用户名"
        name="username"
        validateStatus={loginUsernameStatus}
        help={loginUsernameHelp}
      >
        <Input
          style={{
            height: '40px',
            fontSize: '14px',
          }}
          placeholder="请输入用户名"
          onFocus={_onFocusUsername}
        />
      </Form.Item>
      <Form.Item
        label="密&nbsp;&nbsp;&nbsp;码"
        name="password"
        validateStatus={loginPasswordStatus}
        help={loginPasswordHelp}
      >
        <Input
          style={{
            height: '40px',
            fontSize: '14px',
          }}
          type="password"
          placeholder="请输入密码"
          onFocus={_onFocusPassword}
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        style={{
          width: '200px',
          height: '40px',
          fontSize: '15px',
          margin: '15px 0',
        }}
        loading={submitting}
        onClick={_handleSubmit}
      >
        登&nbsp;&nbsp;&nbsp;录
      </Button>
    </Form>
  );
};

export default connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['login/login'],
}))(Login);
