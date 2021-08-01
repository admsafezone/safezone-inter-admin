import { FC, useState, useEffect } from 'react';
import Layout from 'antd/es/layout';
import { Row, Col, Collapse } from 'antd/es';
import { DownOutlined, CommentOutlined, UsergroupAddOutlined, UserOutlined, ScheduleOutlined } from '@ant-design/icons';

import { useAppContext } from 'providers/AppProvider';
import OneCard from 'components/atoms/OneCard';
import OneReportItem from 'components/atoms/OneReportItem';

import { ReportDashboard } from 'interfaces/Report';
import defaultService from 'services/defaultService';

import OneGraphic from 'components/atoms/OneGraphic';
import { OnePageTitle } from 'components/atoms';
import './style.less';

const { Content } = Layout;
const { Panel } = Collapse;

const Dashboard: FC = (props): JSX.Element => {
  const [reports, setReports] = useState<ReportDashboard[]>([]);
  const [activityParticipation, setActivityParticipation] = useState<any>(null);
  const [activityByDay, setActivityByDay] = useState<any>(null);
  const [infringements, setInfringements] = useState<any>([]);
  const [totals, setTotals] = useState<any>({});

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

  async function getInfringements() {
    const graphicData = await defaultService.get('/dashboard/infringements');
    setInfringements(graphicData);
  }

  async function getGraphicTotals() {
    const graphicsToGet = [
      '/dashboard/active-users',
      '/dashboard/total-subscribers',
      '/dashboard/total-activities',
      '/dashboard/total-comments',
    ];

    const promises = graphicsToGet.map((url) => defaultService.get(url, {}));
    const [users, subscribers, activities, comments]: any = await Promise.all(promises);
    setTotals({ users, subscribers, activities, comments });
  }

  useEffect(() => {
    getReports();
    getGraphicActivityParticipation();
    getGraphicActivityByDay();
    getGraphicTotals();
    getInfringements();
  }, []);

  const { t } = useAppContext();

  return (
    <>
      <OnePageTitle title={t('Dashboard')} />

      <Content {...props} className="one-page-dashboard">
        <Row gutter={16}>
          <Col span={18} lg={18} md={24} sm={24} xs={24}>
            <Row gutter={16}>
              <Col span={6} lg={6} md={12} sm={24} xs={24}>
                <OneCard className="total" {...totals.users}>
                  <UserOutlined
                    style={{
                      fontSize: '1.8em',
                      color: '#4791ff',
                      backgroundColor: '#e0ecff',
                      padding: '10px',
                      borderRadius: '10px',
                    }}
                  />
                </OneCard>
              </Col>
              <Col span={6} lg={6} md={12} sm={24} xs={24}>
                <OneCard className="todo" {...totals.subscribers}>
                  <UsergroupAddOutlined
                    style={{
                      fontSize: '1.8em',
                      color: '#eebb04',
                      backgroundColor: '#fff9e1',
                      padding: '10px',
                      borderRadius: '10px',
                    }}
                  />
                </OneCard>
              </Col>
              <Col span={6} lg={6} md={12} sm={24} xs={24}>
                <OneCard className="overdue" {...totals.activities}>
                  <ScheduleOutlined
                    style={{
                      fontSize: '1.8em',
                      color: '#ff2366',
                      backgroundColor: '#ffdae5',
                      padding: '10px',
                      borderRadius: '10px',
                    }}
                  />
                </OneCard>
              </Col>
              <Col span={6} lg={6} md={12} sm={24} xs={24}>
                <OneCard className="completed" {...totals.comments}>
                  <CommentOutlined
                    style={{
                      fontSize: '1.8em',
                      color: '#02bc77',
                      backgroundColor: '#d4f4e8',
                      padding: '10px',
                      borderRadius: '10px',
                    }}
                  />
                </OneCard>
              </Col>
            </Row>

            <Row style={{ marginTop: 16 }} gutter={16}>
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
              <dt className="report-list__title">{t('Reports')}</dt>
              <dd className="report-list__items">
                {reports.map((report) => (
                  <OneReportItem key={report._id} {...report} />
                ))}
              </dd>
            </dl>

            <dl className="rounded infringement-list">
              <dt className="infringement-list__title">{infringements?.title || t('Infringements')}</dt>
              <dd className="infringement-list__items">
                <Collapse
                  accordion
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <DownOutlined rotate={isActive ? 0 : -90} style={{ color: '#CF0000' }} />
                  )}
                >
                  {infringements?.results?.map((infringement) => (
                    <Panel
                      header={
                        <Row>
                          <Col span={18}>{infringement.user}</Col>
                          <Col span={6} style={{ textAlign: 'right' }}>
                            {t('Total')}: {infringement.total}
                          </Col>
                        </Row>
                      }
                      key={infringement.id}
                    >
                      <strong>{t('Infringement type')}:</strong>
                      <ol>
                        {infringement.descriptions &&
                          infringement.descriptions.map((desc, key) => <li key={key}>{desc}</li>)}
                      </ol>
                      <p>
                        {t('Last infringement')}: {new Date(infringement.lastDate).toLocaleString('pt-BR')}
                      </p>
                    </Panel>
                  ))}
                </Collapse>
              </dd>
              <dt className="infringement-list__footer">{`${t('Updated At')} ${new Date(
                infringements?.updatedAt || new Date(),
              ).toLocaleString('pt-BR')}`}</dt>
            </dl>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Dashboard;
