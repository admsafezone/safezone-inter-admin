import { FC, ReactElement, useEffect, useState } from 'react';
import { Col, Form, Input, message, Modal, Row, Typography, Switch } from 'antd/es';
import { UserOutlined } from '@ant-design/icons';
import { OneLoader, OneSelect } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { checkACL } from 'utils/AclUtils';
import { User } from 'interfaces';
import './style.less';

const { Title } = Typography;

interface UserCreateProps {
  user?: User;
  visible: boolean;
  setVisible(status: boolean): void;
  setUser(user?: User): void;
  reload(reload: boolean): void;
}

const UserCreate: FC<UserCreateProps> = (props: UserCreateProps): ReactElement => {
  const { visible, setVisible, user, setUser, reload } = props;
  const { t, company } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [form] = Form.useForm();

  const save = async () => {
    try {
      const data = await form.validateFields();
      setLoading(true);
      let result;

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
        result.error.map((err) => message.error(err));
      } else {
        const successMessage = user ? t('User updated successfuly') : t('New user registred successfuly');
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

    if (user) {
      const userToEdit = { ...user, ...{ company: user.company?._id || user.company || company?._id } };
      userToEdit.profiles = user.profiles.map((p: any) => p?._id || p);
      form.setFieldsValue(userToEdit);
    }
  }, [visible, user]);

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <UserOutlined /> {user ? t('Edit user') : t('New user')}
          </Title>
        }
        width={'60vw'}
        visible={visible}
        style={{ top: 20 }}
        onCancel={() => {
          setUser(undefined);
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
            name: '',
            surname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            profiles: [],
            company: !user ? company?._id : '',
          }}
        >
          <Row gutter={24}>
            <Col md={8}>
              <Form.Item
                label={t('Name')}
                name="name"
                required
                rules={[{ required: true, message: t('Please type the user name') }]}
              >
                <Input placeholder={t('Type the user name')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Surname')}
                name="surname"
                required
                rules={[{ required: true, message: t('Please type the user surname') }]}
              >
                <Input placeholder={t('Type the user surname')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Username')}
                name="username"
                required
                rules={[{ required: true, message: t('Please type the username') }]}
              >
                <Input placeholder={t('Type the username')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Email')}
                name="email"
                required
                rules={[{ required: true, type: 'email', message: t('Please type a valid email') }]}
              >
                <Input placeholder={t('User email')} type="email" />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Password')}
                name="password"
                required={!user}
                rules={[
                  {
                    required: !user,
                    min: 6,
                    message: t('Please type the user password with min {{min}} caracters', { min: 6 }),
                  },
                ]}
              >
                <Input placeholder={t('User password')} type="password" />
              </Form.Item>
            </Col>
            <Col md={8}>
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

            {checkACL(Constants.acl.USERS, Constants.permissions.M) && (
              <Col md={8}>
                <Form.Item
                  label={t('Profiles')}
                  name="profiles"
                  required
                  rules={[{ required: true, message: t('Please select the user profiles') }]}
                >
                  <OneSelect
                    apiURL={`${Constants.api.PROFILES}/?select=_id name&filter=admin:b;true`}
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
            )}

            {checkACL(Constants.acl.USERS, Constants.permissions.M) ? (
              <Col md={8}>
                <Form.Item
                  label={t('Company')}
                  name="company"
                  required
                  rules={[{ required: true, message: t('Please select the user company') }]}
                >
                  <OneSelect
                    apiURL={`${Constants.api.COMPANIES}/?select=_id name`}
                    labelAttr="name"
                    valueAttr="_id"
                    showArrow
                    useCache
                    placeholder={t('Select')}
                  />
                </Form.Item>
              </Col>
            ) : (
              <Form.Item name="company">
                <Input hidden />
              </Form.Item>
            )}
            <Col md={8}>
              <Form.Item label={t('Active user')} name="active">
                <Switch defaultChecked={user?.active} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label={t('Confirmed user')} name="confirmed">
                <Switch defaultChecked={user?.confirmed} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label={t('Blocked user login')} name="loginBlocked">
                <Switch defaultChecked={user?.loginBlocked} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UserCreate;
