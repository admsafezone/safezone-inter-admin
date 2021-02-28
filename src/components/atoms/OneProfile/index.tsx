import { FC, ReactElement } from 'react';
import Button from 'antd/es/button';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import { sls } from 'utils/StorageUtils';
import './style.less';

interface OneAvatarProps {
  onClick: () => void;
}

const OneProfile: FC<OneAvatarProps> = (props: OneAvatarProps): ReactElement => {
  const { t, company, changeLogged } = useAppContext();
  const { onClick } = props;
  const user = sls.getItem(Constants.storage.USER) || { name: '' };
  const { name } = user;

  const logout = () => {
    sls.clear();
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
        <Button type="link" onClick={onClick} icon={<SettingOutlined />} />
      </div>
    </>
  );
};

export default OneProfile;
