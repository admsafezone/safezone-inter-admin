import { FC } from 'react';
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

const { Footer } = Layout;

const OneTopBar: FC = (): JSX.Element => {
  const { options } = useAppContext();

  return (
    <Layout className={`one-layout top-bar ${options.theme}`}>
      <Layout className="one-content-layout">
        <OneHeader>
          <OneLogo appName={Constants.app.appName} logo={logo} />
          <OneMenu theme={options.theme} menus={menus} mode="horizontal" />
        </OneHeader>

        <Routes menus={menus} />

        <Footer
          className="one-footer-layout"
          style={{
            padding: 24,
          }}
        >
          {process.env.REACT_APP_NAME} @ 2021
        </Footer>
      </Layout>
    </Layout>
  );
};

export default OneTopBar;
