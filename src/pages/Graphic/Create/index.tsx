import { FC, ReactElement, useEffect, useState } from 'react';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import message from 'antd/es/message';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Typography from 'antd/es/typography';
import Switch from 'antd/es/switch';
import UserOutlined from '@ant-design/icons/UserOutlined';
import OneLoader from 'components/atoms/OneLoader';
import OneSelect from 'components/atoms/OneSelect';
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
    form.resetFields();

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
            <UserOutlined /> {graphic ? t('Edit graphic') : t('New graphic')}
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
                  dataItems={[{ name: 'find' }, { name: 'aggregate' }]}
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
            <Col md={24}>
              <Form.Item label={t('Query')} name="query">
                <Input.TextArea placeholder={t('Graphic query object for aggregate type')} rows={10} />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label={t('Graphic frontend configutations object')} name="configs">
                <Input.TextArea placeholder={t('Graphic configurations for frontend')} rows={8} />
              </Form.Item>
            </Col>
            <Col md={18}>
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
