import { FC } from 'react';
import { Row, Col, Form, Input } from 'antd/es';
import { OneInputColor, OneUploadInput } from 'components/atoms';
import { useAppContext } from 'providers/AppProvider';

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
        <Col md={6}>
          <Form.Item
            label={t('Site logo image')}
            name={`${prefixName}.logo`}
            rules={[{ required: true, message: t('Please select the logo url') }]}
          >
            <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Site boby background image')}
            name={`${prefixName}.background`}
            rules={[{ message: t('Please select the background body image') }]}
          >
            <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Site top background image')}
            name={`${prefixName}.backgroundTop`}
            rules={[{ message: t('Please select the background top image') }]}
          >
            <OneUploadInput setGaleryVisible={setGaleryVisible} updateField={updateField} />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Site footer background image')}
            name={`${prefixName}.backgroundFooter`}
            rules={[{ message: t('Please select the background body image') }]}
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
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Site secondary color')}
            name={`${prefixName}.secondaryColor`}
            required
            rules={[{ required: true, message: t('Please type the site secondary color') }]}
          >
            <OneInputColor />
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
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.header.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site header font color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.header.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site header font hover color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={24}>
          <Form.Item label={t('Backgournd pattern')} name={`${prefixName}.header.backgroundPattern`}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Site ranking colors')}</h3>
      <Row gutter={24}>
        <Col md={6}>
          <Form.Item
            label={t('Background color')}
            name={`${prefixName}.ranking.backgroundColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking background color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.ranking.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking font color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.ranking.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking font hover color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Background color thumb first')}
            name={`${prefixName}.ranking.backgroundColorThumbFirst`}
            required
            rules={[{ message: t('Please type the site ranking background color first') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Background color thumb second')}
            name={`${prefixName}.ranking.backgroundColorThumbSecond`}
            required
            rules={[{ message: t('Please type the site ranking background color second') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Background color thumb third')}
            name={`${prefixName}.ranking.backgroundColorThumbThird`}
            required
            rules={[{ message: t('Please type the site ranking background color third') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Background color active')}
            name={`${prefixName}.ranking.backgroundColorActive`}
            required
            rules={[{ message: t('Please type the site ranking background color active') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Site activity colors')}</h3>
      <Row gutter={24}>
        <Col md={6}>
          <Form.Item
            label={t('Background color')}
            name={`${prefixName}.activity.backgroundColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity background color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.activity.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity font color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.activity.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity font hover color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Title color')}
            name={`${prefixName}.activity.titleColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity title color') }]}
          >
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item label={t('Button font color')} name={`${prefixName}.activity.fontColorBtn`}>
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item label={t('Button font color hover')} name={`${prefixName}.activity.fontColorBtnHover`}>
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item label={t('Button background color')} name={`${prefixName}.activity.backgroundColorBtn`}>
            <OneInputColor />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item label={t('Button background hover color')} name={`${prefixName}.activity.backgroundColorBtnHover`}>
            <OneInputColor />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ThemeOptions;
