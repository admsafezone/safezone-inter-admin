import { FC, useEffect, useState } from 'react';
import Button from 'antd/es/button';
import Col from 'antd/es/col';
import Input from 'antd/es/input';
import Space from 'antd/es/space';
import Layout from 'antd/es/layout';
import Popconfirm from 'antd/es/popconfirm';
import Table from 'antd/es/table';
import Row from 'antd/es/row';
import EditOutlined from '@ant-design/icons/EditOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import OneButton from 'components/atoms/OneButton';
import OnePageTitle from 'components/atoms/OnePageTitle';
import { Profile, User } from 'interfaces';
import { formatDate } from 'utils/DateUtils';
import { queryBuilder, FilterItem, Pager } from 'utils/ApiUtils';
import { useAppContext } from 'providers/AppProvider';
import UserCreate from 'pages/User/Create';
import defaultService from 'services/defaultService';
import { checkACL } from 'utils/AclUtils';
import Constants from 'utils/Constants';
import './style.less';

const { Content } = Layout;
const { Column } = Table;

const UserList: FC = (): JSX.Element => {
  const { t, options } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [userEdit, setUserEdit] = useState<User>();
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
  const [usersToDelete, setUsersToDelete] = useState<React.Key[]>([]);

  const getUsers = async (page: Pager = pager, filter: FilterItem[] = filters) => {
    setLoading(true);
    const params = queryBuilder(page, filter);
    const response = await defaultService.get(`${Constants.api.USERS}/?${params}`, { list: [], pager: [] });

    await setUsers(response?.list);
    setPager({ ...response?.pager, sortBy: page.sortBy });
    setLoading(false);
  };

  const onChangePage = (page, filters, sorter) => {
    const sortBy = sorter.order ? `${sorter.field}|${sorter.order === 'ascend' ? '-1' : '1'}` : '';
    const _pager = { ...pager, current: page.current, total: page.total, limit: page.pageSize, sortBy };

    return searchHandler('active', filters['active'] || [], 'b', '', _pager);
  };

  const deleteUsers = async () => {
    if (usersToDelete.length) {
      setLoading(true);
      await defaultService.delete(Constants.api.USERS, usersToDelete);
      setUsersToDelete([]);
      await getUsers();
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
    getUsers(page, _filters);
  };

  const getFilterValues = (key) => {
    const { values } = filters.find((f) => f.key === key) || {};
    return values;
  };

  const reloadUsers = async (_reload: boolean) => {
    if (_reload) {
      setReload(`${Math.random()}`);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setUsersToDelete(selectedRowKeys);
    },
  };

  useEffect(() => {
    setUsersToDelete([]);
  }, [loading]);

  useEffect(() => {
    getUsers();
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
              <Button
                onClick={() => {
                  searchHandler(key, []);
                }}
                size="small"
                style={{ width: 90, float: 'left' }}
              >
                {t('Clean')}
              </Button>
              <Button
                type="primary"
                onClick={() => searchHandler(key, selectedKeys, type, options)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90, float: 'right' }}
              >
                {t('Filter')}
              </Button>
            </Space>
          </div>
        )}
      />
    );
  };

  return (
    <>
      <OnePageTitle title={t('Users')} />

      <Content>
        <Row>
          {checkACL(Constants.acl.USERS, Constants.permissions.W) ? (
            <Col span={24} style={{ textAlign: 'right' }}>
              <OneButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setUserEdit(undefined);
                  setCreateVisible(true);
                }}
              >
                {t('New user')}
              </OneButton>
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Content>

      <Content className="one-page-list">
        <div className={pager.total ? 'one-table-actions' : 'one-table-actions relative'}>
          {!!usersToDelete.length && checkACL(Constants.acl.USERS, Constants.permissions.M) && (
            <Popconfirm
              title={t('Are you sure to delete these users?')}
              onConfirm={() => deleteUsers()}
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
          dataSource={users}
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
            checkACL(Constants.acl.USERS, Constants.permissions.M)
              ? { type: 'checkbox', selectedRowKeys: usersToDelete, ...rowSelection }
              : undefined
          }
        >
          {columnWithSearch('Name', 'name', true, 'r', 'i')}
          {columnWithSearch('Email', 'email', true, 'r', 'i')}
          <Column
            title={t('Profiles')}
            dataIndex="profiles"
            width={90}
            render={(_: string, item: User) => item.profiles.map((p: Profile) => (p.name ? p.name : p)).join(', ')}
          />

          {checkACL(Constants.acl.USERS, Constants.permissions.M) && (
            <Column
              title={t('Company')}
              dataIndex="company"
              width={110}
              render={(_: string, item: User) => item.company?.name}
            />
          )}

          <Column
            title={t('Active')}
            dataIndex="active"
            width={90}
            filteredValue={getFilterValues('active')}
            filterMultiple={false}
            filters={[
              { text: t('Yes'), value: true },
              { text: t('No'), value: false },
            ]}
            render={(_: string, item: User) => (item.active ? t('Yes') : t('No'))}
          />
          <Column
            title={t('Created At')}
            dataIndex="createdAt"
            width={90}
            sorter={true}
            render={(_: string, item: User) => formatDate(item.createdAt)}
          />
          <Column
            title={t('Updated At')}
            dataIndex="updatedAt"
            width={90}
            sorter={true}
            render={(_: string, item: User) => formatDate(item.updatedAt)}
          />
          {checkACL(Constants.acl.USERS, Constants.permissions.W) ? (
            <Column
              title={t('Edit')}
              dataIndex={'edit'}
              width={50}
              fixed={'right'}
              align={'center'}
              render={(_: string, item: User) => (
                <OneButton
                  onClick={() => {
                    setCreateVisible(true);
                    setUserEdit(item);
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

      <UserCreate
        visible={createVisible}
        reload={reloadUsers}
        setUser={setUserEdit}
        setVisible={setCreateVisible}
        user={userEdit}
      />
    </>
  );
};

export default UserList;
