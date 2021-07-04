import { FC, ReactElement } from 'react';
import { Card } from 'antd';
import './style.less';

interface Results {
  total: number;
}

interface Props {
  title: string;
  count: number;
  results: Results;
  className?: string;
  children?: any;
}

const OneCard: FC<Props> = (props: Props): ReactElement => {
  return (
    <Card className={`dashboard-card`}>
      <div className={`dashboard-card-icon ${props.className}`}>{props.children}</div>
      <div className="dashboard-card-info">
        <h3>{props?.title}</h3>
      </div>
      <div className="dashboard-card-value">{props?.results?.total || 0}</div>
    </Card>
  );
};

export default OneCard;
