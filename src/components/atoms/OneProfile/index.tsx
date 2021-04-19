import { FC, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { useAppContext } from 'providers/AppProvider';
import { sls } from 'utils/StorageUtils';
import './style.less';

export const OneProfile: FC = (): ReactElement => {
  const { t, company, user, changeLogged, toggleConfigTheme } = useAppContext();
  const { profiles } = user || { profiles: [] };
  const history = useHistory();

  const logout = () => {
    sls.clear();
    history.push('/');
    changeLogged();
  };

  return (
    <>
      <div className="profile">
        <h2>{company?.name || t('NO COMPANY')}</h2>
        <Tooltip
          title={`${profiles.length > 1 ? t('Profiles') : t('Profile')}: ${profiles.join(', ')}`}
          placement="bottom"
        >
          <p>{user?.name}</p>
        </Tooltip>
        <div className="profile-thumb">
          {(user?.name || '')
            .split(' ')
            .map((item) => item.substring(0, 1).toUpperCase())
            .join('')}
        </div>
      </div>
      <div className="profile-actions">
        <Button type="link" onClick={logout} icon={<LogoutOutlined />}>
          {t('Logout')}
        </Button>
        <Button type="link" onClick={toggleConfigTheme} icon={<SettingOutlined />} />
      </div>
    </>
  );
};

export default OneProfile;
