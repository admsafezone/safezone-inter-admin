import { FC, useEffect, useState } from 'react';
import Modal from 'antd/es/modal';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import defaultService from 'services/defaultService';
import Constants from 'utils/Constants';
import { useAppContext } from 'providers/AppProvider';
import BraftEditor, { DraftEditorProps } from 'braft-editor';
import { Media } from 'interfaces';
import 'braft-editor/dist/index.css';

const validFiles = process.env.REACT_APP_MEDIA_TYPE
  ? process.env.REACT_APP_MEDIA_TYPE.split(';')
  : ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];

const OneTextEditor: FC<DraftEditorProps> = ({ value, ...props }: DraftEditorProps) => {
  const { t } = useAppContext();
  const [medias, setMedias] = useState<Media[]>([]);
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

  const getMedias = async () => {
    const response = await defaultService.get(`${Constants.api.MEDIA}/?select=url type`, []);
    setMedias(response);
  };

  const uploadHendler = async ({ file, progress }) => {
    if (file && validFiles.includes(file.type)) {
      const data = new FormData();
      data.append('file', file);

      const requestConfig = {
        url: Constants.api.MEDIA,
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: function (_data) {
          progress((_data.loaded * 100) / _data.total);
        },
        data,
      };

      const response = await defaultService.request(requestConfig);

      if (response._id) {
        const newMedia = {
          id: response._id,
          url: response.url,
          type: response.type,
        };

        setMedias([...medias, newMedia]);
      }
    }
  };

  const deleteMedia = async (media) => {
    if (media.length) {
      const mediaIds = media.map((med) => med.id);
      const response = await defaultService.delete(Constants.api.MEDIA, mediaIds);

      if (response.deletedCount) {
        setMedias(medias.filter((media: Media) => !mediaIds.includes(media.id)));
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

  useEffect(() => {
    getMedias();
  }, []);

  return (
    <>
      <BraftEditor
        {...props}
        language={'en'}
        value={BraftEditor.createEditorState(value)}
        controls={[...controls]}
        media={{ items: medias, uploadFn: uploadHendler }}
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
