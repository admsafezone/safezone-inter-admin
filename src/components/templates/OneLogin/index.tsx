import { FC, ReactElement, useState } from 'react';
import Recaptcha from 'react-recaptcha';
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
import { getCurrentLang } from 'i18n';
import logo from 'assets/logo.svg';
import './style.less';

interface LoginProps {
  onLogin(user?: User): void;
}

let recaptchaInstance;

const OneLogin: FC<LoginProps> = ({ onLogin }: LoginProps): ReactElement => {
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [form] = Form.useForm();

  const onFinish = async (token) => {
    setLoading(true);
    const values = form.getFieldsValue();
    values.recaptchaToken = token;

    const requestConfig = {
      url: `${defaultService.api.defaults.baseURL}/${Constants.api.AUTH}`,
      data: values,
      method: 'post',
      headers: {
        locale: getCurrentLang(),
        Authorization: '',
      },
    };
    const response = await defaultService.request(requestConfig);

    if (response.error) {
      setErrorMessages(response.error);
      setLoading(false);
      if (recaptchaInstance) {
        recaptchaInstance.reset();
      }
    } else {
      sls.setItem(Constants.storage.TOKEN, response);
      const decoded = tokenDecode(response.token);
      const { user, sub } = decoded;
      user._id = sub;
      sls.setItem(Constants.storage.USER, user);
      onLogin(decoded.user);
    }
  };

  const recaptchaVerifyCallback = (token) => {
    onFinish(token);
  };

  const executeCaptcha = () => {
    recaptchaInstance.execute();
    setLoading(true);
  };

  return (
    <div className="one-login-wrapper">
      <OnePageTitle title={t('Sign in')} />

      <Form
        className="one-login"
        name="login"
        form={form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={() => executeCaptcha()}
      >
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
          <Input disabled={loading} />
        </Form.Item>

        <Form.Item
          label={t('Password')}
          name="password"
          rules={[{ required: true, message: t('Please input your password!') }]}
        >
          <Input.Password disabled={loading} />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>{t('Remember me')}</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('Enter')}
          </Button>
        </Form.Item>

        <Recaptcha
          ref={(e) => (recaptchaInstance = e)}
          sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
          verifyCallback={recaptchaVerifyCallback}
          size="invisible"
          hl="pt-BR"
        />
      </Form>
    </div>
  );
};

export default OneLogin;
