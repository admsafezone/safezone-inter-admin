import { FC } from 'react';
import BraftEditor, { DraftEditorProps } from 'braft-editor';
import 'braft-editor/dist/index.css';

const OneTextEditor: FC<DraftEditorProps> = ({ value, ...props }: DraftEditorProps) => {
  const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media'];

  return (
    <>
      <BraftEditor {...props} language="en" value={BraftEditor.createEditorState(value)} controls={controls} />
    </>
  );
};

export default OneTextEditor;
