import { FC, ReactElement, useEffect, useState } from 'react';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import message from 'antd/es/message';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Switch from 'antd/es/switch';
import Typography from 'antd/es/typography';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import OneLoader from 'components/atoms/OneLoader';
import OneSelect from 'components/atoms/OneSelect';
import OneTextEditor from 'components/atoms/OneTextEditor';
import OneUploadInput from 'components/atoms/OneUploadInput';
import OneMediaGalery from 'components/atoms/OneMediaGalery';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { Activity } from 'interfaces';
import './style.less';

const { Title } = Typography;

interface ArticleCreateProps {
  activity?: Activity;
  visible: boolean;
  setVisible(status: boolean): void;
  setActivity(activity?: Activity): void;
  reload(reload: boolean): void;
}

const ActivityCreate: FC<ArticleCreateProps> = (props: ArticleCreateProps): ReactElement => {
  const { visible, setVisible, activity, setActivity, reload } = props;
  const { t, options } = useAppContext();
  const [galeryVisible, setGaleryVisible] = useState(false);
  const [galeryField, setGaleryField] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [form] = Form.useForm();

  const save = async () => {
    try {
      const data = await form.validateFields();

      if (data.content) {
        data.content = data.content.toHTML();
      }

      setLoading(true);
      let result;

      if (activity) {
        const dataPut: any = {};
        const keys = Object.keys(data);

        for (const key of keys) {
          if (!['', undefined].includes(data[key])) {
            dataPut[key] = data[key];
          }
        }

        result = await defaultService.put(`${Constants.api.ACTIVITIES}/${activity._id}`, dataPut);
      } else {
        result = await defaultService.post(Constants.api.ACTIVITIES, data);
      }

      if (result.error && result.error.length) {
        result.error.map((err) => message.error(err));
      } else {
        const successMessage = activity ? t('Activity updated successfuly') : t('New activity registred successfuly');
        message.success(successMessage);
        setIsSaved(true);

        if (!activity) {
          setActivity(result);
        }
      }
    } catch (error) {}

    setLoading(false);
  };

  const updateField = (key: string, value?: string) => {
    if (value) {
      const allFields = form.getFieldsValue();
      allFields[key] = value;
      form.resetFields();
      form.setFieldsValue(allFields);
    } else {
      setGaleryField(key);
    }
  };

  useEffect(() => {
    setIsSaved(false);
    form.resetFields();

    if (activity) {
      form.setFieldsValue(activity);
    }
  }, [visible, activity]);

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <ProjectOutlined /> {activity ? t('Edit activity') : t('New activity')}
          </Title>
        }
        width={'70vw'}
        visible={visible}
        style={{ top: 20 }}
        onCancel={() => {
          setVisible(false);
          reload(isSaved);
          setActivity(undefined);
        }}
        maskClosable={false}
        cancelText={t('Close')}
        onOk={() => save()}
        okText={t('Save')}
        okButtonProps={{ loading, disabled: loading }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col md={16}>
              <Form.Item
                label={t('Title')}
                name="title"
                required
                rules={[{ required: true, message: t('Please type the activity title') }]}
              >
                <Input placeholder={t('Type the activity title')} />
              </Form.Item>
              <Form.Item label={t('Description')} name="description">
                <Input.TextArea placeholder={t('Activity description')} rows={3} />
              </Form.Item>
            </Col>

            <Col md={8}>
              <Form.Item label={t('Cover image')} name="image">
                <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
              </Form.Item>
            </Col>

            <Col md={24}>
              <Form.Item label={t('Content')} name="content">
                <OneTextEditor
                  placeholder={t('Activity content')}
                  style={{ border: '1px solid #d9d9d9', borderRadius: '2px', minHeight: '800px' }}
                />
              </Form.Item>
            </Col>

            <Col md={8}>
              <Form.Item
                label={t('Type')}
                name="type"
                required
                rules={[{ required: true, message: t('Please select the type of activity') }]}
              >
                <OneSelect
                  apiURL={`${Constants.api.PARAMS}/Activitytype?select=name`}
                  labelAttr="name"
                  valueAttr="name"
                  defaultValue={activity?.type || ''}
                  showArrow
                  useCache
                />
              </Form.Item>
            </Col>

            <Col md={8}>
              <Form.Item
                label={t('Language')}
                name="lang"
                required
                rules={[{ required: true, message: t('Please select the type of activity') }]}
              >
                <OneSelect
                  apiURL={`${Constants.api.LANGUAGES}/?select=name lang`}
                  labelAttr="name"
                  valueAttr="lang"
                  defaultValue={activity?.lang || options.lang || ''}
                  showArrow
                  useCache
                />
              </Form.Item>
            </Col>

            <Col md={8}>
              <Form.Item label={t('Active')} name="active">
                <Switch defaultChecked={activity?.active} />
              </Form.Item>
            </Col>
          </Row>

          <Col md={24}>
            <Form.Item label={t('Aditional data')} name="data">
              <Input.TextArea placeholder={t('Activity aditional data')} rows={15} />
            </Form.Item>
          </Col>
        </Form>
      </Modal>

      <OneMediaGalery
        updateField={updateField}
        setVisible={setGaleryVisible}
        fieldName={galeryField}
        visible={galeryVisible}
      />
    </>
  );
};

export default ActivityCreate;
