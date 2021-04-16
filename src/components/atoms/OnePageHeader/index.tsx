import { FC, ReactElement } from 'react';
import PageHeader, { PageHeaderProps } from 'antd/es/page-header';
import './style.less';

export const OnePageHeader: FC<PageHeaderProps> = (props: PageHeaderProps): ReactElement => {
  return <PageHeader className="one-page-header" {...props} />;
};

export default OnePageHeader;
