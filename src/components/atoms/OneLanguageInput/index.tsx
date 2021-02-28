import React, { FC } from 'react';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import './style.less';

interface OneLanguageInputProps {
  field: any;
  remove(fieldName: any): void;
  translate: string;
}

const OneLanguageInput: FC<OneLanguageInputProps> = ({
  field,
  remove,
  translate,
}: OneLanguageInputProps): JSX.Element => {
  return (
    <div key={`${translate}-${field.fieldKey}-row`} className="list-remove">
      <Form.Item
        {...field}
        name={[field.name, `key`]}
        key={`${translate}-${field.fieldKey}-key`}
        rules={[{ required: true, message: 'Translation key is required' }]}
      >
        <Input placeholder="Translation key text" />
      </Form.Item>

      <Form.Item
        {...field}
        name={[field.name, `value`]}
        key={`${translate}-${field.fieldKey}-value`}
        rules={[{ required: true, message: 'Translation is required' }]}
      >
        <Input placeholder="Translation text" />
      </Form.Item>

      <div className="list-remove-icon">
        <MinusCircleOutlined className="list-remove-icon" onClick={() => remove(field.name)} />
      </div>
    </div>
  );
};

export default React.memo<OneLanguageInputProps>(({ field, remove, translate }) => (
  <OneLanguageInput field={field} translate={translate} remove={remove} />
));
