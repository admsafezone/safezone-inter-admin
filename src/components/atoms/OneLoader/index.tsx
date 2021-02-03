import { FC, ReactElement, useContext } from 'react';
import Spin from 'antd/es/spin';
import AppContext from 'contexts/AppContext';
import './style.less';

interface LoaderProps {
  show: boolean;
  text?: string;
}

const OneLoader: FC<LoaderProps> = (props: LoaderProps): ReactElement => {
  const { t } = useContext(AppContext);
  const { show = false, text = t('Loading...') } = props;
  return (
    <div className={show ? 'one-loader' : 'one-loader hidden'}>
      <Spin className="one-loader-spin" size="large">
        {text}
      </Spin>
    </div>
  );
};

export default OneLoader;
