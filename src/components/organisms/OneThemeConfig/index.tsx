import { FC, useEffect, useState } from 'react';
import Drawer from 'antd/es/drawer';
import Form from 'antd/es/form';
import Radio from 'antd/es/radio';
import Select from 'antd/es/select';
import OneSelect from 'components/atoms/OneSelect';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import defaultService from 'services/defaultService';
import { checkACL, tokenDecode } from 'utils/AclUtils';
import { sls } from 'utils/StorageUtils';
import layoutSiderBar from 'assets/layout-sider-bar.svg';
import layoutTopBar from 'assets/layout-top-bar.svg';
import layoutTopBarDark from 'assets/layout-top-bar-dark.svg';
import './style.less';

const { Option } = Select;

export const OneThemeConfig: FC = (): JSX.Element => {
  const { options, user, changeOptions, t, toggleConfigTheme, configThemeVisible } = useAppContext();
  const [value, setValue] = useState(user?.company?.identifier);

  const onChangeCompany = async (identifier) => {
    setValue(identifier);
    const config = {
      url: `${defaultService.api.defaults.baseURL}/${Constants.api.REFRESH}`,
      method: 'post',
      headers: { ...defaultService.api.defaults.headers, identifier },
    };
    const response = await defaultService.request(config);
    sls.setItem(Constants.storage.TOKEN, response);
    const decoded = tokenDecode(response.token);
    const { user, sub } = decoded;
    user._id = sub;
    sls.setItem(Constants.storage.USER, user);
    window.location.reload();
  };

  useEffect(() => {
    setValue(user?.company?.identifier);
  }, [user]);

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
        {checkACL(Constants.acl.DEFAULT, Constants.permissions.M) || user?.company?.like ? (
          <Form.Item label={t('Session company')}>
            <OneSelect
              apiURL={`${Constants.api.COMPANIES}/?select=identifier name`}
              labelAttr="name"
              valueAttr="identifier"
              showArrow
              noDefaultOption
              useCache
              value={value}
              onChange={(value) => onChangeCompany(value)}
              placeholder={t('Company')}
            />
          </Form.Item>
        ) : (
          ''
        )}

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
            <Radio value="top-bar top-dark">
              <img src={layoutTopBarDark} className="layout-icon" />
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
