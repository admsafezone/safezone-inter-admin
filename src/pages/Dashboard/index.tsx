import { FC } from 'react';
import Layout from 'antd/es/layout';
import { useAppContext } from 'providers/AppProvider';
import OneCard from '../../components/atoms/OneCard';
import ReconciliationOutlined from '@ant-design/icons/ReconciliationOutlined';
import ExceptionOutlined from '@ant-design/icons/ExceptionOutlined';
import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import { Row, Col } from 'antd/es';
import './style.less';

const { Content } = Layout;

const data = {
  count: 34,
  value: -25,
}

const Dashboard: FC = (props): JSX.Element => {
  const { t } = useAppContext();
  return (
    <Content {...props} className="one-page-dashdorad">
      {t('Welcome')}
      <Row gutter={[16, 16]}>
        <Col span={6} lg={6} md={12} sm={24} xs={24}>
          <OneCard title={t('Total Tasks')} icon={<ReconciliationOutlined />} {...data} />
        </Col>
        <Col span={6} lg={6} md={12} sm={24} xs={24}>
          <OneCard title={t('Tasks to do')} icon={<ExceptionOutlined />} {...data} />
        </Col>
        <Col span={6} lg={6} md={12} sm={24} xs={24}>
          <OneCard title={t('Tasks Overdue')} icon={<FileDoneOutlined />} {...data} />
        </Col>
        <Col span={6} lg={6} md={12} sm={24} xs={24}>
          <OneCard title={t('Completed Tasks')} icon={<ContactsOutlined />} {...data} />
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;
