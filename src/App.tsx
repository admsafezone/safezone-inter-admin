import { FC, useState } from 'react';
import ConfigProvider from 'antd/es/config-provider';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import defaultService from 'services/defaultService';
import { User, ThemeOptions } from 'interfaces';
import AppContext from 'contexts/AppContext';
import OneSiderBar from 'components/templates/OneSiderBar';
import OneLogin from 'components/templates/OneLogin';
import { sls } from 'utils/StorageUtils';
import i18n, { antLang } from './i18n';
import Constants from 'utils/Constants';
import 'themes/default.less';
import 'themes/dark.less';

const App: FC = () => {
  const [user, setUser] = useState(JSON.parse(sls.getItem(Constants.storage.USER)));
  const [options, setOptions] = useState<ThemeOptions>(
    user?.options || { theme: 'light', componentSize: 'middle', lang: 'pt_br' },
  );
  const { t } = useTranslation();

  async function changeOptions(_options: ThemeOptions) {
    setOptions(_options || options);

    if (_options.lang) {
      sls.setItem(Constants.storage.LANG, _options.lang.replaceAll('_', '-'));
      await i18n.changeLanguage(_options.lang);
    }

    if (user?._id) {
      defaultService.put(`${Constants.api.USERS}/${user._id}`, { options: _options });
    }
  }

  function changeLogged(_user?: User) {
    setUser(_user);
    if (_user) {
      setOptions(_user?.options || options);
    }
  }

  return (
    <ConfigProvider locale={antLang[options.lang]} componentSize={options.componentSize}>
      <BrowserRouter>
        <AppContext.Provider value={{ options, t, changeOptions, changeLogged }}>
          {user?._id ? <OneSiderBar /> : <OneLogin onLogin={changeLogged} />}
        </AppContext.Provider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
