import { FC, ReactElement, useEffect } from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import { useAppContext } from 'providers/AppProvider';
import { Activity } from 'interfaces';
import './style.less';

const { Title } = Typography;
const domain = process.env.REACT_APP_DOMAIN;
const defaultPreview = process.env.REACT_APP_DEFAULT_PREVIEW || 'local';

interface ArticlePreviewProps {
  activity?: Activity;
  visible: boolean;
  setVisible(status: boolean): void;
}

const ActivityPreview: FC<ArticlePreviewProps> = ({
  visible,
  setVisible,
  activity,
}: ArticlePreviewProps): ReactElement => {
  const { t } = useAppContext();

  useEffect(() => {}, [visible, activity]);

  return (
    <>
      <Modal
        title={
          <Title level={3} className="one-modal-title">
            <ProjectOutlined /> {t('Activity preview')}
          </Title>
        }
        className="one-modal-activity-preview"
        width={'80vw'}
        visible={visible}
        style={{ top: 5 }}
        okButtonProps={{ style: { display: 'none' } }}
        cancelText={t('Close')}
        onCancel={() => setVisible(false)}
        cancelButtonProps={{ type: 'primary' }}
      >
        <iframe
          className="one-activity-preview-iframe"
          src={`https://${activity?.company?.identifier || defaultPreview}.${domain}/preview/${activity?._id}`}
          title={activity?.title}
        ></iframe>
      </Modal>
    </>
  );
};

export default ActivityPreview;
