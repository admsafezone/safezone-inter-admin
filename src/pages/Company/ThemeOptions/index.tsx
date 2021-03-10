import { FC } from 'react';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import { useAppContext } from 'providers/AppProvider';
import OneInputColor from 'components/atoms/OneInputColor';
import OneUploadInput from 'components/atoms/OneUploadInput';

interface ThemeOptionsProps {
  mode: string;
  updateField(key: string, value?: string): void;
  setGaleryVisible(visible: boolean): void;
}

const ThemeOptions: FC<ThemeOptionsProps> = ({ mode, setGaleryVisible, updateField }: ThemeOptionsProps) => {
  const { t } = useAppContext();
  const prefixName = `theme.${mode}`;

  return (
    <>
      <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>
        {t('Images for $t({{mode}})', { mode })}
      </h2>
      <Row gutter={24}>
        <Col md={8}>
          <Form.Item
            label={t('Logo url')}
            name={`${prefixName}.logo`}
            rules={[{ required: true, message: t('Please select the logo url') }]}
          >
            <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Top background url')}
            name={`${prefixName}.backgroundTop`}
            rules={[{ type: 'url', message: t('Please select the background top url') }]}
          >
            <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Boby background url')}
            name={`${prefixName}.background`}
            rules={[{ type: 'url', message: t('Please select the background body url') }]}
          >
            <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
          </Form.Item>
        </Col>
      </Row>

      <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>
        {t('Colors for $t({{mode}}) theme', { mode })}
      </h2>
      <Row gutter={24}>
        <Col md={8}>
          <Form.Item
            label={t('Site primary color')}
            name={`${prefixName}.primaryColor`}
            required
            rules={[{ required: true, message: t('Please type the site primary color') }]}
          >
            <OneInputColor name={`${prefixName}.primaryColor`} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Site secondary color')}
            name={`${prefixName}.secondaryColor`}
            required
            rules={[{ required: true, message: t('Please type the site secondary color') }]}
          >
            <OneInputColor name={`${prefixName}.secondaryColor`} />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Site header colors')}</h3>
      <Row gutter={24}>
        <Col md={8}>
          <Form.Item
            label={t('Background color')}
            name={`${prefixName}.header.backgroundColor`}
            required
            rules={[{ required: true, message: t('Please type the site header background color') }]}
          >
            <OneInputColor name={`${prefixName}.header.backgroundColor`} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.header.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site header font color') }]}
          >
            <OneInputColor name={`${prefixName}.header.fontColor`} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.header.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site header font hover color') }]}
          >
            <OneInputColor name={`${prefixName}.header.fontHoverColor`} />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Site ranking colors')}</h3>
      <Row gutter={24}>
        <Col md={8}>
          <Form.Item
            label={t('Background color')}
            name={`${prefixName}.ranking.backgroundColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking background color') }]}
          >
            <OneInputColor name={`${prefixName}.ranking.backgroundColor`} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.ranking.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking font color') }]}
          >
            <OneInputColor name={`${prefixName}.ranking.fontColor`} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.ranking.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking font hover color') }]}
          >
            <OneInputColor name={`${prefixName}.ranking.fontHoverColor`} />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Site activity colors')}</h3>
      <Row gutter={24}>
        <Col md={8}>
          <Form.Item
            label={t('Background color')}
            name={`${prefixName}.activity.backgroundColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity background color') }]}
          >
            <OneInputColor name={`${prefixName}.activity.backgroundColor`} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.activity.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity font color') }]}
          >
            <OneInputColor name={`${prefixName}.activity.fontColor`} />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.activity.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity font hover color') }]}
          >
            <OneInputColor name={`${prefixName}.activity.fontHoverColor`} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ThemeOptions;
