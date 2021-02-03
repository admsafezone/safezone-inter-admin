import { FC, ReactElement } from 'react';
import './style.less';

interface LogoProps {
  appName: string;
  logo: string;
}

const OneLogo: FC<LogoProps> = (props: LogoProps): ReactElement => {
  const { appName, logo } = props;
  return (
    <div className="logo-container">
      <img src={logo} alt={appName} />
      <span>{appName}</span>
    </div>
  );
};

export default OneLogo;
