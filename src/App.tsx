import { FC } from 'react';
import { AppProvider } from 'providers/AppProvider';
import { ConfigProvider } from 'providers/ConfigProvider';
import { RouterProvider } from 'providers/RouterProvider';
import 'themes/default.less';
import 'themes/dark.less';

const App: FC = () => {
  return (
    <AppProvider>
      <ConfigProvider>
        <RouterProvider />
      </ConfigProvider>
    </AppProvider>
  );
};

export default App;
