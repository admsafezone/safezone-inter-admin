import { FC, useContext } from 'react';
import Drawer from 'antd/es/drawer';
import Form from 'antd/es/form';
import Radio from 'antd/es/radio';
import Select from 'antd/es/select';
import AppContext from 'contexts/AppContext';
import { Lang } from 'i18n';
import './style.less';

const { Option } = Select;

interface OneThemeConfigProps {
  visible: boolean;
  toggleVisible(visible: boolean): void;
}

const OneThemeConfig: FC<OneThemeConfigProps> = ({ visible, toggleVisible }: OneThemeConfigProps): JSX.Element => {
  const { options, changeOptions, t } = useContext(AppContext);

  return (
    <Drawer
      className="one-sider-bar-right"
      title={t('System constomization')}
      placement="right"
      closable={true}
      onClose={() => toggleVisible(visible)}
      visible={visible}
      width={350}
      style={{
        zIndex: 1003,
      }}
    >
      <Form layout="vertical">
        <Form.Item label={t('Components size')}>
          <Radio.Group
            onChange={(event) => changeOptions({ ...options, componentSize: event.target.value })}
            value={options.componentSize}
          >
            <Radio value="large">{t('Large')}</Radio>
            <Radio value="middle">{t('Middle')}</Radio>
            <Radio value="small">{t('Small')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('Theme')}>
          <Radio.Group
            onChange={(event) => changeOptions({ ...options, theme: event.target.value })}
            value={options.theme}
          >
            <Radio value="light">{t('Light')}</Radio>
            <Radio value="dark">{t('dark')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('Language')}>
          <Select onSelect={(value: Lang) => changeOptions({ ...options, lang: value })} defaultValue={options.lang}>
            <Option value="pt_br">{t('Portuguese')}</Option>
            <Option value="en">{t('English')}</Option>
          </Select>
        </Form.Item>
        <Form.Item label={t('Default page items number')}>
          <Select
            onSelect={(value: number) => changeOptions({ ...options, pagerLimit: value })}
            defaultValue={options.pagerLimit || 20}
          >
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
            <Option value={200}>200</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default OneThemeConfig;
