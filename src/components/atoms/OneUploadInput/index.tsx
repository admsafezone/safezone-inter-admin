import { FC, useEffect, useState } from 'react';
import Button from 'antd/es/button';
import Input, { InputProps } from 'antd/es/input';
import Image from 'antd/es/image';
import Space from 'antd/es/space';
import PictureOutlined from '@ant-design/icons/PictureOutlined';
import { useAppContext } from 'providers/AppProvider';
import emptyImage from 'assets/placeholder-image.svg';
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
  const [image, setImage] = useState(value ? `${value}` : undefined);
  const fieldname = props.id || props.name || '';
  const previewSize = 180;

  useEffect(() => {
    setImage(value ? `${value}` : undefined);
  }, [value]);

  return (
    <div className={'one-input-upload'}>
      <Input {...props} type="hidden" value={value} />

      <Space size={12} align="center" className="one-upload-button">
        {image ? (
          <Image
            width={previewSize}
            height={previewSize}
            preview={{ src: image }}
            className="one-upload-preview"
            style={{
              backgroundImage: `url("${image}")`,
            }}
          />
        ) : (
          <Image
            src={emptyImage}
            width={previewSize}
            height={previewSize}
            preview={false}
            className="one-upload-preview no-image"
          />
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
          {t('Gallery')}
        </Button>
      </Space>
    </div>
  );
};

export default OneUploadInput;
