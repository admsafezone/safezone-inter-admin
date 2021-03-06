import { FC, useEffect, useState } from 'react';
import Button from 'antd/es/button';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';
import Popconfirm from 'antd/es/popconfirm';
import Upload from 'antd/es/upload';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import PictureOutlined from '@ant-design/icons/PictureOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import { useAppContext } from 'providers/AppProvider';
import OneLoader from 'components/atoms/OneLoader';
import defaultService from 'services/defaultService';
import { Media } from 'interfaces';
import Constants from 'utils/Constants';
import './style.less';

const { Title } = Typography;

interface OneMediaGaleryProps {
  updateField(key: string, value?: string): void;
  fieldName: string;
  setVisible(visible: boolean): void;
  visible: boolean;
}

export const OneMediaGalery: FC<OneMediaGaleryProps> = ({
  updateField,
  fieldName,
  setVisible,
  visible,
}: OneMediaGaleryProps) => {
  const { t } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [medias, setMedias] = useState<Media[]>([]);
  const [selectMadia, setSelectMadia] = useState<Media>();
  let isMounted = true;

  const getMedias = async () => {
    const response = await defaultService.get(`${Constants.api.MEDIA}/?select=url type`, []);
    if (isMounted) setMedias(response);
  };

  const handleDeleteMedia = async (id) => {
    setLoading(true);
    await defaultService.delete(`${Constants.api.MEDIA}/${id}`);
    await getMedias();
    setLoading(false);
  };

  const uploadAction = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', data.file);
    const config = {
      url: `${Constants.api.MEDIA}`,
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    };
    await defaultService.request(config);
    getMedias();
    setLoading(false);
  };

  const onClickDeleteHendler = (event) => {
    event.stopPropagation();
  };

  const renderMadia = (media: Media) => {
    return (
      <div key={media.id} className="one-media-galery-wrapper">
        <div
          onClick={() => {
            setSelectMadia(media.id !== selectMadia?.id ? media : undefined);
          }}
          className={`one-media-galery-img ${media.id === selectMadia?.id ? 'selected' : ''}`}
          key={media.id}
          title={media.url}
          style={{
            backgroundImage: `url("${media.url}")`,
          }}
        >
          <Popconfirm
            title={t('Are you sure you want to delete this media? All content that uses it will be affected')}
            icon={<ExclamationCircleOutlined />}
            onConfirm={() => handleDeleteMedia(media.id)}
            onCancel={onClickDeleteHendler}
          >
            <CloseOutlined className="one-media-delete-image" onClick={onClickDeleteHendler} />
          </Popconfirm>
          <CheckOutlined className="one-media-check-image" />
        </div>
      </div>
    );
  };

  useEffect(() => {
    getMedias();
    setSelectMadia(undefined);

    return () => {
      isMounted = false;
    };
  }, [fieldName]);

  return (
    <>
      <OneLoader show={loading} />

      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <PictureOutlined /> {t('Media gallery')}
          </Title>
        }
        className="one-media-galery"
        width={'60vw'}
        bodyStyle={{ height: '750px', overflowY: 'auto' }}
        visible={visible}
        zIndex={1005}
        centered
        footer={
          <>
            <Button
              type="default"
              onClick={() => {
                setVisible(false);
              }}
            >
              {t('Close')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                updateField(fieldName, selectMadia?.url || '');
                setVisible(false);
              }}
            >
              {selectMadia?.url ? t('Set') : t('None')}
            </Button>

            <Upload name="file" customRequest={uploadAction} itemRender={() => null} className="one-galery-upload">
              <Button type="primary" loading={loading} icon={<UploadOutlined />}>
                {t('Upload')}
              </Button>
            </Upload>
          </>
        }
      >
        <div>{medias.map(renderMadia)}</div>
      </Modal>
    </>
  );
};

export default OneMediaGalery;
