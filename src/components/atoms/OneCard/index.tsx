import { FC, ReactElement } from 'react';
import { Card } from 'antd';
import './style.less';

interface Props {
    title: string;
    count: number;
    value: number;
    icon: ReactElement;
}

const OneCard: FC<Props> = (props: Props): ReactElement => {
    return (
        <Card className="dashboard-card">
            <div className="dashboard-card-icon">{props.icon}</div>
            <div className="dashboard-card-info">
                <span>{props.title}</span>
                <strong>{props.count}</strong>
            </div>
            <div className="dashboard-card-value">
                <span>{props.value}%</span>
            </div>
        </Card>
        // <h1>{JSON.stringify(props)}</h1>
        // <Card>

        //     <Statistic
        //         loading={false}
        //         title={props.title}
        //         value={props.value}
        //         precision={0}
        //         valueStyle={{ color: props.color }}
        //         prefix={props.icon}
        //         suffix=""
        //     />
        //     {/* <h3>{props.count}</h3> */}
        // </Card>
    );
};

export default OneCard;
