import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { history } from 'umi';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Login from '@/pages/user/Login';
import Register from '@/pages/user/Register';
import './style/UserLayout.less';

const { TabPane } = Tabs;

interface UserLayoutProps {
  dispatch: Dispatch<AnyAction>;
  type: string;
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const { dispatch, type } = props;
  const { pathname } = history.location;

  useEffect(() => {
    let payload = 'login';
    if (pathname === '/user/register') {
      payload = 'register';
    }
    dispatch({
      type: 'login/saveType',
      payload,
    });
  }, [pathname]);

  const tabChange = (activeKey: string) => {
    const path = activeKey === '1' ? '/user/login' : '/user/register';
    history.replace(path);
  };

  return (
    <div className="user-layout">
      <Header />
      <div className="content">
        <div className="card-container">
          <Tabs
            type="card"
            activeKey={type === 'login' ? '1' : '2'}
            onChange={tabChange}
          >
            <TabPane tab="登 陆" key="1">
              {type === 'login' ? <Login /> : null}
            </TabPane>
            <TabPane tab="注 册" key="2">
              {type === 'register' ? <Register /> : null}
            </TabPane>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default connect(({ login }: ConnectState) => ({
  type: login.type,
}))(UserLayout);
