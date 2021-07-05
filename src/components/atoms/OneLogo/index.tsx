import { FC, ReactElement } from 'react';
import { useAppContext } from 'providers/AppProvider';
import Constants from 'utils/Constants';
import './style.less';

export const OneLogo: FC = (): ReactElement => {
  const { company } = useAppContext();
  const appName = company.theme?.admin?.title || Constants.app.appName;
  const logo = company?.theme?.admin?.logo;

  return (
    <div
      className="logo-container"
      style={{
        backgroundColor: company?.theme?.admin?.backgroundColor,
      }}
    >
      {logo && <img src={logo} alt={appName} title={appName} />}
      {!logo && appName && <div className="logo-title">{appName}</div>}
      <div className="collapsed-title" title={appName}>
        {appName?.substring(0, 1)}
      </div>
    </div>
  );
};

export default OneLogo;
