import React from 'react';
import { FileSyncOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAppContext } from 'providers/AppProvider';
import { Tooltip } from 'antd/es';

import './styles.less';

const OneReportItem: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="onereportitem">
            <div className="report_icon">
                <FileSyncOutlined />
            </div>
            <div className="report_text">
                <p>Nome do relatório</p>
                <span>{`Atualizado em ${new Date().toLocaleString()}`}</span>
            </div>
            <Tooltip placement="topRight" title={t('Baixar relatório')}>
                <div className="report_action">
                    <DownloadOutlined onClick={() => console.log('clicou')} />
                </div>
            </Tooltip>
        </div>
    )
}


export default OneReportItem;