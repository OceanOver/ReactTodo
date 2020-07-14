import React, { Fragment } from 'react';
import { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { ConfigProvider, Affix } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Footer from '@/components/Footer';
import TaskHeader from '@/components/TaskHeader';
import 'moment/locale/zh-cn';

export interface BasicLayoutProps extends ProLayoutProps {
  dispatch: Dispatch;
}

class BasicLayout extends React.Component<BasicLayoutProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUserInfo',
    });
  }

  render() {
    const { children } = this.props;
    return (
      <ConfigProvider locale={zhCN}>
        <Fragment>
          <Affix offsetTop={0}>
            <TaskHeader />
          </Affix>
          {children}
          <Footer />
        </Fragment>
      </ConfigProvider>
    );
  }
}

export default connect()(BasicLayout);
