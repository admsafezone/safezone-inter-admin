import { FC, ReactElement } from 'react';
import Layout from 'antd/es/layout';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import OneProfile from 'components/atoms/OneProfile';
import OneButton from 'components/atoms/OneButton';
import './style.less';

const { Header } = Layout;

interface OneFeaherProps {
  collapsed?: boolean;
  toggle?(): void;
  children?: ReactElement[];
}

export const OneHeader: FC<OneFeaherProps> = ({ collapsed, toggle, children }: OneFeaherProps): ReactElement => {
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
      {toggle && (
        <OneButton
          type="link"
          className={collapsed ? 'trigger collapsed' : 'trigger'}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggle}
        />
      )}

      {children}

      <OneProfile />
    </Header>
  );
};

export default OneHeader;
