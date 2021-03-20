import { FC } from 'react';
import Collapse from 'antd/es/collapse';
import Quiz from './Quiz';
import Test from './Test';

const { Panel } = Collapse;

interface AdditionalProps {
  type: string;
  updateField(key: string, value?: string): void;
  setGaleryVisible(visible: boolean): void;
  data?: any;
}

const AdditionalData: FC<AdditionalProps> = ({ type, data, updateField, setGaleryVisible }: AdditionalProps) => {
  switch (type) {
    case 'quiz':
      return (
        <Collapse defaultActiveKey={'1'}>
          <Panel header="Quiz configurations" key="1">
            <Quiz data={data} updateField={updateField} setGaleryVisible={setGaleryVisible} />
          </Panel>
        </Collapse>
      );

    case 'test':
      return (
        <Collapse defaultActiveKey={'1'}>
          <Panel header="Quiz configurations" key="1">
            <Test data={data} updateField={updateField} setGaleryVisible={setGaleryVisible} />
          </Panel>
        </Collapse>
      );

    default:
      return <div></div>;
  }
};

export default AdditionalData;
