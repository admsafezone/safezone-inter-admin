import { FC } from 'react';
import Layout from 'antd/es/layout';
import { useAppContext } from 'providers/AppProvider';

const { Content } = Layout;

const Dashboard: FC = (props): JSX.Element => {
  const { t } = useAppContext();
  return <Content {...props}>{t('Welcome')}</Content>;
};

export default Dashboard;
