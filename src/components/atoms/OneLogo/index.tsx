import { FC, ReactElement } from 'react';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import './style.less';

export const OneLogo: FC = (): ReactElement => {
  const { company } = useAppContext();
  const appName = company?.name || Constants.app.appName;
  const logo = company?.theme?.light?.logo;

  return (
    <div className="logo-container">
      {logo && (
        <img
          src={logo}
          alt={appName}
          style={{
            backgroundColor: company?.theme?.light?.header?.backgroundColor,
            padding: '3px 10px',
          }}
        />
      )}
      {!logo && appName && <span>{appName}</span>}
    </div>
  );
};

export default OneLogo;
