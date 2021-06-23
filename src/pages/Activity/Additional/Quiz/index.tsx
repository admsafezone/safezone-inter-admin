import { FC, useState } from 'react';
import { Button, Collapse, Col, Form, Input, Row, Switch } from 'antd/es';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { OneUploadInput, OneTextEditor, OneSelect } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';
import './style.less';

const { Panel } = Collapse;

interface QuizProps {
  data?: any;
  updateField(key: string, value?: string): void;
  setGaleryVisible(visible: boolean): void;
}

const Quiz: FC<QuizProps> = ({ updateField, setGaleryVisible }: QuizProps) => {
  const { t } = useAppContext();
  const [activeKey, setActiveKey] = useState('panel-0');
  let lastKeyCount = 0;
  const questionTypes = [
    { name: 'text-image' },
    { name: 'left-image' },
    { name: 'top-image' },
    { name: 'only-text' },
    { name: 'only-image' },
  ];

  return (
    <>
      <Col md={24}>
        <Form.Item label={t('Quiz title')} name={['data', 'title']}>
          <Input placeholder={t('Type the quiz title')} />
        </Form.Item>
      </Col>

      <Col md={24}>
        <Form.Item label={t('Quiz header text')} name={['data', 'header']}>
          <OneTextEditor
            placeholder={t('Header text')}
            contentStyle={{ border: '1px solid #d9d9d9', borderRadius: '2px', height: '400px' }}
          />
        </Form.Item>
      </Col>

      <h2 style={{ borderBottom: '1px dashed #ccc' }}>{t('Questions')}</h2>

      <Form.List name={['data', 'questions']}>
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
                    header={t('Question') + ': #' + `${field.fieldKey + 1}`}
                    key={`panel-${field.fieldKey}`}
                    className="one-quiz-panel"
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
                    <Row gutter={24}>
                      <Col span={18}>
                        <Row gutter={24}>
                          <Col span={18}>
                            <Form.Item
                              label={t('Question title')}
                              name={[field.name, 'title']}
                              required
                              rules={[{ required: true, message: 'Question title is required' }]}
                            >
                              <Input placeholder={t('Type the question title')} />
                            </Form.Item>
                          </Col>

                          <Col span={6}>
                            <Form.Item label={t('Question type')} name={[field.name, 'type']}>
                              <OneSelect
                                dataItems={questionTypes}
                                labelAttr="name"
                                valueAttr="name"
                                showArrow
                                placeholder={t('Select the question type')}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label={t('Question text')} name={[field.name, 'text']}>
                          <Input.TextArea placeholder={t('Type the question text')} rows={4} />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item label={t('Question image')} name={[field.name, 'image']}>
                          <OneUploadInput updateField={updateField} setGaleryVisible={setGaleryVisible} />
                        </Form.Item>
                      </Col>

                      <Col span={18}>
                        <Row gutter={24}>
                          <Col span={18}>
                            <Form.Item label={t('Question feedback title')} name={[field.name, 'feedbackTitle']}>
                              <Input placeholder={t('Type the question feedback title')} />
                            </Form.Item>
                          </Col>

                          <Col span={6}>
                            <Form.Item label={t('Question score')} name={[field.name, 'score']}>
                              <Input type="number" placeholder={t('Type the question score')} />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item label={t('Question feedback text')} name={[field.name, 'feedbackText']}>
                          <Input.TextArea placeholder={t('Type the question feedback text')} rows={4} />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item label={t('Question feedback image')} name={[field.name, 'feedbackImage']}>
                          <OneUploadInput updateField={updateField} setGaleryVisible={setGaleryVisible} />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.List name={[field.name, 'options']}>
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((optionField) => {
                                return (
                                  <Row key={`option-${optionField.fieldKey}`} gutter={24}>
                                    <Col span={24}>
                                      <h3 className="one-quiz-options-title">
                                        {t('Option') + ': #' + `${optionField.key + 1}`}
                                        <Button
                                          type="link"
                                          icon={<MinusCircleOutlined />}
                                          style={{ float: 'right', color: 'red' }}
                                          onClick={() => remove(optionField.name)}
                                        >
                                          {t('Remove option')}
                                        </Button>
                                      </h3>
                                    </Col>

                                    <Col span={10}>
                                      <Form.Item
                                        label={t('Option text')}
                                        name={[optionField.name, 'text']}
                                        required
                                        rules={[{ required: true, message: 'Option text is required' }]}
                                      >
                                        <Input placeholder={t('Type the option text')} />
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item label={t('Option icon')} name={[optionField.name, 'icon']}>
                                        <Input placeholder={t('Type the option icon')} />
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item
                                        label={t('Right option')}
                                        name={[optionField.name, 'right']}
                                        valuePropName="checked"
                                      >
                                        <Switch />
                                      </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                      <Form.Item label={t('Option image')} name={[optionField.name, 'image']}>
                                        <OneUploadInput updateField={updateField} setGaleryVisible={setGaleryVisible} />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                );
                              })}

                              <Form.Item className="list-add">
                                <Button type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                                  {t('Add option')}
                                </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                      </Col>
                    </Row>
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
                {t('Add question')}
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
                        className="one-quiz-panel"
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

export default Quiz;
