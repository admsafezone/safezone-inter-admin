import { FC, useState } from 'react';
import Layout from 'antd/es/layout';

import OneLogo from 'components/atoms/OneLogo';
import OneMenu from 'components/molecules/OneMenu';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import OneHeader from 'components/molecules/OneHeader';
import Routes from '../../../routes';
import menus from '../../../routes/menu';
import logo from 'assets/logo.svg';
import './style.less';

const { Sider, Footer } = Layout;

const OneSiderBar: FC = (): JSX.Element => {
  const { options } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  function toggle() {
    setCollapsed(!collapsed);
  }

  return (
    <Layout className={`one-layout ${options.theme} ${options?.layout} ${collapsed ? 'collapsed' : ''}`}>
      <Sider
        className="one-sider-bar-left"
        theme={options.theme}
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        collapsedWidth={81}
        style={{
          position: 'fixed',
          zIndex: 1000,
          height: '100vh',
        }}
      >
        <OneLogo appName={Constants.app.appName} logo={logo} />
        <OneMenu theme={options.theme} menus={menus} />
      </Sider>
      <Layout className="one-bar-layout">
        <OneHeader collapsed={collapsed} toggle={toggle} />
        <Routes menus={menus} />
        <Footer
          className="one-footer-layout"
          style={{
            padding: 24,
            marginLeft: collapsed ? 80 : 250,
          }}
        >
          {process.env.REACT_APP_NAME} @ 2021
        </Footer>
      </Layout>
    </Layout>
  );
};

export default OneSiderBar;
