import { FC, Key, useEffect, useState } from 'react';
import { Col, Input, Space, Layout, Popconfirm, Table, Row } from 'antd/es';
import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { OneButton, OnePageTitle } from 'components/atoms';
import ReportCreate from '../Create';
import Results from './Results';
import { formatDate } from 'utils/DateUtils';
import { queryBuilder, FilterItem, Pager } from 'utils/ApiUtils';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import { checkACL } from 'utils/AclUtils';
import Constants from 'utils/Constants';
import { Report } from 'interfaces';
import './style.less';

const { Content } = Layout;
const { Column } = Table;

const ReportList: FC = (): JSX.Element => {
  const { t, options } = useAppContext();
  const [reports, setReports] = useState<Report[]>([]);
  const [reportEdit, setReportEdit] = useState<Report>();
  const [createVisible, setCreateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [reload, setReload] = useState('');
  const [expandedRow, setExpandedRow] = useState<Key[]>([0]);
  const [pager, setPager] = useState<Pager>({
    current: 1,
    limit: Number(options?.pagerLimit || process.env.REACT_APP_PAGER_SIZE || 20),
    total: 0,
    sortBy: '',
  });
  const [reportsToDelete, setReportsToDelete] = useState<React.Key[]>([]);
  const { api, acl, permissions } = Constants;
  const createTimeout = Number(process.env.REACT_APP_REPORT_CREATE_TIMEOUT || 3000);

  const getReports = async (page: Pager = pager, filter: FilterItem[] = filters) => {
    setLoading(true);
    const params = queryBuilder(page, filter);
    const response = await defaultService.get(`${api.REPORTS}/?${params}`, { list: [], pager: [] });

    await setReports(response?.list);
    setPager({ ...response?.pager, sortBy: page.sortBy });
    setLoading(false);
  };

  const onChangePage = (page, filters, sorter) => {
    const sortBy = sorter.order ? `${sorter.field}|${sorter.order === 'ascend' ? '-1' : '1'}` : '';
    const _pager = { ...pager, current: page.current, total: page.total, limit: page.pageSize, sortBy };

    return searchHandler('active', filters['active'] || [], 'b', '', _pager);
  };

  const generateReport = async (code, key) => {
    if (code) {
      setLoading(true);
      await defaultService.get(`${api.REPORTS}/run/${code}`);
      setTimeout(async () => {
        await getReports();
        if (!expandedRow.includes(key)) {
          setExpandedRow([...expandedRow, key]);
        }
      }, createTimeout);
    }
  };

  const deleteReports = async () => {
    if (reportsToDelete.length) {
      setLoading(true);
      await defaultService.delete(api.REPORTS, reportsToDelete);
      setReportsToDelete([]);
      await getReports();
    }
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
    getReports(page, _filters);
  };

  const getFilterValues = (key) => {
    const { values } = filters.find((f) => f.key === key) || {};
    return values;
  };

  const reloadReports = async (_reload: boolean) => {
    if (_reload) {
      setReload(`${Math.random()}`);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setReportsToDelete(selectedRowKeys);
    },
  };

  useEffect(() => {
    setReportsToDelete([]);
  }, [loading]);

  useEffect(() => {
    getReports();
  }, [, reload]);

  const columnWithSearch = (title, key, sorter, type = '', options = '') => {
    const values = getFilterValues(key) || [];

    return (
      <Column
        title={t(title)}
        dataIndex={key}
        width={150}
        sorter={sorter}
        filteredValue={values}
        filterIcon={() => <SearchOutlined className={values[0] ? 'search-icon active' : 'search-icon'} />}
        onFilterDropdownVisibleChange={(visible) => {
          if (visible) {
            setTimeout(() => {
              const input = document.getElementById(`input-${key}`);
              if (input) input.focus();
            }, 200);
          }
        }}
        filterDropdown={({ setSelectedKeys, selectedKeys }) => (
          <div style={{ padding: 8 }}>
            <Input
              id={`input-${key}`}
              placeholder={t(`Filter by ${key}`)}
              value={values || selectedKeys.length ? selectedKeys[0] : ''}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => searchHandler(key, selectedKeys, type, options)}
              style={{ width: 230, marginBottom: 8, display: 'block' }}
              autoComplete={'off'}
            />
            <Space style={{ display: 'block', overflow: 'hidden' }}>
              <OneButton
                onClick={() => {
                  searchHandler(key, []);
                }}
                size="small"
                style={{ width: 90, float: 'left' }}
              >
                {t('Clean')}
              </OneButton>
              <OneButton
                type="primary"
                onClick={() => searchHandler(key, selectedKeys, type, options)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90, float: 'right' }}
              >
                {t('Filter')}
              </OneButton>
            </Space>
          </div>
        )}
      />
    );
  };

  return (
    <>
      <OnePageTitle title={t('Reports')} />

      <Content>
        <Row>
          {checkACL(acl.REPORTS, permissions.F) ? (
            <Col span={24} style={{ textAlign: 'right' }}>
              <OneButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setReportEdit(undefined);
                  setCreateVisible(true);
                }}
              >
                {t('New report')}
              </OneButton>
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Content>

      <Content className="one-page-list">
        <div className={pager.total ? 'one-table-actions' : 'one-table-actions relative'}>
          {!!reportsToDelete.length && checkACL(acl.REPORTS, permissions.M) && (
            <Popconfirm
              title={t('Are you sure to delete these reports?')}
              onConfirm={() => deleteReports()}
              okText={t('Yes')}
              cancelText={t('No')}
              icon={<ExclamationCircleOutlined />}
            >
              <OneButton type="primary" className="one-delete" icon={<DeleteOutlined />}>
                {t('Delete')}
              </OneButton>
            </Popconfirm>
          )}
          {filters.length ? (
            <OneButton type="default" icon={<ClearOutlined />} onClick={() => searchHandler('', [])}>
              {t('Clean filters')}
            </OneButton>
          ) : (
            ''
          )}
        </div>

        <Table
          loading={loading}
          dataSource={reports}
          scroll={{ x: 1200 }}
          rowKey={'_id'}
          onChange={onChangePage}
          pagination={{
            responsive: true,
            position: ['topRight', 'bottomRight'],
            showTotal: (total: number, range: number[]) =>
              `${range[0]} - ${range[1]} ${t('of')} ${total} ${t('items')}`,
            defaultPageSize: pager.limit,
            total: pager.total,
            current: pager.current,
          }}
          rowSelection={
            checkACL(acl.REPORTS, permissions.M)
              ? { type: 'checkbox', selectedRowKeys: reportsToDelete, ...rowSelection }
              : undefined
          }
          expandable={
            checkACL(acl.REPORTS, permissions.W)
              ? {
                  columnWidth: 40,
                  expandedRowKeys: expandedRow,
                  onExpand: (_, record: Report) => {
                    const index = expandedRow.indexOf(record._id);
                    let expended = expandedRow;
                    if (index !== -1) {
                      expended.splice(index, 1);
                    } else {
                      expended = [...expended, record._id];
                    }
                    setExpandedRow(expended);
                  },
                  expandedRowRender: (report: Report) => <Results report={report} />,
                }
              : undefined
          }
        >
          {columnWithSearch('Name', 'name', true, 'r', 'i')}

          <Column title={t('Description')} dataIndex="description" width={400} />
          <Column
            title={t('Sheets quantity')}
            dataIndex="pipelines"
            width={100}
            render={(_: string, item: Report) => item?.pipelines.length}
          />

          <Column
            title={t('Created At')}
            dataIndex="createdAt"
            width={90}
            sorter={true}
            render={(_: string, item: Report) => formatDate(item.createdAt)}
          />
          <Column
            title={t('Updated At')}
            dataIndex="updatedAt"
            width={90}
            sorter={true}
            render={(_: string, item: Report) => formatDate(item.updatedAt)}
          />
          {checkACL(acl.REPORTS, permissions.W) ? (
            <Column
              title={t('Generate now')}
              dataIndex={'generate'}
              width={80}
              fixed={'right'}
              align={'center'}
              render={(_: string, item: Report) => (
                <OneButton
                  onClick={() => generateReport(item.code, item._id)}
                  icon={<TableOutlined />}
                  type="primary"
                  shape="circle"
                ></OneButton>
              )}
            />
          ) : null}
          {checkACL(acl.REPORTS, permissions.F) ? (
            <Column
              title={t('Edit')}
              dataIndex={'edit'}
              width={50}
              fixed={'right'}
              align={'center'}
              render={(_: string, item: Report) => (
                <OneButton
                  onClick={() => {
                    setCreateVisible(true);
                    setReportEdit(item);
                  }}
                  icon={<EditOutlined />}
                  type="primary"
                  shape="circle"
                ></OneButton>
              )}
            />
          ) : null}
        </Table>
      </Content>

      <ReportCreate
        visible={createVisible}
        reload={reloadReports}
        setReport={setReportEdit}
        setVisible={setCreateVisible}
        report={reportEdit}
      />
    </>
  );
};

export default ReportList;
