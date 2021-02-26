import { FC, useState } from 'react';
import Button from 'antd/es/button';
import Input from 'antd/es/input';
import { InputProps } from 'antd/lib/input';
import Upload from 'antd/es/upload';
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

  return (
    <Input.Group>
      <Input
        {...props}
        type="url"
        className="one-upload-input"
        value={value}
        readOnly={loading}
        suffix={
          <>
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
          </>
        }
      />
    </Input.Group>
  );
};

export default OneUploadInput;
