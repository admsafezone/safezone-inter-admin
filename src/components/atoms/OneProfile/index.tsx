import { FC, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'antd/es/button';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import { sls } from 'utils/StorageUtils';
import './style.less';

const OneProfile: FC = (): ReactElement => {
  const { t, company, changeLogged, toggleConfigTheme } = useAppContext();
  const user = sls.getItem(Constants.storage.USER) || { name: '' };
  const history = useHistory();
  const { name } = user;

  const logout = () => {
    sls.clear();
    history.push('/');
    changeLogged();
  };

  return (
    <>
      <div className="profile">
        <h2>{company?.name}</h2>
        <p>{name}</p>
        <div className="profile-thumb">{name.substring(0, 1).toUpperCase()}</div>
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
