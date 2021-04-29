import { FC, useState, useEffect } from 'react';
import Layout from 'antd/es/layout';
import { Row, Col, Collapse } from 'antd/es';
import { DownOutlined } from '@ant-design/icons';

import { useAppContext } from 'providers/AppProvider';
import OneCard from '../../components/atoms/OneCard';
import OneReportItem from '../../components/atoms/OneReportItem';

import todoTasks from '../../assets/todo-tasks.svg';
import overdueTasks from '../../assets/overdue-tasks.svg';
import totalTasks from '../../assets/total-tasks.svg';
import completedTasks from '../../assets/completed-tasks.svg';

import { ReportDashboard } from '../../interfaces/Report';
import defaultService from 'services/defaultService';

import './style.less';
import OneGraphic from 'components/atoms/OneGraphic';

const { Content } = Layout;
const { Panel } = Collapse;
const data = {
  count: 34,
  value: -25,
};

const users = [
  {
    id: 1,
    name: 'Robson',
    info:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum',
  },
  {
    id: 2,
    name: 'João',
    info:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum',
  },
  {
    id: 3,
    name: 'Maria',
    info:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum',
  },
  {
    id: 4,
    name: 'Maria',
    info:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum',
  },
  {
    id: 5,
    name: 'Maria',
    info:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum',
  },
  {
    id: 6,
    name: 'Maria',
    info:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum',
  },
];

const Dashboard: FC = (props): JSX.Element => {
  const [reports, setReports] = useState<ReportDashboard[]>([]);
  const [activityParticipation, setActivityParticipation] = useState<any>(null);
  const [activityByDay, setActivityByDay] = useState<any>(null);

  useEffect(() => {
    async function getReports() {
      const reports = await defaultService.get('/reports/dashboard', []);
      setReports(reports);
    }
    async function getGraphicActivityParticipation() {
      const graphicData = await defaultService.get('/dashboard/activity-participation', []);
      setActivityParticipation(graphicData);
    }
    async function getGraphicActivityByDay() {
      const graphicData = await defaultService.get('/dashboard/activity-by-day', []);
      setActivityByDay(graphicData);
    }
    getReports();
    getGraphicActivityParticipation();
    getGraphicActivityByDay();
  }, []);

  const { t } = useAppContext();
  return (
    <Content {...props} className="one-page-dashboard">
      <Row gutter={[16, 16]}>
        <Col span={18} lg={18} md={24} sm={24} xs={24}>
          <Row gutter={[16, 16]}>
            <Col span={6} lg={6} md={12} sm={24} xs={24}>
              <OneCard className="total" title={t('Total Tasks')} {...data}>
                <img src={totalTasks} />
              </OneCard>
            </Col>
            <Col span={6} lg={6} md={12} sm={24} xs={24}>
              <OneCard className="todo" title={t('Tasks to do')} {...data}>
                <img src={todoTasks} />
              </OneCard>
            </Col>
            <Col span={6} lg={6} md={12} sm={24} xs={24}>
              <OneCard className="overdue" title={t('Tasks Overdue')} {...data}>
                <img src={overdueTasks} />
              </OneCard>
            </Col>
            <Col span={6} lg={6} md={12} sm={24} xs={24}>
              <OneCard className="completed" title={t('Completed Tasks')} {...data}>
                <img src={completedTasks} />
              </OneCard>
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
            <Col span={12} md={12} sm={24} xs={24}>
              <OneGraphic {...activityParticipation} />
            </Col>
            <Col span={12} md={12} sm={24} xs={24}>
              <OneGraphic {...activityByDay} />
            </Col>
          </Row>
        </Col>
        <Col span={6} lg={6} md={24} sm={24} xs={24}>
          <dl className="report-list rounded">
            <dt className="report-list__title">{t('Relatórios')}</dt>
            <dd className="report-list__items">
              {reports.map((report) => (
                <OneReportItem key={report._id} {...report} />
              ))}
            </dd>
          </dl>
          <dl className="rounded infringement-list">
            <dt className="infringement-list__title">{t('Infrações')}</dt>
            <dd className="infringement-list__items">
              <Collapse
                accordion
                bordered={false}
                expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 0 : -90} style={{ color: '#CF0000' }} />}
              >
                {users.map((user) => (
                  <Panel className="" header={user.name} key={user.id}>
                    <p>{user.info}</p>
                  </Panel>
                ))}
              </Collapse>
            </dd>
            <dt className="infringement-list__footer">{`Atualização realizada em ${new Date().toLocaleString()}`}</dt>
          </dl>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;
