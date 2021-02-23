import { FC } from 'react';
import { useAppContext } from 'providers/AppProvider';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Input from 'antd/es/input';

interface ThemeOptionsProps {
  mode: string;
}

const ThemeOptions: FC<ThemeOptionsProps> = ({ mode }: ThemeOptionsProps) => {
  const { t } = useAppContext();
  const prefixName = `theme.${mode}`;

  return (
    <>
      <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Images options')}</h2>
      <Row gutter={24}>
        <Col md={8}>
          <Form.Item
            label={t('Logo url')}
            name={`${prefixName}.logo`}
            rules={[{ required: true, type: 'url', message: t('Please type the logo url') }]}
          >
            <Input placeholder="https://s3.bucket.aws.com/image.png" type="url" />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Top background url')}
            name={`${prefixName}.backgroundTop`}
            rules={[{ required: true, type: 'url', message: t('Please type the background top url') }]}
          >
            <Input placeholder="https://s3.bucket.aws.com/image.png" type="url" />
          </Form.Item>
        </Col>
        <Col md={8}>
          <Form.Item
            label={t('Boby background url')}
            name={`${prefixName}.background`}
            rules={[{ required: true, type: 'url', message: t('Please type the background body url') }]}
          >
            <Input placeholder="https://s3.bucket.aws.com/image.png" type="url" />
          </Form.Item>
        </Col>
      </Row>

      <h2 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Colors options')}</h2>
      <Row gutter={24}>
        <Col md={6}>
          <Form.Item
            label={t('Site primary color')}
            name={`${prefixName}.primaryColor`}
            required
            rules={[{ required: true, message: t('Please type the site primary color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Site secondary color')}
            name={`${prefixName}.secondaryColor`}
            required
            rules={[{ required: true, message: t('Please type the site secondary color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
      </Row>

      <h3 style={{ borderBottom: '1px solid #ccc', display: 'block', width: '100%' }}>{t('Site header colors')}</h3>
      <Row gutter={24}>
        <Col md={6}>
          <Form.Item
            label={t('Background color')}
            name={`${prefixName}.header.backgroundColor`}
            required
            rules={[{ required: true, message: t('Please type the site header background color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.header.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site header font color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.header.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site header font hover color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
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
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.ranking.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking font color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.ranking.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site ranking font hover color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
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
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font color')}
            name={`${prefixName}.activity.fontColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity font color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label={t('Font hover color')}
            name={`${prefixName}.activity.fontHoverColor`}
            required
            rules={[{ required: true, message: t('Please type the site activity font hover color') }]}
          >
            <Input placeholder="#1a3a53" type="color" allowClear />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ThemeOptions;
