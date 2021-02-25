import { FC, useState } from 'react';
import Modal from 'antd/es/modal';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { useAppContext } from 'providers/AppProvider';
import BraftEditor, { DraftEditorProps } from 'braft-editor';
import 'braft-editor/dist/index.css';

const OneTextEditor: FC<DraftEditorProps> = ({ value, media: { items }, ...props }: DraftEditorProps) => {
  const { t } = useAppContext();
  const [medias, setMedias] = useState(items);
  // const langMap = { en_us: 'en', pt_br: 'pt-br' };
  const controls = [
    'redo',
    'undo',
    'separator',
    'bold',
    'italic',
    'underline',
    'strike-through',
    'separator',
    'headings',
    'font-size',
    'line-height',
    'separator',
    'text-align',
    'text-color',
    'list-ol',
    'list-ul',
    'text-indent',
    'separator',
    'clear',
    'superscript',
    'subscript',
    'separator',
    'emoji',
    'blockquote',
    'hr',
    'link',
    'media',
    'remove-styles',
    'code',
    'fullscreen',
  ];

  const deleteMedia = async (media) => {
    if (media.length) {
      const mediaIds = media.map((med) => med.id);
      const response = await defaultService.delete(Constants.api.MEDIA, mediaIds);
      if (response.deletedCount) {
        setMedias(medias.filter((media) => !mediaIds.includes(media.id)));
      }
    }
  };

  const confirmDelete = async (media) => {
    if (media.length) {
      Modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: t('Are you sure you want to delete this media? All content that uses it will be affected'),
        okText: t('Delete'),
        cancelText: t('Cancel'),
        onOk: () => deleteMedia(media),
        zIndex: 999991,
        centered: true,
      });
    }
  };

  return (
    <>
      <BraftEditor
        {...props}
        language={'en'}
        value={BraftEditor.createEditorState(value)}
        controls={[...controls]}
        media={{ items: medias }}
        hooks={{
          'remove-medias': async (data) => {
            setMedias([...medias]);
            confirmDelete(data);
          },
        }}
      />
    </>
  );
};

export default OneTextEditor;
