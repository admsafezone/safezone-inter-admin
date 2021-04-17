import React from 'react';
import { FileSyncOutlined, DownloadOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppContext } from 'providers/AppProvider';
import { Tooltip } from 'antd/es';

import { ReportDashboard } from "../../../interfaces/Report";

import './styles.less';

interface Props extends ReportDashboard {
  generateReport: () => void;
  loading: boolean;
}

const OneReportItem: React.FC<Props> = (props: Props) => {
  const { t } = useAppContext();
  return (
    <div className="onereportitem">
      <div className="report_icon">
        <FileSyncOutlined />
      </div>
      <div className="report_text">
        <p>{props.name}</p>
        <span>{`Atualizado em ${new Date(`${props.createdAt}`).toLocaleString()}`}</span>
      </div>
      <div className="report_actions">
        <Tooltip placement="topLeft" title={t('Baixar relatório')}>
          <a className="report_action" target="_blank" href={props.file} rel="noreferrer">
            <DownloadOutlined />
          </a>
        </Tooltip>
        <Tooltip placement="topRight" title={t('Atualizar relatório')}>
          <div className="report_action" onClick={() => props.generateReport()}>
            {props.loading
              ?
              <LoadingOutlined />
              :
              <ReloadOutlined />
            }
          </div>
        </Tooltip>
      </div>
    </div>
  )
}


export default OneReportItem;
