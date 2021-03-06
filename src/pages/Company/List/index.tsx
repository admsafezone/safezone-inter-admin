import { FC, useEffect, useState } from 'react';
import { Col, Input, Space, Layout, Popconfirm, Table, Row } from 'antd/es';
import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { OneButton, OnePageTitle } from 'components/atoms';
import CompanyCreate from 'pages/Company/Create';
import { formatDate } from 'utils/DateUtils';
import { queryBuilder, FilterItem, Pager } from 'utils/ApiUtils';
import { useAppContext } from 'providers/AppProvider';
import defaultService from 'services/defaultService';
import { checkACL } from 'utils/AclUtils';
import Constants from 'utils/Constants';
import { Company } from 'interfaces';
import './style.less';

const { Content } = Layout;
const { Column } = Table;

const CompanyList: FC = (): JSX.Element => {
  const { t, options } = useAppContext();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyEdit, setCompanyEdit] = useState<Company>();
  const [createVisible, setCreateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [reload, setReload] = useState('');
  const [pager, setPager] = useState<Pager>({
    current: 1,
    limit: Number(options?.pagerLimit || process.env.REACT_APP_PAGER_SIZE || 20),
    total: 0,
    sortBy: '',
  });
  const [companiesToDelete, setCompaniesToDelete] = useState<React.Key[]>([]);
  let isMounted = true;

  const getCompanies = async (page: Pager = pager, filter: FilterItem[] = filters) => {
    setLoading(true);
    const params = queryBuilder(page, filter);
    const response = await defaultService.get(`${Constants.api.COMPANIES}/?${params}`, { list: [], pager: [] });

    if (isMounted) {
      setLoading(false);
      setCompanies(response?.list);
      setPager({ ...response?.pager, sortBy: page.sortBy });
    }
  };

  const onChangePage = (page, filters, sorter) => {
    const sortBy = sorter.order ? `${sorter.field}|${sorter.order === 'ascend' ? '-1' : '1'}` : '';
    const _pager = { ...pager, current: page.current, total: page.total, limit: page.pageSize, sortBy };

    return searchHandler('active', filters['active'] || [], 'b', '', _pager);
  };

  const deleteCompanies = async () => {
    if (companiesToDelete.length) {
      setLoading(true);
      await defaultService.delete(Constants.api.COMPANIES, companiesToDelete);
      setCompaniesToDelete([]);
      await getCompanies();
    }
  };

  const searchHandler = (key, values, type = '', options = '', page: Pager = { current: 1, limit: pager.limit }) => {
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
    getCompanies(page, _filters);
  };

  const getFilterValues = (key) => {
    const { values } = filters.find((f) => f.key === key) || {};
    return values;
  };

  const reloadCompanies = async (_reload: boolean) => {
    if (_reload) {
      setReload(`${Math.random()}`);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setCompaniesToDelete(selectedRowKeys);
    },
  };

  useEffect(() => {
    setCompaniesToDelete([]);
  }, [loading]);

  useEffect(() => {
    getCompanies();

    return () => {
      isMounted = false;
    };
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
      <OnePageTitle title={t('Company')} />

      <Content>
        <Row>
          {checkACL(Constants.acl.COMPANIES, Constants.permissions.W) &&
          checkACL(Constants.acl.MAIN, Constants.permissions.M) ? (
            <Col span={24} style={{ textAlign: 'right' }}>
              <OneButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setCompanyEdit(undefined);
                  setCreateVisible(true);
                }}
              >
                {t('New company')}
              </OneButton>
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Content>

      <Content className="one-page-list">
        <div className={pager.total ? 'one-table-actions' : 'one-table-actions relative'}>
          {!!companiesToDelete.length && checkACL(Constants.acl.COMPANIES, Constants.permissions.M) && (
            <Popconfirm
              title={t('Are you sure to delete these companies?')}
              onConfirm={() => deleteCompanies()}
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
          dataSource={companies}
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
            checkACL(Constants.acl.COMPANIES, Constants.permissions.M)
              ? { type: 'checkbox', selectedRowKeys: companiesToDelete, ...rowSelection }
              : undefined
          }
        >
          {columnWithSearch(t('Name'), 'name', true, 'r', 'i')}
          {columnWithSearch(t('Identifier'), 'identifier', true, 'r', 'i')}

          <Column
            title={t('Language')}
            dataIndex="theme.lang"
            width={80}
            render={(_: string, item: Company) => item.theme?.lang || t('None')}
          />
          <Column
            title={t('Domains')}
            dataIndex="origins"
            width={200}
            render={(_: string, item: Company) =>
              item.origins ? item.origins.map((domain: string) => domain).join(', ') : ''
            }
          />
          <Column
            title={t('Emails accepted')}
            dataIndex="domains"
            width={150}
            render={(_: string, item: Company) =>
              item.domains ? item.domains.map((domain: string) => domain).join(', ') : ''
            }
          />
          <Column
            title={t('Active')}
            dataIndex="active"
            width={60}
            filteredValue={getFilterValues('active')}
            filterMultiple={false}
            filters={[
              { text: t('Yes'), value: true },
              { text: t('No'), value: false },
            ]}
            render={(_: string, item: Company) => (item.active ? t('Yes') : t('No'))}
          />
          <Column
            title={t('Created At')}
            dataIndex="createdAt"
            width={90}
            sorter={true}
            render={(_: string, item: Company) => formatDate(item.createdAt)}
          />
          <Column
            title={t('Updated At')}
            dataIndex="updatedAt"
            width={90}
            sorter={true}
            render={(_: string, item: Company) => formatDate(item.updatedAt)}
          />
          {checkACL(Constants.acl.COMPANIES, Constants.permissions.W) ? (
            <Column
              title={t('Edit')}
              dataIndex={'edit'}
              width={50}
              fixed={'right'}
              align={'center'}
              render={(_: string, item: Company) => (
                <OneButton
                  onClick={() => {
                    setCreateVisible(true);
                    setCompanyEdit(item);
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

      <CompanyCreate
        visible={createVisible}
        reload={reloadCompanies}
        setCompany={setCompanyEdit}
        setVisible={setCreateVisible}
        company={companyEdit}
      />
    </>
  );
};

export default CompanyList;
