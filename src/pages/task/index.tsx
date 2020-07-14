import React from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import Task from './Task';
import FilterView from './FilterView';
import FilterContentView from './FilterContentView';
import './style/Main.less';

interface MainProps {
  dispatch: Dispatch<AnyAction>;
}

class Main extends React.Component<MainProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/uncompleteItems',
    });
  }

  render() {
    return (
      <div
        className="main-content"
        style={{ minHeight: 'calc(100vh - 104px)' }}
      >
        <Task />
        <FilterView />
        <FilterContentView />
      </div>
    );
  }
}

export default connect()(Main);
