import { FC, useEffect } from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export const OnePageTitle: FC<PageTitleProps> = ({ title, subtitle }: PageTitleProps) => {
  useEffect(() => {
    document.title = `${process.env.REACT_APP_NAME} :: ${title}${subtitle ? ' - ' + subtitle : ''}`;
  }, []);
  return <></>;
};

export default OnePageTitle;
