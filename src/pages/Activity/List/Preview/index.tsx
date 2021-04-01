import { FC, ReactElement } from 'react';
import Modal from 'antd/es/modal';
import Typography from 'antd/es/typography';
import ProjectOutlined from '@ant-design/icons/ProjectOutlined';
import { useAppContext } from 'providers/AppProvider';
import { sls } from 'utils/StorageUtils';
import { Activity } from 'interfaces';
import Constants from 'utils/Constants';
import './style.less';

const { Title } = Typography;
const clientDomain = process.env.REACT_APP_CLIENT_HOST;
const defaultPreview = process.env.REACT_APP_DEFAULT_PREVIEW || 'local';
const defaultIdentifier = process.env.REACT_APP_DEFAULT_IDENTIFIER || 'admin';

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
  const tokenData = sls.getItem(Constants.storage.TOKEN);
  const identifier = activity?.company?.identifier || defaultIdentifier;
  const domain = clientDomain?.replace('[identifier]', identifier !== defaultIdentifier ? identifier : defaultPreview);
  const previewUrl = `${domain}/preview/${activity?._id}?token=${tokenData.token}&identifier=${identifier}`;

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
        {activity?.title && (
          <iframe className="one-activity-preview-iframe" src={previewUrl} title={activity?.title}></iframe>
        )}
      </Modal>
    </>
  );
};

export default ActivityPreview;
