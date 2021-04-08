import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAppContext } from 'providers/AppProvider';
import OneThemeConfig from 'components/organisms/OneThemeConfig';
import OneLogin from 'components/templates/OneLogin';
import OneSiderBar from 'components/templates/OneSiderBar';
import OneTopBar from 'components/templates/OneTopBar';

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
