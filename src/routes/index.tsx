import { FC, ReactElement } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from 'antd/es/layout';
import OnePageHeader from '../components/atoms/OnePageHeader';
import { checkACL } from 'utils/AclUtils';
import Constants from 'utils/Constants';
import { MenuItem } from './menu';
import { useAppContext } from 'providers/AppProvider';

const { Content } = Layout;

interface RoutesProps {
  menus: MenuItem[];
}

const Routes: FC<RoutesProps> = ({ menus }: RoutesProps): ReactElement => {
  const { t } = useAppContext();

  function mapMenu(item: MenuItem, i: string, routes: MenuItem[] = []): any {
    const routesList: MenuItem[] = [
      ...routes,
      {
        path: item.path,
        breadcrumbName: t(item.title || ''),
      },
    ];
    const path = routesList.map((it) => it.path).join('');

    if (!item.aclResource || checkACL(item.aclResource, Constants.permissions.R)) {
      if (item.component) {
        const Component: React.ElementType = item.component;
        return (
          <Route
            key={i}
            path={path}
            exact={!!item.exact}
            component={() => (
              <Content className="one-layout-content">
                {!item.noHeader && <OnePageHeader title={t(item.title || '')} subTitle={t(item.subTitle || '')} />}
                <Component />
              </Content>
            )}
          />
        );
      }
      if (item.children) {
        return item.children.map((child, s) => mapMenu(child, `${i}-${s}`, routesList));
      }
    }
    return null;
  }

  return (
    <Switch>
      {menus.map((item: MenuItem, i: number) => mapMenu(item, `${i}`, []))}
      <Redirect to="/" />
    </Switch>
  );
};

export default Routes;
