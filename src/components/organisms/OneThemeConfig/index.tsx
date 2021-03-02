import { FC } from 'react';
import Drawer from 'antd/es/drawer';
import Form from 'antd/es/form';
import Radio from 'antd/es/radio';
import Select from 'antd/es/select';
import OneSelect from 'components/atoms/OneSelect';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import layoutSiderBar from 'assets/layout-sider-bar.svg';
import layoutTopBar from 'assets/layout-top-bar.svg';
import './style.less';

const { Option } = Select;

const OneThemeConfig: FC = (): JSX.Element => {
  const { options, changeOptions, t, toggleConfigTheme, configThemeVisible } = useAppContext();

  return (
    <Drawer
      className="one-sider-bar-right"
      title={t('System constomization')}
      placement="right"
      closable={true}
      onClose={() => toggleConfigTheme()}
      visible={configThemeVisible}
      width={350}
      style={{
        zIndex: 1000,
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
            <Radio value="dark">{t('Dark')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('Layout')}>
          <Radio.Group
            onChange={(event) => changeOptions({ ...options, layout: event.target.value })}
            value={options.layout}
          >
            <Radio value="sider-bar">
              <img src={layoutSiderBar} className="layout-icon" />
            </Radio>
            <Radio value="top-bar">
              <img src={layoutTopBar} className="layout-icon" />
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('Language')}>
          <OneSelect
            apiURL={`${Constants.api.LANGUAGES}/?select=name lang`}
            labelAttr="name"
            valueAttr="lang"
            defaultValue={options.lang}
            onSelect={(value: any) => changeOptions({ ...options, lang: value })}
            showArrow
            noDefaultOption
            useCache
          />
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
