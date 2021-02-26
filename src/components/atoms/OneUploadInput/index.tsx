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
  setGaleryVisible?(visible: boolean): void;
  setGaleryField?(fieldName?: string): void;
}

const OneUploadInput: FC<OneUploadInputProps> = ({
  value,
  setGaleryVisible,
  setGaleryField,
  ...props
}: OneUploadInputProps) => {
  const { t } = useAppContext();
  const [localValue, setLocalValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const { token } = sls.getItem(Constants.storage.TOKEN);

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
        setLocalValue(info.file.response?.data?.url);
        setLoading(false);
        break;
    }
  };

  return (
    <Input.Group>
      <Input
        type="url"
        className="one-upload-input"
        value={localValue}
        defaultValue={value}
        {...props}
        readOnly={loading}
        onChange={(e) => setLocalValue(e.target.value)}
        suffix={
          <>
            <Button
              type="primary"
              onClick={() => {
                if (setGaleryVisible) setGaleryVisible(true);
                if (setGaleryField) setGaleryField(props.id);
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
