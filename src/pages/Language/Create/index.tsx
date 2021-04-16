import { FC, ReactElement, useEffect, useState } from 'react';
import { Col, Form, Input, message, Modal, Row, Collapse, Typography } from 'antd/es';
import { TranslationOutlined, PlusOutlined } from '@ant-design/icons';
import OneLanguageInput from 'components/atoms/OneLanguageInput';
import { OneButton, OneLoader } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { Language } from 'interfaces';
import './style.less';

const { Title } = Typography;
const { Panel } = Collapse;

interface ArticleCreateProps {
  language?: Language;
  visible: boolean;
  setVisible(status: boolean): void;
  setLanguage(language?: Language): void;
  reload(reload: boolean): void;
}

const LanguageCreate: FC<ArticleCreateProps> = (props: ArticleCreateProps): ReactElement => {
  const { visible, setVisible, language, setLanguage, reload } = props;
  const defaultTranslations = { 'translation.backend': [], 'translation.admin': [], 'translation.web': [] };
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState(defaultTranslations);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [form] = Form.useForm();

  const convertArrayToObject = (translateArray) => {
    const result = {};

    if (Array.isArray(translateArray)) {
      for (const item of translateArray) {
        result[item.key] = item.value;
      }
    }

    return result;
  };

  const normalizeTranslation = (data) => {
    const objectKeys = Object.keys(data);

    for (const key of objectKeys) {
      if (key.includes('translation')) {
        data[key] = convertArrayToObject(data[key]);
      }
    }

    return data;
  };

  const save = async () => {
    try {
      setLoading(true);
      let data = await form.validateFields();
      data = normalizeTranslation(data);
      let result;

      if (language?._id) {
        const dataPut: any = {};
        const keys = Object.keys(data);

        for (const key of keys) {
          if (!['', undefined].includes(data[key])) {
            dataPut[key] = data[key];
          }
        }

        result = await defaultService.put(`${Constants.api.LANGUAGES}/${language._id}`, dataPut);
      } else {
        result = await defaultService.post(Constants.api.LANGUAGES, data);
      }

      if (result.error && result.error.length) {
        result.error.map((err) => message.error(err));
      } else {
        const successMessage = language ? t('Language updated successfuly') : t('New language registred successfuly');
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

  const getTranslation = (translation, isBase) => {
    const translationKeys = Object.keys(translation);

    const result = defaultTranslations;

    translationKeys.forEach((translationKey) => {
      const translationOne = translation[translationKey];
      const dictionaryKey = Object.keys(translationOne);
      const dictionary = dictionaryKey.map((key) => ({ key, value: isBase ? '' : translationOne[key] }));
      result[`translation.${translationKey}`] = dictionary;
    });

    return result;
  };

  useEffect(() => {
    setIsSaved(false);
    form.resetFields();

    if (language) {
      const translations = getTranslation(language.translation || {}, !language._id);
      setTranslations(translations);
      form.setFieldsValue({ ...language, ...translations });
    }
  }, [visible, language]);

  const renderFormList = (key) => {
    return (
      <Panel header={key} key={`${key}-panel`} className="language-panel">
        <Form.List name={key}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <OneLanguageInput key={`${key}-${field.fieldKey}-key`} translate={key} field={field} remove={remove} />
              ))}

              <Form.Item className="list-add">
                <OneButton type="primary" onClick={() => add()} icon={<PlusOutlined />}>
                  {t('Add translation')}
                </OneButton>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Panel>
    );
  };

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <TranslationOutlined /> {language ? t('Edit language') : t('New language')}
          </Title>
        }
        width={'70vw'}
        visible={visible}
        style={{ top: 20 }}
        onCancel={() => {
          setLanguage(undefined);
          setVisible(false);
          reload(isSaved);
        }}
        onOk={() => save()}
        okText={t('Save')}
        okButtonProps={{ loading, disabled: loading }}
      >
        <Form layout="vertical" form={form} className="one-language-create">
          <Row gutter={24}>
            <Col md={8}>
              <Form.Item
                label={t('Language name')}
                name="name"
                required
                rules={[{ required: true, message: t('Please type the language name') }]}
              >
                <Input placeholder={t('Type the language name')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Language code')}
                name="lang"
                required
                rules={[{ required: true, message: t('Please type the language code') }]}
              >
                <Input placeholder={t('Type the language code')} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t('Language ISO code')}
                name="isoCode"
                required
                rules={[{ required: true, message: t('Please type the language ISO code') }]}
              >
                <Input placeholder={t('Type the language ISO code')} />
              </Form.Item>
            </Col>
          </Row>

          <h2>{t('Translations')}</h2>
          <Collapse accordion>{Object.keys(translations).map((key) => renderFormList(key))}</Collapse>
        </Form>
      </Modal>
    </>
  );
};

export default LanguageCreate;
