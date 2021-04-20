import React, { memo } from 'react';
import { Column, Line, Area, Pie, Bar, Rose } from '@ant-design/charts';
import { Card } from 'antd/es';

import './style.less';

const OneGraphic: React.FC = (props: any) => {
  console.log(props);
  if (!props || !props.data) {
    return (
      <Card className="rounded" size="small" title="No Data">
        <h1>NO data</h1>
      </Card>
    );
  }
  const { title, updatedAt, results, config, type } = props?.data;
  const graphicConfig = {
    data: results,
    ...config,
  };

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  switch (type) {
    case 'Column':
      return (
        <Card className="rounded" size="small" title={title} extra={`Atualizado em ${formatDate(updatedAt)}`}>
          <Column {...graphicConfig} />
        </Card>
      );
    case 'Line':
      return (
        <Card className="rounded" size="small" title={title} extra={`Atualizado em ${formatDate(updatedAt)}`}>
          <Line {...graphicConfig} />
        </Card>
      );
    case 'Area':
      return (
        <Card className="rounded" size="small" title={title} extra={`Atualizado em ${formatDate(updatedAt)}`}>
          <Area {...graphicConfig} />
        </Card>
      );
    case 'Pie':
      return (
        <Card className="rounded" size="small" title={title} extra={`Atualizado em ${formatDate(updatedAt)}`}>
          <Pie {...graphicConfig} />
        </Card>
      );
    case 'Bar':
      return (
        <Card className="rounded" size="small" title={title} extra={`Atualizado em ${formatDate(updatedAt)}`}>
          <Bar {...graphicConfig} />
        </Card>
      );
    case 'Rose':
      return (
        <Card className="rounded" size="small" title={title} extra={`Atualizado em ${formatDate(updatedAt)}`}>
          <Rose {...graphicConfig} />
        </Card>
      );
    default:
      return (
        <Card className="rounded" size="small" title="No Data">
          <h1>NO data</h1>
        </Card>
      );
  }
};
export default memo(OneGraphic);
