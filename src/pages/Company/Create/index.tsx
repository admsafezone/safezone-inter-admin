import { FC, ReactElement, useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row, message, Radio, Select, Switch, Tabs, Typography } from 'antd/es';
import { BankOutlined } from '@ant-design/icons';
import { OneLoader, OneSelect, OneUploadInput, OneMediaGalery, OneInputColor } from 'components/atoms';
import ThemeOptions from '../ThemeOptions';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { useAppContext } from 'providers/AppProvider';
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
  const defaultIdentifier = process.env.REACT_APP_DEFAULT_IDENTIFIER;
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
    if (visible) {
      form.resetFields();
    }

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
            <BankOutlined /> {company ? t('Edit company') : t('New company')}
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
              <Form.Item label={t('Active company')} name="active" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col md={24}>
              <h1 style={{ borderBottom: '1px solid #ccc' }}>{t('Site options')}</h1>
              <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>
                {t('Sign in options')}
              </h2>
              <Row gutter={24}>
                <Col md={8}>
                  <Form.Item label={t('Username pattern mask')} name="options.maskOptions.mask">
                    <Input placeholder={t('Ex.: AA999999')} />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label={t('Username from name and surname')}
                    name="options.autoUsername"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label={t('Username visible mask')}
                    name="options.maskOptions.alwaysShowMask"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col md={12}>
                  <Form.Item label={t('Menssage company support')} name="theme.messageCompany">
                    <Input placeholder={t('Please type the company menssage support')} />
                  </Form.Item>
                </Col>
              </Row>

              <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>
                {t('Password options')}
              </h2>
              <Row gutter={24}>
                <Col md={8}>
                  <Form.Item
                    label={t('Password force use lowercase')}
                    name="options.passwordOptions.lowercase"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label={t('Password force use uppercase')}
                    name="options.passwordOptions.uppercase"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label={t('Password force use number')}
                    name="options.maskOptions.number"
                    valuePropName="checked"
                  >
                    <Switch />
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
                        rules={[{ required: true, message: t('Please type the max number of site activities') }]}
                      >
                        <Input type="number" placeholder={t('Type the max number of site activities')} />
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item label={t('Disable ranking om site')} name="options.disabledRanking">
                        <Switch />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : (
                <Form.Item name="options.disabledRanking" hidden>
                  <Input type="hidden" />
                </Form.Item>
              )}
            </Col>

            {checkACL(Constants.acl.COMPANIES, Constants.permissions.M) ? (
              <Col md={24}>
                <h2 style={{ borderBottom: '1px solid #ccc' }}>{t('Admin options')}</h2>
                <Row gutter={24}>
                  <Col md={18}>
                    <Row gutter={24}>
                      <Col md={24}>
                        <Form.Item label={t('Admin title')} name="theme.admin.title">
                          <Input placeholder={t('Admin title')} />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item label={t('Admin logo background color')} name={'theme.admin.backgroundColor'}>
                          <OneInputColor name="theme.admin.backgroundColor" />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item label={t('Admin logo font color')} name={'theme.admin.fontColor'}>
                          <OneInputColor name="theme.admin.fontColor" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Form.Item label={t('Admin logo')} name="theme.admin.logo">
                      <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            ) : (
              <>
                <Form.Item name="theme.admin.title" hidden>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name="theme.admin.backgroundColor" hidden>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name="theme.admin.fontColor" hidden>
                  <Input type="hidden" />
                </Form.Item>
                <Form.Item name="theme.admin.logo" hidden>
                  <Input type="hidden" />
                </Form.Item>
              </>
            )}

            <Col md={24}>
              <h2 style={{ borderBottom: '1px solid #ccc' }}>{t('Public area options')}</h2>
              <Row gutter={24}>
                <Col md={12}>
                  <Col md={24}>
                    <Form.Item label={t('Slogan')} name="theme.public.slogan">
                      <Input placeholder={t('Type a text')} />
                    </Form.Item>
                  </Col>
                  <Col md={24}>
                    <Form.Item label={t('Signup text')} name="theme.public.signupText">
                      <Input placeholder={t('Type a text')} />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item label={t('Sign in background color')} name={'theme.public.backgroundColor'}>
                      <OneInputColor name="theme.public.backgroundColor" />
                    </Form.Item>
                  </Col>
                </Col>
                <Col md={6}>
                  <Form.Item label={t('Sign in logo')} name="theme.public.logo">
                    <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item label={t('Sign in background image')} name="theme.public.background">
                    <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col md={24}>
              <h1 style={{ borderBottom: '1px solid #ccc' }}>{t('Theme options')}</h1>
              <Row gutter={24}>
                <Col md={8}>
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
                <Col md={8}>
                  <Form.Item
                    label={t('Site language')}
                    name="theme.lang"
                    required={true}
                    rules={[{ required: true, message: t('Please select the site language') }]}
                  >
                    <OneSelect
                      apiURL={`${Constants.api.LANGUAGES}/?select=name lang`}
                      headers={{ identifier: defaultIdentifier }}
                      labelAttr="name"
                      valueAttr="lang"
                      showArrow
                      useCache
                    />
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
