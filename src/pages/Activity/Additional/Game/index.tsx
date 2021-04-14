import { FC, useState } from 'react';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Row from 'antd/es/row';
import Upload from 'antd/es/upload';
import message from 'antd/es/message';
import Select from 'antd/es/select';
import InboxOutlined from '@ant-design/icons/InboxOutlined';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import './style.less';
import OneButton from 'components/atoms/OneButton';
import { checkACL } from 'utils/AclUtils';

interface GameProps {
  data?: any;
  updateField(key: string, value?: string): void;
}

const Game: FC<GameProps> = ({ data, updateField }: GameProps) => {
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(data?.url);

  const uploadHendler = async (file: any) => {
    if (file && ['application/zip'].includes(file.type)) {
      setLoading(true);
      const data = new FormData();
      data.append('file', file);

      const requestConfig = {
        url: `${Constants.api.ACTIVITIES}/upload/game`,
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data,
      };

      const response = await defaultService.request(requestConfig);

      if (response.url) {
        setWebsiteUrl(response.url);
        updateField('data.url', response.url);
        updateField('data.bucket', response.bucket);
        message.success(t('File uploaded successfully'));
      } else {
        message.error(t('Error on try to upload the file'));
      }
      setLoading(false);
    } else {
      message.error(t('Invalid file type, use zip file.'));
    }
  };

  return (
    <>
      <Row gutter={24} className="one-game-upload">
        {checkACL(Constants.acl.ACTIVITIES, Constants.permissions.F) && (
          <>
            <Col md={16}>
              <Form.Item
                label={t('Game zip file')}
                name={['data', 'zipFile']}
                rules={[{ required: !data?.url, message: 'Zip file is required' }]}
              >
                <Upload
                  accept=".zip"
                  name="file"
                  showUploadList={false}
                  onChange={async (info) => {
                    if (!loading) {
                      await uploadHendler(info.file);
                    }
                  }}
                >
                  <OneButton loading={loading} icon={<InboxOutlined />} style={{ display: 'inline-block' }}>
                    {t('Upload a zip file')}
                  </OneButton>
                  <p style={{ display: 'inline-block', marginLeft: '16px' }}>
                    {t('Upload a .zip with all game files at the root and you need to have an index.html')}
                  </p>
                </Upload>
              </Form.Item>
            </Col>
          </>
        )}

        <Col md={8}>
          <Form.Item name={['data', 'displayMode']} label={t('Game display mode')}>
            <Select defaultValue={'fullscreem'}>
              <Select.Option value="fullscreem">{t('Full Screem')}</Select.Option>
              <Select.Option value="in-content">{t('In content')}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Form.Item name={['data', 'url']}>
          <Input hidden />
        </Form.Item>
        <Form.Item hidden name={['data', 'bucket']}>
          <Input hidden />
        </Form.Item>

        <Col md={24}>{websiteUrl && <iframe src={websiteUrl} className="one-game-preview"></iframe>}</Col>
      </Row>
    </>
  );
};

export default Game;
