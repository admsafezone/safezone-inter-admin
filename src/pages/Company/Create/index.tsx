import { FC, ReactElement, useEffect, useState } from 'react';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import message from 'antd/es/message';
import Radio from 'antd/es/radio';
import Select from 'antd/es/select';
import Switch from 'antd/es/switch';
import Tabs from 'antd/es/tabs';
import Typography from 'antd/es/typography';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import OneLoader from 'components/atoms/OneLoader';
import ThemeOptions from '../ThemeOptions';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import OneMediaGalery from 'components/atoms/OneMediaGalery';
import Constants from 'utils/Constants';
import { checkACL } from 'utils/AclUtils';
import { objectToFields, fieldsToObject } from 'utils/DateUtils';
import { Company } from 'interfaces';
import './style.less';

const { Title } = Typography;
const { TabPane } = Tabs;

interface CompanyCreateProps {
  company?: Company;
  visible: boolean;
  setVisible(status: boolean): void;
  setCompany(comapny?: Company): void;
  reload(reload: boolean): void;
}

const CompanyCreate: FC<CompanyCreateProps> = (props: CompanyCreateProps): ReactElement => {
  const { visible, setVisible, company, setCompany, reload } = props;
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [galeryVisible, setGaleryVisible] = useState(false);
  const [galeryField, setGaleryField] = useState('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [companyDomain, setCompanyDomain] = useState<string>('');
  const [form] = Form.useForm();
  const szDomain = process.env.REACT_APP_DOMAIN;
  const messageDuration = 5;

  const save = async () => {
    setLoading(true);

    try {
      const values = await form.validateFields();
      const data = fieldsToObject(values);

      if (!data?.theme?.light || !data?.theme?.dark) {
        message.error(t('Please fill in all theme required fields'), messageDuration);
        setLoading(false);
        return;
      }

      let result;

      if (company && company._id) {
        const dataPut: any = {};
        const keys = Object.keys(data);

        for (const key of keys) {
          if (!['', undefined].includes(data[key])) {
            dataPut[key] = data[key];
          }
        }

        result = await defaultService.put(`${Constants.api.COMPANIES}/${company._id}`, dataPut);
      } else {
        result = await defaultService.post(Constants.api.COMPANIES, data);
      }

      if (result?.error && result.error.length) {
        result.error.map((err) => message.error(err));
      } else {
        const successMessage = company ? t('Company updated successfuly') : t('New company created successfuly');
        message.success(successMessage, messageDuration);

        if (!company) {
          setCompany(result);
          form.resetFields();
          setCompanyDomain('');
        }
        setIsSaved(true);
      }
      setLoading(false);
    } catch (error) {
      message.error(t('Please fill in all required fields'), messageDuration);
    }

    setLoading(false);
  };

  const updateField = (key: string, value?: string) => {
    if (value !== undefined) {
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

    if (company) {
      const fields = form.getFieldsValue();
      const flatCompany = objectToFields(company, fields);
      form.setFieldsValue(flatCompany);
      setCompanyDomain(`${company.identifier}.${szDomain}`);
    } else {
      setCompanyDomain('');
    }
  }, [visible, company]);

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <ProjectOutlined /> {company ? t('Edit company') : t('New company')}
          </Title>
        }
        width={'70vw'}
        visible={visible}
        style={{ top: 20 }}
        onCancel={() => {
          setVisible(false);
          setCompany(undefined);
          reload(isSaved);
        }}
        onOk={() => save()}
        okText={t('Save')}
        okButtonProps={{ loading, disabled: loading }}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col md={12}>
              <Form.Item
                label={t('Name')}
                name="name"
                required
                rules={[{ required: true, message: t('Please type the company name') }]}
              >
                <Input placeholder={t('Type the company name')} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <div
                style={{ position: 'absolute', right: '20px', textAlign: 'right', fontWeight: 'bold', color: 'green' }}
              >{` ${companyDomain || ''}`}</div>
              <Form.Item
                label={t('Subdomain')}
                name="identifier"
                required
                rules={[{ required: true, message: t('Please type the company subdomain') }]}
              >
                <Input
                  disabled={!!company?.identifier}
                  placeholder={t('Attention! This subdomain cannot be modified later')}
                  onChange={(e) => setCompanyDomain(`${e.target.value}.${szDomain}`)}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                label={t('Emails accepted')}
                name="domains"
                required={true}
                rules={[{ required: true, message: t('Please type the company domains emails accepted') }]}
              >
                <Select
                  mode="tags"
                  showArrow={false}
                  placeholder={`${szDomain}, gmail.com`}
                  dropdownStyle={{ display: 'none' }}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                label={t('Domains accepted')}
                name="origins"
                required={true}
                rules={[{ required: true, message: t('Please type the company domain origins') }]}
              >
                <Select
                  mode="tags"
                  showArrow={false}
                  placeholder={`/.*${szDomain}/, company.${szDomain}`}
                  dropdownStyle={{ display: 'none' }}
                  disabled={!checkACL(Constants.acl.COMPANIES, Constants.permissions.M)}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label={t('Active company')} name="active">
                <Switch defaultChecked={company?.active} />
              </Form.Item>
            </Col>

            <Col md={24}>
              <h1 style={{ borderBottom: '1px solid #ccc' }}>{t('Site options')}</h1>
              <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>
                {t('Sign in options')}
              </h2>
              <Row gutter={24}>
                <Col md={8}>
                  <Form.Item label={t('Username from name and surname')} name="options.autoUsername">
                    <Switch defaultChecked={company?.options?.autoUsername} />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label={t('Username pattern mask')} name="options.maskOptions.mask">
                    <Input placeholder={t('Ex.: AA999999')} />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label={t('Username visible mask')} name="options.maskOptions.alwaysShowMask">
                    <Switch defaultChecked={company?.options?.maskOptions?.alwaysShowMask} />
                  </Form.Item>
                </Col>
              </Row>

              <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>
                {t('Password options')}
              </h2>
              <Row gutter={24}>
                <Col md={8}>
                  <Form.Item label={t('Password force use lowercase')} name="options.passwordOptions.lowercase">
                    <Switch defaultChecked={company?.options?.passwordOptions?.lowercase} />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label={t('Password force use uppercase')} name="options.passwordOptions.uppercase">
                    <Switch defaultChecked={company?.options?.passwordOptions?.uppercase} />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label={t('Password force use number')} name="options.maskOptions.number">
                    <Switch defaultChecked={company?.options?.passwordOptions?.number} />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label={t('Password min length')}
                    name="options.passwordOptions.minLength"
                    required
                    rules={[{ required: true, message: t('Please type the min length of the password') }]}
                  >
                    <Input placeholder={'6'} type="number" />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item label={t('Password use symbols')} name="options.passwordOptions.symbol">
                    <Input placeholder={'%$#@*&!_'} />
                  </Form.Item>
                </Col>
              </Row>

              {checkACL(Constants.acl.COMPANIES, Constants.permissions.M) ? (
                <>
                  <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>
                    {t('Activities options')}
                  </h2>
                  <Row gutter={24}>
                    <Col md={8}>
                      <Form.Item
                        label={t('Max number of site activities')}
                        name="options.activity.limit"
                        rules={[{ required: true, message: t('Please type the max number of activities') }]}
                      >
                        <Input type="number" placeholder={t('Type the max number of activities')} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                <Form.Item name="options.activity.limit">
                  <Input hidden />
                </Form.Item>
              )}
            </Col>

            <Col md={24}>
              <h1 style={{ borderBottom: '1px solid #ccc' }}>{t('Theme options')}</h1>
              <Row gutter={24}>
                <Col md={24}>
                  <Form.Item
                    label={t('Theme mode')}
                    name="theme.mode"
                    rules={[{ required: true, message: t('Please select site theme mode') }]}
                  >
                    <Radio.Group>
                      <Radio value={'light'}>{t('Light')}</Radio>
                      <Radio value={'dark'}>{t('Dark')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Tabs
                defaultActiveKey={company?.theme?.mode}
                tabBarStyle={{ fontWeight: 'bold' }}
                size="large"
                type="card"
              >
                <TabPane tab={t('Light theme config')} key="light" forceRender>
                  <ThemeOptions mode="light" updateField={updateField} setGaleryVisible={setGaleryVisible} />
                </TabPane>

                <TabPane tab={t('Dark theme config')} key="dark" forceRender>
                  <ThemeOptions mode="dark" updateField={updateField} setGaleryVisible={setGaleryVisible} />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
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

export default CompanyCreate;
