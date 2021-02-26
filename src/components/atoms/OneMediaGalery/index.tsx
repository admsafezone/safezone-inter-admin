import { FC, useEffect, useState } from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';
import PictureOutlined from '@ant-design/icons/PictureOutlined';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import { Media } from 'interfaces';
import Constants from 'utils/Constants';
import './style.less';

const { Title } = Typography;

interface OneMediaGaleryProps {
  onSelectMedia(url: string, fieldName: string): void;
  fieldName: string;
  setVisible(visible: boolean): void;
  visible: boolean;
}

const OneMediaGalery: FC<OneMediaGaleryProps> = ({
  onSelectMedia,
  fieldName,
  setVisible,
  visible,
}: OneMediaGaleryProps) => {
  const { t } = useAppContext();
  const [medias, setMedias] = useState<Media[]>([]);

  const getMedias = async () => {
    const response = await defaultService.get(`${Constants.api.MEDIA}/?select=url type`, []);
    setMedias(response);
  };

  const renderMadia = (media: Media) => {
    return (
      <div className="one-media-galery-wrapper" onClick={() => onSelectMedia(media.url, fieldName)}>
        <div
          className="one-media-galery-img"
          key={media.id}
          title={media.url}
          style={{
            backgroundImage: `url("${media.url}")`,
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    getMedias();
  }, []);

  return (
    <>
      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <PictureOutlined /> {t('Media galery')}
          </Title>
        }
        width={'60vw'}
        bodyStyle={{ height: '750px' }}
        visible={visible}
        zIndex={1005}
        centered
        okText={t('Close')}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        closable={true}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div className="one-media-galery">{medias.map(renderMadia)}</div>
      </Modal>
    </>
  );
};

export default OneMediaGalery;
