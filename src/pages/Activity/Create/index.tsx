import { FC, ReactElement, useEffect, useState } from 'react';
import Alert from 'antd/es/alert';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Switch from 'antd/es/switch';
import Typography from 'antd/es/typography';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import OneLoader from 'components/atoms/OneLoader';
import OneSelect from 'components/atoms/OneSelect';
import OneTextEditor from 'components/atoms/OneTextEditor';
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
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [images, setImages] = useState([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'error' | 'success' | 'warning' | 'info' | undefined>('error');
  const [form] = Form.useForm();

  const getImages = async () => {
    const response = await defaultService.get(`${Constants.api.MEDIA}/?select=url type`, []);
    setImages(response);
  };

  const save = async () => {
    try {
      const data = await form.validateFields();

      if (data.content) {
        data.content = data.content.toHTML();
      }

      setLoading(true);
      let result = {
        error: [],
      };
      let response;

      if (activity) {
        const dataPut: any = {};
        const keys = Object.keys(data);

        for (const key of keys) {
          if (!['', undefined].includes(data[key])) {
            dataPut[key] = data[key];
          }
        }

        result = response = await defaultService.put(`${Constants.api.ACTIVITIES}/${activity._id}`, dataPut);
      } else {
        result = response = await defaultService.post(Constants.api.ACTIVITIES, data);
      }

      if (result.error && result.error.length) {
        setMessages(result.error);
        setMessageType('error');
      } else {
        const successMessage = activity ? t('Activity updated successfuly') : t('New activity registred successfuly');
        setMessages([successMessage]);
        setMessageType('success');
        setIsSaved(true);

        if (!activity) {
          setActivity(response);
        }
      }
    } catch (error) {}

    setLoading(false);
  };

  useEffect(() => {
    getImages();
    setIsSaved(false);
    form.resetFields();

    if (activity) {
      form.setFieldsValue(activity);
    } else {
      setMessages([]);
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
        zIndex={1005}
        style={{ top: 20 }}
        onCancel={() => {
          setVisible(false);
          reload(isSaved);
          setActivity(undefined);
        }}
        maskClosable={false}
        onOk={() => save()}
        okText={t('Save')}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col md={24}>
              {messages.length
                ? messages.map((error: string, i: number) => {
                    return (
                      <Alert
                        key={Math.random()}
                        message={error}
                        showIcon
                        closable
                        type={messageType}
                        style={{ marginBottom: '12px' }}
                        afterClose={() => {
                          const newErros = [...messages];
                          newErros.splice(i, 1);
                          setMessages(newErros);
                        }}
                      />
                    );
                  })
                : ''}
            </Col>

            <Col md={24}>
              <Form.Item
                label={t('Title')}
                name="title"
                required
                rules={[{ required: true, message: t('Please type the activity title') }]}
              >
                <Input placeholder={t('Type the activity title')} />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label={t('Description')} name="description">
                <Input.TextArea placeholder={t('Activity description')} rows={3} />
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label={t('Content')} name="content">
                <OneTextEditor
                  placeholder={t('Activity content')}
                  media={{ items: images }}
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
                  apiURL={`${Constants.api.LANGUAGES}/?select=name lowerCode`}
                  labelAttr="name"
                  valueAttr="lowerCode"
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
    </>
  );
};

export default ActivityCreate;
