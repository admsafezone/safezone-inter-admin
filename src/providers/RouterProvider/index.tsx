import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppContext } from 'providers/AppProvider';
import { OneThemeConfig } from 'components/organisms';
import { OneLogin, OneSiderBar, OneTopBar } from 'components/templates';

export const RouterProvider: FC = () => {
  const { user, options, changeLogged } = useAppContext();

  const selectLayout = () => {
    switch (options.layout) {
      case 'top-bar':
        return <OneTopBar />;
      case 'top-bar top-dark':
        return <OneTopBar />;
      case 'sider-bar':
      default:
        return <OneSiderBar />;
    }
  };

  return (
    <BrowserRouter>
      {user?.name ? selectLayout() : <OneLogin onLogin={changeLogged} />}
      {<OneThemeConfig />}
    </BrowserRouter>
  );
};
