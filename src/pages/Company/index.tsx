import { FC } from 'react';
import Layout from 'antd/es/layout';
import { useAppContext } from 'providers/AppProvider';

const { Content } = Layout;

const Company: FC = (props): JSX.Element => {
  const { t } = useAppContext();
  return <Content {...props}>{t('Welcome')}</Content>;
};

export default Company;
