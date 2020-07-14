import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { TaskType } from '@/models/task';
import FilterContentCell from './FilterContentCell';
import './style/FilterContentSection.less';

export interface SectionType {
  list: TaskType[];
  date: string;
  day: string;
}

interface FilterContentSectionProps {
  dataSource: SectionType;
}

class FilterContentSection extends Component<FilterContentSectionProps> {
  _renderList = () => {
    const { dataSource } = this.props;
    const { list } = dataSource;
    return list.map(item => {
      const key = `item-${item.id}`;
      return <FilterContentCell key={key} data={item} />;
    });
  };

  render() {
    const { dataSource } = this.props;
    const { date, day } = dataSource;
    return (
      <li style={{ listStyle: 'none' }}>
        <Row className="section">
          <Col span={4}>
            <div className="section-title">
              <span className="title-date">{date}</span>
              <br />
              {day}
            </div>
          </Col>
          <Col span={20}>
            <ul className="section-list">{this._renderList()}</ul>
          </Col>
        </Row>
      </li>
    );
  }
}

export default FilterContentSection;
