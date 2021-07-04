import { FC, ReactElement } from 'react';
import { Card } from 'antd';
import { useAppContext } from 'providers/AppProvider';
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
  const { t } = useAppContext();
  return (
    <Card className={`dashboard-card`}>
      <div className={`dashboard-card-icon ${props.className}`}>{props.children}</div>
      <div className="dashboard-card-info">
        <h3>{props?.title || `${t('Loading')}...`}</h3>
      </div>
      <div className="dashboard-card-value">{props?.results?.total || 0}</div>
    </Card>
  );
};

export default OneCard;
