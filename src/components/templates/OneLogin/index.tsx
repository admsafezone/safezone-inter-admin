import { FC, ReactElement, useState } from 'react';
import Form from 'antd/es/form';
import Alert from 'antd/es/alert';
import Button from 'antd/es/button';
import Checkbox from 'antd/es/checkbox';
import Typography from 'antd/es/typography';
import Col from 'antd/es/col';
import Image from 'antd/es/image';
import Input from 'antd/es/input';
import OnePageTitle from 'components/atoms/OnePageTitle';
import defaultService from 'services/defaultService';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import { tokenDecode } from 'utils/AclUtils';
import { User } from 'interfaces';
import { sls } from 'utils/StorageUtils';
import logo from 'assets/logo.svg';
import './style.less';

interface Login {
  email: string;
  password: string;
}
interface LoginProps {
  onLogin(user?: User): void;
}

const OneLogin: FC<LoginProps> = ({ onLogin }: LoginProps): ReactElement => {
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const onFinish = async (values: Login) => {
    setLoading(true);
    const response = await defaultService.post(Constants.api.AUTH, values);

    if (response.error) {
      setErrorMessages(response.error);
    } else {
      sls.setItem(Constants.storage.TOKEN, response);
      const decoded = tokenDecode(response.token);
      const { user, sub } = decoded;
      user._id = sub;
      sls.setItem(Constants.storage.USER, user);
      onLogin(decoded.user);
    }
    setLoading(false);
  };

  return (
    <div className="one-login-wrapper">
      <OnePageTitle title={t('Sign in')} />

      <Form className="one-login" name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
        <div className="one-login-logo">
          <Image src={logo} />
          <Typography>{Constants.app.appName}</Typography>
        </div>

        <Col md={24}>
          {errorMessages.map((error: string, i: number) => {
            return (
              <Alert
                key={Math.random()}
                message={error}
                showIcon
                closable
                type={'error'}
                style={{ marginBottom: '24px' }}
                afterClose={() => {
                  const newErros = [...errorMessages];
                  newErros.splice(i, 1);
                  setErrorMessages(newErros);
                }}
              />
            );
          })}
        </Col>

        <Form.Item
          label={t('Username')}
          name="email"
          rules={[{ required: true, message: t('Please input your email!') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('Password')}
          name="password"
          rules={[{ required: true, message: t('Please input your password!') }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>{t('Remember me')}</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('Enter')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OneLogin;
