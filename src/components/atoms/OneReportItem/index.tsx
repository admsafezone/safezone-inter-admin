import React, { useState, memo } from 'react';
import { FileSyncOutlined, DownloadOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppContext } from 'providers/AppProvider';
import { Tooltip } from 'antd/es';

import { ReportDashboard } from '../../../interfaces/Report';
import defaultService from 'services/defaultService';

import './styles.less';

const OneReportItem: React.FC<ReportDashboard> = (props: ReportDashboard) => {
  const { t } = useAppContext();

  const [loadingReport, setLoadingReport] = useState(false);

  const handleGenerateReport = async (code: string) => {
    setLoadingReport(true);
    await defaultService.get(`/reports/run/${code}`);
    setTimeout(() => {
      setLoadingReport(false);
    }, 1000);
  };

  return (
    <div className="onereportitem">
      <div className="report_icon">
        <FileSyncOutlined />
      </div>

      <div className="report_text">
        <p>{props.name}</p>
        <span>{`${t('Updated At')} ${new Date(`${props.createdAt}`).toLocaleString('pt-BR')}`}</span>
      </div>

      <div className="report_actions">
        <Tooltip placement="topLeft" title={t('Download report')}>
          <a className="report_action" target="_blank" href={props.file} rel="noreferrer">
            <DownloadOutlined />
          </a>
        </Tooltip>
        <Tooltip placement="topRight" title={t('Update report')}>
          <div className="report_action" onClick={() => handleGenerateReport(props.code)}>
            {loadingReport ? <LoadingOutlined /> : <ReloadOutlined />}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default memo(OneReportItem);
