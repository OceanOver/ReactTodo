import React from 'react';
import logo from '@/assets/logo.svg';
import './index.less';

const Header: React.FC = () => {
  return (
    <header className="login-header">
      <img alt="" className="header-icon" src={logo} />
      <p className="header-title">日常待办</p>
    </header>
  );
};

export default Header;
