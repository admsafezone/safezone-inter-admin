import { FC } from 'react';
import { antLang } from 'i18n';
import AntConfigProvider from 'antd/es/config-provider';
import { useAppContext } from 'providers/AppProvider';

export const ConfigProvider: FC = ({ children }: any) => {
  const { options } = useAppContext();

  return (
    <AntConfigProvider locale={antLang[options.lang]} componentSize={options.componentSize}>
      {children}
    </AntConfigProvider>
  );
};
