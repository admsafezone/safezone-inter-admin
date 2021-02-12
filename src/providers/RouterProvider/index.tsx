import { BrowserRouter } from 'react-router-dom';
import { useAppContext } from 'providers/AppProvider';
import OneLogin from 'components/templates/OneLogin';
import OneSiderBar from 'components/templates/OneSiderBar';

export const RouterProvider = () => {
  const { user, changeLogged } = useAppContext();

  return <BrowserRouter>{user?.name ? <OneSiderBar /> : <OneLogin onLogin={changeLogged} />}</BrowserRouter>;
};
