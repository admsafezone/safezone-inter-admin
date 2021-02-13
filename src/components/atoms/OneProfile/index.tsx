import { FC, ReactElement } from 'react';
import Avatar from 'antd/es/avatar';
import Button from 'antd/es/button';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import { sls } from 'utils/StorageUtils';
import './style.less';

interface OneAvatarProps {
  onClick: () => void;
}

const OneProfile: FC<OneAvatarProps> = (props: OneAvatarProps): ReactElement => {
  const { company, changeLogged } = useAppContext();
  const { onClick } = props;
  const user = sls.getItem(Constants.storage.USER) || { name: '', image: '' };
  const { name, image } = user;

  const logout = () => {
    sls.clear();
    changeLogged();
  };

  return (
    <>
      <div className="profile" onClick={onClick}>
        <h2>{company?.name}</h2>
        <p>{name}</p>
        <Avatar className="profile-thumb" src={image || ''} size={40} />
      </div>
      <div className="profile-logout">
        <Button type="link" onClick={logout}>
          Logout
        </Button>
      </div>
    </>
  );
};

export default OneProfile;
