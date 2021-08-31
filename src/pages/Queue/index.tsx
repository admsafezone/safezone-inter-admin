import { FC } from 'react';
import { Layout } from 'antd/es';
import { OnePageTitle } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import './style.less';

const { Content } = Layout;

const Queue: FC = (): JSX.Element => {
  const { t } = useAppContext();
  const url = `${process.env.REACT_APP_API_ROOT}/api/${Constants.api.QUEUES}/queue/sendMail`;

  return (
    <>
      <OnePageTitle title={t('Queues')} />

      <Content>
        <iframe className="one-queue-iframe" src={url}></iframe>
      </Content>
    </>
  );
};

export default Queue;
