import { FC, Key, useEffect, useState } from 'react';
import Popconfirm from 'antd/es/popconfirm';
import Table from 'antd/es/table';
import Typography from 'antd/es/typography';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import OneButton from 'components/atoms/OneButton';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import { Report, ReportResult } from 'interfaces';
import { formatBytes, formatDate } from 'utils/DateUtils';
import Constants from 'utils/Constants';
import { checkACL } from 'utils/AclUtils';
import { queryBuilder, FilterItem, Pager } from 'utils/ApiUtils';
import './style.less';

const { Title } = Typography;
const { Column } = Table;

interface ResultsProps {
  report: Report;
}

const Results: FC<ResultsProps> = ({ report }: ResultsProps) => {
  const { t, options } = useAppContext();
  const [results, setResults] = useState<ReportResult[]>([]);
  const [filters, setFilters] = useState<FilterItem[]>([
    {
      key: 'type',
      values: [report._id],
      type: '',
      options: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(true);
  const [resultsToDelete, setResultsToDelete] = useState<Key[]>([]);
  const [pager, setPager] = useState<Pager>({
    current: 1,
    limit: Number(options?.pagerLimit || process.env.REACT_APP_PAGER_SIZE || 20),
    total: 0,
    sortBy: 'createdAt|-1',
  });
  const { api, acl, permissions } = Constants;

  const getResults = async (page: Pager = pager, filter: FilterItem[] = filters) => {
    setLoading(true);
    const params = queryBuilder(page, filter);
    const response = await defaultService.get(`${api.REPORTS}/results/?${params}`, []);

    await setResults(response?.list);
    setPager({ ...response?.pager, sortBy: page.sortBy });
    setLoading(false);
    setNoResult(!response?.list?.length && filter.length <= 1);
  };

  const searchHandler = (key, values, type = '', options = '', page: Pager = { current: 1 }) => {
    const otherFilters = filters.filter((f) => f.key !== key);
    let _filters: any = [];

    if (key) {
      if (values.length) {
        _filters = [...otherFilters, { key, values, type, options }];
      } else {
        _filters = otherFilters;
      }
    }

    setFilters(_filters);
    getResults(page, _filters);
  };

  const onChangePage = (page, filters, sorter) => {
    const sortBy = sorter.order ? `${sorter.field}|${sorter.order === 'ascend' ? '-1' : '1'}` : '';
    const _pager = { ...pager, current: page.current, total: page.total, limit: page.pageSize, sortBy };

    return searchHandler('active', filters['active'] || [], 'b', '', _pager);
  };

  const deleteResults = async () => {
    if (resultsToDelete.length) {
      setLoading(true);
      await defaultService.delete(`${api.REPORTS}/results`, resultsToDelete);
      setResultsToDelete([]);
      await getResults();
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setResultsToDelete(selectedRowKeys);
    },
  };

  useEffect(() => {
    getResults();
  }, [report]);

  if (noResult) {
    return (
      <p>
        {loading ? (
          <>
            <ReloadOutlined spin /> {t('Loading')}...
          </>
        ) : (
          t('No report results yet')
        )}
      </p>
    );
  }

  return (
    <div className={results.length ? 'one-results-row' : 'one-results-row relative'}>
      <Title level={4} className="results-title" title={t('Report results')}>
        {t('Results') + `: ${report.name}`}
      </Title>

      <Table
        loading={loading}
        dataSource={results}
        rowKey={'_id'}
        pagination={{
          responsive: true,
          position: ['topRight', 'bottomRight'],
          showTotal: (total: number, range: number[]) => `${range[0]} - ${range[1]} ${t('of')} ${total} ${t('items')}`,
          defaultPageSize: pager.limit,
          total: pager.total,
          current: pager.current,
        }}
        rowSelection={
          checkACL(acl.REPORTS, permissions.M)
            ? { type: 'checkbox', selectedRowKeys: resultsToDelete, ...rowSelection }
            : undefined
        }
        onChange={onChangePage}
      >
        <Column
          title={t('URL')}
          dataIndex="file"
          width={500}
          render={(_: string, item: ReportResult) => (
            <a href={item.file} target="blank">
              {item.file}
            </a>
          )}
        />
        <Column
          title={t('Size')}
          dataIndex="name"
          width={80}
          render={(_: string, item: ReportResult) => formatBytes(item.size)}
        />
        <Column
          title={t('Created At')}
          dataIndex="createdAt"
          width={100}
          sorter={true}
          render={(_: string, item: ReportResult) => formatDate(item.createdAt)}
        />
      </Table>

      <div className={'one-table-actions'}>
        {!!resultsToDelete.length && checkACL(acl.REPORTS, permissions.M) && (
          <Popconfirm
            title={t('Are you sure to delete these report results?')}
            onConfirm={() => deleteResults()}
            okText={t('Yes')}
            cancelText={t('No')}
            icon={<ExclamationCircleOutlined />}
          >
            <OneButton type="primary" icon={<DeleteOutlined />}>
              {t('Delete')}
            </OneButton>
          </Popconfirm>
        )}
      </div>
    </div>
  );
};

export default Results;
