import { FC, ReactElement, useContext, useEffect, useState } from 'react';
import Alert from 'antd/es/alert';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Typography from 'antd/es/typography';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import OneLoader from 'components/atoms/OneLoader';
import OneSelect from 'components/atoms/OneSelect';
import AppContext from 'contexts/AppContext';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { Profile, User } from 'interfaces';
import './style.less';

const { Title } = Typography;

interface ArticleCreateProps {
  user?: User;
  visible: boolean;
  setVisible(status: boolean): void;
  setUser(user?: User): void;
  reload(reload: boolean): void;
}

const UserCreate: FC<ArticleCreateProps> = (props: ArticleCreateProps): ReactElement => {
  const { visible, setVisible, user, setUser, reload } = props;
  const { t } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'error' | 'success' | 'warning' | 'info' | undefined>('error');
  const [form] = Form.useForm();

  const save = async () => {
    try {
      const data = await form.validateFields();
      setLoading(true);
      let result = {
        error: [],
      };

      if (user) {
        const dataPut: any = {};
        const keys = Object.keys(data);

        for (const key of keys) {
          if (!['', undefined].includes(data[key])) {
            dataPut[key] = data[key];
          }
        }

        result = await defaultService.put(`${Constants.api.USERS}/${user._id}`, dataPut);
      } else {
        result = await defaultService.post(Constants.api.USERS, data);
      }

      if (result.error && result.error.length) {
        setMessages(result.error);
        setMessageType('error');
      } else {
        const successMessage = user ? t('User updated successfuly') : t('New user registred successfuly');
        setMessages([successMessage]);
        setMessageType('success');
        form.resetFields();
        setIsSaved(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const data = form.getFieldsValue();
    if (data.password !== data.confirmPassword) {
      return Promise.reject(t('The confirm password need to be the same of password'));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    setIsSaved(false);
    form.resetFields();
    setMessages([]);

    if (user) {
      const userToEdit = { ...user };
      userToEdit.profiles = user.profiles.map((p: Profile) => p._id);
      form.setFieldsValue(userToEdit);
    }
  }, [visible, user]);

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <ProjectOutlined /> {user ? t('Edit user') : t('New user')}
          </Title>
        }
        width={'60vw'}
        visible={visible}
        zIndex={1005}
        style={{ top: 20 }}
        onCancel={() => {
          setUser(undefined);
          setVisible(false);
          reload(isSaved);
        }}
        onOk={() => save()}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            name: '',
            email: '',
            active: true,
            password: '',
            confirmPassword: '',
            profiles: [],
          }}
        >
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

            <Form.Item name="active" hidden>
              <Input />
            </Form.Item>

            <Col md={12}>
              <Form.Item
                label={t('Name')}
                name="name"
                required
                rules={[{ required: true, message: t('Please type the user name') }]}
              >
                <Input placeholder={t('Type the user name')} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t('Email')}
                name="email"
                required
                rules={[{ required: true, type: 'email', message: t('Please type a valid email') }]}
              >
                <Input placeholder={t('User email')} type="email" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t('Password')}
                name="password"
                required={!user}
                rules={[{ required: !user, min: 6, message: t('Please type the user password with min 6 caracters') }]}
              >
                <Input placeholder={t('User password')} type="password" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t('Confirm password')}
                name="confirmPassword"
                required={!user}
                rules={[
                  { required: !user, message: t('Please type the same of the password field') },
                  { validator: validatePassword },
                ]}
              >
                <Input placeholder={t('Confirm password')} type="password" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t('Profiles')}
                name="profiles"
                required
                rules={[{ required: true, message: t('Please select the user profiles') }]}
              >
                <OneSelect
                  apiURL={`${Constants.api.PROFILES}/?select=_id name`}
                  labelAttr="name"
                  valueAttr="_id"
                  mode="multiple"
                  noDefaultOption
                  showArrow
                  useCache
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UserCreate;
