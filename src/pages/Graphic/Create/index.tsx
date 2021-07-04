import { FC, ReactElement, useEffect, useState } from 'react';
import { Col, Form, Input, message, Modal, Row, Typography, Select, Switch } from 'antd/es';
import { PlusOutlined, MinusCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { OneLoader, OneSelect, OneButton } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { Graphic } from 'interfaces';
import './style.less';

const { Title } = Typography;

interface GraphicCreateProps {
  graphic?: Graphic;
  visible: boolean;
  setVisible(status: boolean): void;
  setGraphic(graphic?: Graphic): void;
  reload(reload: boolean): void;
}

const GraphicCreate: FC<GraphicCreateProps> = (props: GraphicCreateProps): ReactElement => {
  const { visible, setVisible, graphic, setGraphic, reload } = props;
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { api } = Constants;

  const save = async () => {
    try {
      const data = await form.validateFields();
      setLoading(true);
      let result;

      if (graphic) {
        if (!data.excludedCompanies.length) {
          data.excludedCompanies = null;
        }
        result = await defaultService.put(`${api.GRAPHICS}/${graphic._id}`, data);
      } else {
        result = await defaultService.post(api.GRAPHICS, data);
      }

      if (result.error && result.error.length) {
        result.error.map((err) => message.error(err));
      } else {
        const successMessage = graphic ? t('Graphic updated successfuly') : t('New graphic registred successfuly');
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
    if (visible) form.resetFields();

    if (graphic) {
      const graphicEdit = { ...graphic };
      graphicEdit.excludedCompanies = graphic.excludedCompanies?.map((company) => company._id) || [];
      form.setFieldsValue(graphicEdit);
    }
  }, [visible, graphic]);

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <BarChartOutlined /> {graphic ? t('Edit graphic') : t('New graphic')}
          </Title>
        }
        width={'60vw'}
        visible={visible}
        style={{ top: 20 }}
        onCancel={() => {
          setGraphic(undefined);
          setVisible(false);
          reload(isSaved);
        }}
        onOk={() => save()}
        okButtonProps={{ loading, disabled: loading }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            queryType: 'find',
            active: true,
          }}
        >
          <Row gutter={24}>
            <Col md={12}>
              <Form.Item
                label={t('Title')}
                name="title"
                required
                rules={[{ required: true, message: t('Please type the graphic title') }]}
              >
                <Input placeholder={t('Type the graphic title')} />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                label={t('Code')}
                name="code"
                required
                rules={[{ required: true, message: t('Please type the graphic code') }]}
              >
                <Input placeholder={t('Type the graphic code')} />
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                label={t('Type')}
                name="type"
                required
                rules={[{ required: true, message: t('Please select the graphic type') }]}
              >
                <OneSelect
                  apiURL={`${api.PARAMS}/graphictype?select=name`}
                  labelAttr="name"
                  valueAttr="name"
                  showArrow
                  noDefaultOption
                  useCache
                  placeholder={t('Select')}
                />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label={t('Description')} name="description">
                <Input.TextArea placeholder={t('Graphic description')} rows={3} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Model')}
                name="model"
                required
                rules={[{ required: true, message: t('Please type the collection to query') }]}
              >
                <Input placeholder={t('Collection.model')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Query type')}
                name="queryType"
                required
                rules={[{ required: true, message: t('Please select the query type') }]}
              >
                <OneSelect
                  dataItems={[{ name: 'find' }, { name: 'aggregate' }, { name: 'count' }]}
                  labelAttr="name"
                  valueAttr="name"
                  showArrow
                  noDefaultOption
                />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label={t('Query select')} name="select">
                <Input placeholder={t('For find: name value createdAt')} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t('Query')}
                name="query"
                required
                rules={[{ required: true, message: t('Please type the query') }]}
              >
                <Input.TextArea placeholder={t('Graphic query object for aggregate type, default: {}')} rows={15} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label={t('Graphic frontend configutations object')} name="configs">
                <Input.TextArea placeholder={t('Graphic configurations for frontend')} rows={15} />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label={t('Graphic data result path')} name="resultPath">
                <Input placeholder={t('Graphic result path: result.data')} />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.List name={'variables'}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Row gutter={24} key={field.fieldKey}>
                        <Col md={9}>
                          <Form.Item
                            {...field}
                            label={t('Variable path')}
                            name={[field.name, 'path']}
                            key={`${field.fieldKey}-path`}
                            rules={[{ required: true, message: t('Variable path is required') }]}
                          >
                            <Input placeholder={t('Variable path')} />
                          </Form.Item>
                        </Col>
                        <Col md={9}>
                          <Form.Item
                            {...field}
                            label={t('Variable value')}
                            name={[field.name, 'value']}
                            key={`${field.fieldKey}-value`}
                            rules={[{ required: true, message: t('Variable value is required') }]}
                          >
                            <Input placeholder={t('Variable value or function')} />
                          </Form.Item>
                        </Col>
                        <Col md={5}>
                          <Form.Item
                            {...field}
                            label={t('Variable type')}
                            name={[field.name, 'type']}
                            key={`${field.fieldKey}-type`}
                            rules={[{ required: true, message: t('Variable type is required') }]}
                          >
                            <Select placeholder={t('Select')}>
                              <Select.Option value="code">{t('Code')}</Select.Option>
                              <Select.Option value="date">{t('Date')}</Select.Option>
                              <Select.Option value="number">{t('Number')}</Select.Option>
                              <Select.Option value="string">{t('String')}</Select.Option>
                              <Select.Option value="boolean">{t('Boolean')}</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col md={1} className="variable-remove-icon">
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Col>
                      </Row>
                    ))}

                    <Form.Item className="list-add">
                      <OneButton type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                        {t('Add variable')}
                      </OneButton>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
            <Col md={24}>
              <Form.Item label={t('Excluded companies')} name="excludedCompanies">
                <OneSelect
                  apiURL={`${api.COMPANIES}/?select=_id name`}
                  labelAttr="name"
                  valueAttr="_id"
                  mode="multiple"
                  noDefaultOption
                  showArrow
                  useCache
                  placeholder={t('Select')}
                />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Frequency number')}
                name="frequency"
                required
                rules={[{ required: true, message: t('Please type the frequency of update') }]}
              >
                <Input placeholder={t('Frequency number: 30')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Frequency unit')}
                name={'frequencyUnit'}
                rules={[{ required: true, message: t('Please select the frequency unit') }]}
              >
                <Select placeholder={t('Select')}>
                  <Select.Option value="minutes">{t('Minutes')}</Select.Option>
                  <Select.Option value="hours">{t('Hours')}</Select.Option>
                  <Select.Option value="days">{t('Days')}</Select.Option>
                  <Select.Option value="weeks">{t('Weeks')}</Select.Option>
                  <Select.Option value="months">{t('Months')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label={t('Active')} name="active" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default GraphicCreate;
