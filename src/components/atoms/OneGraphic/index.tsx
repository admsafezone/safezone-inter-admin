import React, { memo } from 'react';
import { Column, Line, Area, Pie, Bar, Rose } from '@ant-design/charts';
import { Card } from 'antd/es';
import { useAppContext } from 'providers/AppProvider';
import './style.less';

const OneGraphic: React.FC = (props: any) => {
  const { t } = useAppContext();
  if (!props || !props.code) {
    return null;
  }

  const { title, updatedAt, results, configs, type } = props;
  const graphicConfig = { data: results, ...configs };
  const updatedAtText = t('Updated At');

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString('pt-BR');
  };

  switch (type) {
    case 'Column':
      return (
        <Card className="rounded" size="small" title={title} extra={`${updatedAtText} ${formatDate(updatedAt)}`}>
          <Column {...graphicConfig} />
        </Card>
      );
    case 'Line':
      return (
        <Card className="rounded" size="small" title={title} extra={`${updatedAtText} ${formatDate(updatedAt)}`}>
          <Line {...graphicConfig} />
        </Card>
      );
    case 'Area':
      return (
        <Card className="rounded" size="small" title={title} extra={`${updatedAtText} ${formatDate(updatedAt)}`}>
          <Area {...graphicConfig} />
        </Card>
      );
    case 'Pie':
      return (
        <Card className="rounded" size="small" title={title} extra={`${updatedAtText} ${formatDate(updatedAt)}`}>
          <Pie {...graphicConfig} />
        </Card>
      );
    case 'Bar':
      return (
        <Card className="rounded" size="small" title={title} extra={`${updatedAtText} ${formatDate(updatedAt)}`}>
          <Bar {...graphicConfig} />
        </Card>
      );
    case 'Rose':
      return (
        <Card className="rounded" size="small" title={title} extra={`${updatedAtText} ${formatDate(updatedAt)}`}>
          <Rose {...graphicConfig} />
        </Card>
      );
    default:
      return (
        <Card className="rounded" size="small" title="No data">
          <h1>{t('No data')}</h1>
        </Card>
      );
  }
};

export default memo(OneGraphic);
