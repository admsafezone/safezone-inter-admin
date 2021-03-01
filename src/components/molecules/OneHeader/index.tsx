import { FC, ReactElement, useState } from 'react';
import Layout from 'antd/es/layout';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import OneProfile from 'components/atoms/OneProfile';
import OneButton from 'components/atoms/OneButton';
import OneThemeConfig from 'components/organisms/OneThemeConfig';
import './style.less';

const { Header } = Layout;

interface OneFeaherProps {
  collapsed?: boolean;
  toggle(): void;
}

const OneHeader: FC<OneFeaherProps> = ({ collapsed, toggle }: OneFeaherProps): ReactElement => {
  const [collapsedRight, setCollapsedRight] = useState(false);

  function toggleRight() {
    setCollapsedRight(!collapsedRight);
  }
  return (
    <Header
      className="one-header-layout"
      style={{
        position: 'fixed',
        zIndex: 999,
        width: '100vw',
        padding: 0,
      }}
    >
      <OneButton
        type="link"
        className={collapsed ? 'trigger collapsed' : 'trigger'}
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
      />

      <OneProfile onClick={() => setCollapsedRight(!collapsedRight)} />
      <OneThemeConfig visible={collapsedRight} toggleVisible={toggleRight} />
    </Header>
  );
};

export default OneHeader;
