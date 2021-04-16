import { FC, useState } from 'react';
import { Button, Collapse, Col, Form, Input, Row, Select } from 'antd/es';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { OneUploadInput, OneTextEditor } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';
import './style.less';

const { Panel } = Collapse;

interface TestProps {
  data?: any;
  updateField(key: string, value?: string): void;
  setGaleryVisible(visible: boolean): void;
}

const Test: FC<TestProps> = ({ data, updateField, setGaleryVisible }: TestProps) => {
  const { t } = useAppContext();
  const [activeKey, setActiveKey] = useState('panel-0');
  const [testType, setTestType] = useState(data?.type || 'Questions');
  const testNameSingular = testType.substring(0, testType.length - 1);
  let lastKeyCount = 0;

  const getFormByType = (field) => {
    switch (testType) {
      case 'Checks':
        return (
          <Row gutter={24}>
            <Col span={10}>
              <Form.Item
                label={t('Check name')}
                name={[field.name, 'name']}
                required
                rules={[{ required: true, message: 'Check name is required' }]}
              >
                <Input placeholder={t('Type the check name')} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label={t('Check description')}
                name={[field.name, 'description']}
                required
                rules={[{ required: true, message: 'Check description is required' }]}
              >
                <Input placeholder={t('Type the check description')} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label={t('Check level')}
                name={[field.name, 'level']}
                required
                rules={[{ required: true, message: 'Check level is required' }]}
              >
                <Input placeholder={t('Type the check level')} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t('Check pattern')}
                name={[field.name, 'pattern']}
                required
                rules={[{ required: true, message: 'Check pattern is required' }]}
              >
                <Input placeholder={t('Type the pattern')} />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                label={t('Check message')}
                name={[field.name, 'message']}
                required
                rules={[{ required: true, message: 'Check message is required' }]}
              >
                <Input placeholder={t('Type the message')} />
              </Form.Item>
            </Col>
          </Row>
        );

      case 'Questions':
      default:
        return (
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={t('Question text')}
                name={[field.name, 'text']}
                required
                rules={[{ required: true, message: 'Question text is required' }]}
              >
                <Input placeholder={t('Type the question text')} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label={t('Question pattern')} name={[field.name, 'pattern']}>
                <Input placeholder={t('Type the pattern')} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label={t('Question answer')} name={[field.name, 'answer']}>
                <Input placeholder={t('Type the answer')} />
              </Form.Item>
            </Col>
          </Row>
        );
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col md={6}>
          <Form.Item label={t('Test type')} name={['data', 'type']}>
            <Select onSelect={(value) => setTestType(`${value}`)} defaultValue={testType}>
              <Select.Option value="Questions">{t('Questions')}</Select.Option>
              <Select.Option value="Checks">{t('Ckecks')}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col md={18}>
          <Form.Item label={t('Test title')} name={['data', 'title']}>
            <Input placeholder={t('Type the test title')} />
          </Form.Item>
        </Col>

        <Col md={24}>
          <Form.Item label={t('Test header text')} name={['data', 'header']}>
            <OneTextEditor
              placeholder={t('Header text')}
              contentStyle={{ border: '1px solid #d9d9d9', borderRadius: '2px', height: '400px' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <h2 style={{ borderBottom: '1px dashed #ccc' }}>{t(testType)}</h2>

      <Form.List name={['data', testType.toLowerCase()]}>
        {(fields, { add, remove }) => (
          <>
            <Collapse
              defaultActiveKey={activeKey}
              activeKey={activeKey}
              onChange={(value) => setActiveKey(`${value}`)}
              accordion
            >
              {fields.map((field) => {
                lastKeyCount = field.fieldKey;

                return (
                  <Panel
                    header={t(testNameSingular) + ': #' + `${field.fieldKey + 1}`}
                    key={`panel-${field.fieldKey}`}
                    className="one-test-panel"
                    extra={
                      <Button
                        type="link"
                        icon={<MinusCircleOutlined />}
                        style={{ color: 'red', padding: 0, height: '0' }}
                        onClick={() => remove(field.name)}
                      >
                        {t('Remove')}
                      </Button>
                    }
                  >
                    {getFormByType(field)}
                  </Panel>
                );
              })}
            </Collapse>

            <Form.Item className="list-add">
              <Button
                type="primary"
                style={{ marginTop: '24px', float: 'right' }}
                onClick={() => {
                  add();
                  setActiveKey(`panel-${lastKeyCount + 1}`);
                }}
                icon={<PlusOutlined />}
              >
                {t(`Add ${testNameSingular.toLowerCase()}`)}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <h2 style={{ borderBottom: '1px dashed #ccc' }}>{t('Feedbacks')}</h2>

      <Row gutter={24}>
        <Col span={24}>
          <Form.List name={['data', 'feedbacks']}>
            {(fields, { add, remove }) => (
              <>
                <Collapse
                  defaultActiveKey={activeKey}
                  activeKey={activeKey}
                  onChange={(value) => setActiveKey(`${value}`)}
                  accordion
                >
                  {fields.map((field) => {
                    return (
                      <Panel
                        header={t('Feedback') + ': #' + `${field.fieldKey + 1}`}
                        key={`panel-feedback-${field.fieldKey}`}
                        className="one-test-panel"
                        extra={
                          <Button
                            type="link"
                            icon={<MinusCircleOutlined />}
                            style={{ color: 'red', padding: 0, height: '0' }}
                            onClick={() => remove(field.name)}
                          >
                            {t('Remove')}
                          </Button>
                        }
                      >
                        <Row key={`option-${field.fieldKey}`} gutter={24}>
                          <Col span={18}>
                            <Row gutter={24}>
                              <Col span={6}>
                                <Form.Item label={t('Feedback type')} name={[field.name, 'type']}>
                                  <Input placeholder={t('Type the feedback type')} />
                                </Form.Item>
                              </Col>
                              <Col span={18}>
                                <Form.Item label={t('Feedback title')} name={[field.name, 'title']}>
                                  <Input placeholder={t('Type the feedback title')} />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item label={t('Feedback text')} name={[field.name, 'text']}>
                              <Input.TextArea placeholder={t('Type the feedback text')} rows={4} />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item label={t('Feedback image')} name={[field.name, 'image']}>
                              <OneUploadInput updateField={updateField} setGaleryVisible={setGaleryVisible} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Panel>
                    );
                  })}
                </Collapse>

                <Form.Item className="list-add">
                  <Button
                    type="primary"
                    onClick={() => {
                      add();
                      setActiveKey(`panel-feedback-${lastKeyCount + 1}`);
                    }}
                    icon={<PlusOutlined />}
                    style={{ marginTop: '24px', float: 'right' }}
                  >
                    {t('Add feedback')}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    </>
  );
};

export default Test;
