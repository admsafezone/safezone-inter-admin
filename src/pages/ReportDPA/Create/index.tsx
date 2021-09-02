import { FC, ReactElement, useEffect, useState } from 'react';
import { Col, Collapse, Form, Input, message, Modal, Row, Typography, Select, Switch } from 'antd/es';
import { AuditOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { OneButton, OneLoader } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { checkACL } from 'utils/AclUtils';
import { Report } from 'interfaces';
import './style.less';

const { Title } = Typography;
const { Panel } = Collapse;

interface ArticleCreateProps {
  report?: Report;
  visible: boolean;
  setVisible(status: boolean): void;
  setReport(report?: Report): void;
  reload(reload: boolean): void;
}

const ReportCreate: FC<ArticleCreateProps> = (props: ArticleCreateProps): ReactElement => {
  const { visible, setVisible, report, setReport, reload } = props;
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState('panel-0');
  const [form] = Form.useForm();
  const { api, acl, permissions } = Constants;

  const save = async () => {
    try {
      const data = await form.validateFields();
      setLoading(true);
      let result;

      if (report) {
        const dataPut: any = {};
        const keys = Object.keys(data);

        for (const key of keys) {
          if (!['', undefined].includes(data[key])) {
            dataPut[key] = data[key];
          }
        }

        result = await defaultService.put(`${api.REPORTS}/${report._id}`, dataPut);
      } else {
        result = await defaultService.post(api.REPORTS, data);
      }

      if (result.error && result.error.length) {
        result.error.map((err) => message.error(err));
      } else {
        const successMessage = report ? t('Report updated successfuly') : t('New user registred successfuly');
        message.success(successMessage);
        setIsSaved(true);
        reload(true);

        setTimeout(() => setVisible(false), 500);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsSaved(false);
    form.resetFields();

    if (report) {
      const reportToEdit = { ...report };
      form.setFieldsValue(reportToEdit);
    }
  }, [visible, report]);

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <AuditOutlined /> {report ? t('Edit report') : t('New report')}
          </Title>
        }
        width={'60vw'}
        visible={visible}
        style={{ top: 20 }}
        onCancel={() => {
          setReport(undefined);
          setVisible(false);
          reload(isSaved);
        }}
        onOk={() => save()}
        okButtonProps={{ loading, disabled: loading }}
        className="modal-report"
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col md={16}>
              <Form.Item
                label={t('Name')}
                name="name"
                required
                rules={[{ required: true, message: t('Please type the report name') }]}
              >
                <Input placeholder={t('Type the report name')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Code')}
                name="code"
                required
                rules={[{ required: true, message: t('Please type the report code') }]}
              >
                <Input placeholder={t('Type the report code')} />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item
                label={t('Description')}
                name="description"
                required
                rules={[{ required: true, message: t('Please type the report description') }]}
              >
                <Input.TextArea placeholder={t('Type the report description')} rows={3} />
              </Form.Item>
            </Col>

            <Col md={24}>
              <h2>{t('Sheets')}</h2>

              <Form.List name={['pipelines']}>
                {(fields, { add, remove }) => (
                  <>
                    <Collapse
                      defaultActiveKey={activeKey}
                      activeKey={activeKey}
                      onChange={(value) => setActiveKey(`${value}`)}
                      accordion
                    >
                      {fields.map((field) => (
                        <Panel
                          header={`${t('Sheet')} #${field.fieldKey}`}
                          key={`panel-${field.fieldKey}`}
                          extra={
                            <OneButton
                              type="link"
                              icon={<MinusCircleOutlined />}
                              style={{ color: 'red', padding: 0, height: '0' }}
                              onClick={() => remove(field.name)}
                            >
                              {t('Remove')}
                            </OneButton>
                          }
                        >
                          <Row gutter={24}>
                            <Col span={8}>
                              <Form.Item
                                label={t('Sheet name')}
                                name={[field.name, 'name']}
                                required
                                rules={[{ required: true, message: t('Sheet name is required') }]}
                              >
                                <Input placeholder={t('Type the sheet name')} />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label={t('Collection')}
                                name={[field.name, 'model']}
                                required
                                rules={[{ required: true, message: t('Sheet collection is required') }]}
                              >
                                <Input placeholder={t('Type the collection model')} />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label={t('Query type')}
                                name={[field.name, 'type']}
                                required
                                rules={[{ required: true, message: t('Query type is required') }]}
                              >
                                <Select>
                                  <Select.Option value="find">find</Select.Option>
                                  <Select.Option value="aggregate">aggregate</Select.Option>
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col span={24}>
                              <Form.Item label={t('Query select')} name={[field.name, 'select']}>
                                <Input placeholder={t('Type the query select')} />
                              </Form.Item>
                            </Col>

                            <Col span={24}>
                              <Form.Item label={t('Query')} name={[field.name, 'query']}>
                                <Input.TextArea placeholder={t('Type the sheet query')} rows={10} />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Panel>
                      ))}
                    </Collapse>

                    <Form.Item className="list-add">
                      <OneButton type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                        {t('Add sheet')}
                      </OneButton>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>

            {checkACL(acl.REPORTS, permissions.F) && (
              <Col md={24}>
                <Form.Item label={t('Replicate for all companies')} name="replicate">
                  <Switch />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ReportCreate;
