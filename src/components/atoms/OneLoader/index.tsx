import { FC, ReactElement } from 'react';
import Spin from 'antd/es/spin';
import { useAppContext } from 'providers/AppProvider';
import './style.less';

interface LoaderProps {
  show: boolean;
  text?: string;
}

const OneLoader: FC<LoaderProps> = (props: LoaderProps): ReactElement => {
  const { t } = useAppContext();
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
