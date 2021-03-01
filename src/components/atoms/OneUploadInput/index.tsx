import { FC, useEffect, useState } from 'react';
import Button from 'antd/es/button';
import Input, { InputProps } from 'antd/es/input';
import Upload from 'antd/es/upload';
import Image from 'antd/es/image';
import Space from 'antd/es/space';
import PictureOutlined from '@ant-design/icons/PictureOutlined';
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import { sls } from 'utils/StorageUtils';
import api from 'services/api';
import './style.less';

interface OneUploadInputProps extends InputProps {
  updateField(key: string, value?: string): void;
  setGaleryVisible(visible: boolean): void;
}

const OneUploadInput: FC<OneUploadInputProps> = ({
  value,
  setGaleryVisible,
  updateField,
  ...props
}: OneUploadInputProps) => {
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(value ? `${value}` : undefined);
  const { token } = sls.getItem(Constants.storage.TOKEN);
  const fieldname = props.id || props.name || '';

  const onChangeHandler = (info) => {
    switch (info.file.status) {
      case 'uploading':
        setLoading(true);
        break;

      case 'error':
        setLoading(false);
        break;

      case 'done':
      default:
        updateField(fieldname, info.file.response?.data?.url);
        setLoading(false);
        break;
    }
  };

  useEffect(() => {
    setImage(value ? `${value}` : undefined);
  }, [value]);

  return (
    <div className={'one-input-upload'}>
      <Input {...props} type="hidden" value={value} />

      <Space size={12} align="center" className="one-upload-button">
        {image ? (
          <Image
            width={150}
            height={150}
            preview={{ src: image }}
            className="one-upload-preview"
            style={{
              backgroundImage: `url("${image}")`,
              zIndex: 3007,
            }}
          />
        ) : (
          ''
        )}

        <Button
          type="primary"
          onClick={() => {
            setGaleryVisible(true);
            updateField(fieldname);
          }}
          icon={<PictureOutlined />}
          style={{ marginRight: '4px' }}
        >
          {t('Galery')}
        </Button>

        <Upload
          name="file"
          action={`${api.defaults.baseURL}/${Constants.api.MEDIA}`}
          headers={{
            authorization: `Bearer ${token}`,
          }}
          onChange={onChangeHandler}
          itemRender={() => null}
        >
          <Button type="primary" loading={loading} icon={<UploadOutlined />}>
            {t('Upload')}
          </Button>
        </Upload>
      </Space>
    </div>
  );
};

export default OneUploadInput;
