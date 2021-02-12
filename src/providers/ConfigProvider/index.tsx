import AntConfigProvider from 'antd/es/config-provider';
import { useAppContext } from 'providers/AppProvider';
import { antLang } from 'i18n';

export const ConfigProvider = ({ children }: any) => {
  const { options } = useAppContext();

  return (
    <AntConfigProvider locale={antLang[options.lang]} componentSize={options.componentSize}>
      {children}
    </AntConfigProvider>
  );
};
