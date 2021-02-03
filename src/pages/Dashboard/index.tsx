import { FC, useContext } from 'react';
import Layout from 'antd/es/layout';
import AppContext from 'contexts/AppContext';

const { Content } = Layout;

const Dashboard: FC = (props): JSX.Element => {
  const { t } = useContext(AppContext);
  return <Content {...props}>{t('Welcome')}</Content>;
};

export default Dashboard;
