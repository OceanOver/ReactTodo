import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import validator from 'validator';

interface RegisterProps {
  dispatch: Dispatch<AnyAction>;
  submitting: boolean;
}

const Register: React.FC<RegisterProps> = props => {
  const { dispatch, submitting } = props;
  const [form] = Form.useForm();
  const [registerUsernameStatus, setUsernameStatus] = useState<ValidateStatus>(
    '',
  );
  const [registerUsernameHelp, setUsernameHelp] = useState('');
  const [registerPasswordStatus, setPasswordStatus] = useState<ValidateStatus>(
    '',
  );
  const [registerPasswordHelp, setPasswordHelp] = useState('');
  const [registerConfirmStatus, setConfirmStatus] = useState<ValidateStatus>(
    '',
  );
  const [registerConfirmHelp, setConfirmHelp] = useState('');

  const _handleSubmit = () => {
    const reqBody = form.getFieldsValue();
    const { username, password, rePasswd } = reqBody;
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
    if (!rePasswd || validator.isEmpty(rePasswd)) {
      setConfirmStatus('warning');
      setConfirmHelp('请输入确认密码');
    } else if (rePasswd !== password) {
      setConfirmStatus('warning');
      setConfirmHelp('请确认密码');
      return;
    }

    dispatch({
      type: 'login/register',
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

  const _onFocusRePassword = () => {
    const { setFieldsValue } = form;
    setFieldsValue({ rePasswd: '' });
    setConfirmStatus('');
    setConfirmHelp('');
  };
  return (
    <Form
      form={form}
      layout="vertical"
      style={{
        maxWidth: 200,
      }}
    >
      <Form.Item
        label="用户名"
        name="username"
        validateStatus={registerUsernameStatus}
        help={registerUsernameHelp}
      >
        <Input
          onFocus={_onFocusUsername}
          placeholder="请输入用户名"
          style={{
            height: '40px',
            fontSize: '14px',
          }}
        />
      </Form.Item>
      <Form.Item
        label="密&nbsp;&nbsp;&nbsp;码"
        name="password"
        validateStatus={registerPasswordStatus}
        help={registerPasswordHelp}
      >
        <Input
          type="password"
          onFocus={_onFocusPassword}
          placeholder="请输入密码"
          style={{
            height: '40px',
            fontSize: '14px',
          }}
        />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="rePasswd"
        validateStatus={registerConfirmStatus}
        help={registerConfirmHelp}
      >
        <Input
          type="password"
          onFocus={_onFocusRePassword}
          autoComplete="off"
          placeholder="请再次输入密码"
          style={{
            height: '40px',
            fontSize: '14px',
          }}
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
        注&nbsp;&nbsp;&nbsp;册
      </Button>
    </Form>
  );
};

export default connect(({ loading }: ConnectState) => ({
  submitting: loading.effects['login/register'],
}))(Register);
