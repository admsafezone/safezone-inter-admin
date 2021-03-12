import { FC } from 'react';
import Layout from 'antd/es/layout';
import { useAppContext } from 'providers/AppProvider';
import OneCard from '../../components/atoms/OneCard';
import { Row, Col, Collapse } from 'antd/es';
import './style.less';

import todoTasks from "../../assets/todo-tasks.svg";
import overdueTasks from "../../assets/overdue-tasks.svg";
import totalTasks from "../../assets/total-tasks.svg";
import completedTasks from "../../assets/completed-tasks.svg";


const { Content } = Layout;
const { Panel } = Collapse;
const data = {
  count: 34,
  value: -25,
}

const users = [
  {
    id: 1,
    name: "Robson",
    info: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum"
  },
  {
    id: 2,
    name: "João",
    info: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum"
  },
  {
    id: 3,
    name: "Maria",
    info: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia ab omnis, sapiente perspiciatis optio velit debitis? Aspernatur dolores perferendis dolorum impedit. Fugiat enim voluptatem totam asperiores omnis explicabo dolorum rerum"
  }
]

const Dashboard: FC = (props): JSX.Element => {
  const { t } = useAppContext();
  return (
    <Content {...props} className="one-page-dashboard">
      <Row gutter={24}>
        <Col span={18}>
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
        </Col>
        <Col span={6}>
          <Collapse defaultActiveKey={['1']} onChange={() => { }}>
            {users.map(user => (
              <Panel header={user.name} key={user.id}>
                <p>{user.info}</p>
              </Panel>
            ))}
          </Collapse>
        </Col>
      </Row>


    </Content>
  );
};

export default Dashboard;
