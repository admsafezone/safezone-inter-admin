import { FC, Key, useEffect, useState } from 'react';
import { Button, Col, Input, Space, Layout, Popconfirm, Table, Row, message } from 'antd/es';
import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClearOutlined,
  DiffOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  // EyeOutlined,
} from '@ant-design/icons';
import { OneButton, OnePageTitle } from 'components/atoms';
// import ActivityPreview from './Preview';
import Comments from './Comments';
import { Activity } from 'interfaces';
import { formatDate } from 'utils/DateUtils';
import { queryBuilder, FilterItem, Pager } from 'utils/ApiUtils';
import { useAppContext } from 'providers/AppProvider';
import ActivityCreate from 'pages/Activity/Create';
import defaultService from 'services/defaultService';
import { checkACL } from 'utils/AclUtils';
import Constants from 'utils/Constants';
import './style.less';

const { Content } = Layout;
const { Column } = Table;
const defaultIdentifier = process.env.REACT_APP_DEFAULT_IDENTIFIER || 'admin';

const ActivityList: FC = (): JSX.Element => {
  const { t, options } = useAppContext();
  const { acl, permissions, api } = Constants;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityEdit, setActivityEdit] = useState<Activity>();
  const [createVisible, setCreateVisible] = useState(false);
  // const [previewVisible, setPreviewVisible] = useState(false);
  // const [activityPreview, setActivityPreview] = useState<Activity>();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [reload, setReload] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [expandedRow, setExpandedRow] = useState<Key[]>([0]);
  const [pager, setPager] = useState<Pager>({
    current: 1,
    limit: Number(options?.pagerLimit || process.env.REACT_APP_PAGER_SIZE || 20),
    total: 0,
    sortBy: '',
  });
  const [activitiesToDelete, setActivitiesToDelete] = useState<React.Key[]>([]);
  let isMounted = true;

  const getActivities = async (page: Pager = pager, filter: FilterItem[] = filters) => {
    setLoading(true);
    const params = queryBuilder(page, filter);
    const response = await defaultService.get(
      `${api.ACTIVITIES}/?${params}`,
      { list: [], pager: [] },
      { headers: { identifier } },
    );

    if (isMounted) {
      setActivities(response?.list);
      setPager({ ...response?.pager, sortBy: page.sortBy });
      setLoading(false);
    }
  };

  const onChangePage = (page, filters, sorter) => {
    const sortBy = sorter.order ? `${sorter.field}|${sorter.order === 'ascend' ? '-1' : '1'}` : '';
    const _pager = { ...pager, current: page.current, total: page.total, limit: page.pageSize, sortBy };

    return searchHandler('active', filters['active'] || [], 'b', '', _pager);
  };

  const deleteActivities = async () => {
    if (activitiesToDelete.length) {
      setLoading(true);
      const response = await defaultService.delete(api.ACTIVITIES, activitiesToDelete);

      if (!response.error) {
        setActivitiesToDelete([]);
        getActivities();
      } else {
        message.error(response.error);
        setLoading(false);
      }
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
    getActivities(page, _filters);
  };

  const getFilterValues = (key) => {
    const { values } = filters.find((f) => f.key === key) || {};
    return values;
  };

  const reloadActivities = async (_reload: boolean) => {
    if (_reload) {
      setReload(`${Math.random()}`);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setActivitiesToDelete(selectedRowKeys);
    },
  };

  useEffect(() => {
    setActivitiesToDelete([]);
  }, [loading]);

  useEffect(() => {
    getActivities();

    return () => {
      isMounted = false;
    };
  }, [, reload, identifier]);

  const columnWithSearch = (title, key, sorter, type = '', options = '') => {
    const values = getFilterValues(key) || [];

    return (
      <Column
        title={t(title)}
        dataIndex={key}
        width={280}
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
      <OnePageTitle title={t('Activity')} />

      <Content>
        <Row>
          {checkACL(acl.ACTIVITIES, permissions.F) ? (
            <Col span={24} style={{ textAlign: 'right' }}>
              <OneButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setActivityEdit(undefined);
                  setCreateVisible(true);
                }}
              >
                {t('New activity')}
              </OneButton>
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Content>

      <Content className="one-page-list">
        {checkACL(acl.ACTIVITIES, permissions.M) && !checkACL(acl.ACTIVITIES, permissions.F) && (
          <Col span={24}>
            <OneButton
              icon={<CheckCircleOutlined />}
              type={identifier ? 'default' : 'primary'}
              onClick={() => {
                setActivities([]);
                setIdentifier('');
              }}
              style={{ marginRight: '12px' }}
            >
              {t('My activities')}
            </OneButton>
            <OneButton
              icon={<DiffOutlined />}
              type={identifier ? 'primary' : 'default'}
              onClick={() => {
                setActivities([]);
                setIdentifier(defaultIdentifier);
              }}
            >
              {t('Activity templates')}
            </OneButton>
          </Col>
        )}

        <div className={pager.total ? 'one-table-actions' : 'one-table-actions relative'}>
          {!!activitiesToDelete.length && checkACL(acl.ACTIVITIES, permissions.M) && (
            <Popconfirm
              title={t('Are you sure to delete these activities?')}
              onConfirm={() => deleteActivities()}
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
          dataSource={activities}
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
            checkACL(acl.ACTIVITIES, permissions.F) || (!identifier && checkACL(acl.ACTIVITIES, permissions.M))
              ? { type: 'checkbox', selectedRowKeys: activitiesToDelete, ...rowSelection }
              : undefined
          }
          expandable={
            !checkACL(acl.ACTIVITIES, permissions.F) && !identifier
              ? {
                  columnWidth: 40,
                  expandedRowKeys: expandedRow,
                  onExpand: (_, record: Activity) => {
                    const index = expandedRow.indexOf(record._id);
                    let expended = expandedRow;
                    if (index !== -1) {
                      expended.splice(index, 1);
                    } else {
                      expended = [...expended, record._id];
                    }
                    setExpandedRow(expended);
                  },
                  expandedRowRender: (activity: Activity) => <Comments activity={activity} />,
                }
              : undefined
          }
        >
          {columnWithSearch('Title', 'title', true, 'r', 'i')}

          <Column title={t('Type')} sorter={true} dataIndex="type" width={80} />

          <Column title={t('Language')} dataIndex="lang" width={80} sorter={true} />

          <Column
            title={t('Unique')}
            dataIndex="unique"
            width={70}
            render={(_: string, item: Activity) => (item.unique ? t('Yes') : t('No'))}
          />
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
            render={(_: string, item: Activity) => (item.active ? t('Yes') : t('No'))}
          />
          <Column
            title={t('Created At')}
            dataIndex="createdAt"
            width={90}
            sorter={true}
            render={(_: string, item: Activity) => formatDate(item.createdAt)}
          />
          <Column
            title={t('Updated At')}
            dataIndex="updatedAt"
            width={90}
            sorter={true}
            render={(_: string, item: Activity) => formatDate(item.updatedAt)}
          />

          {/* <Column
            title={t('Preview')}
            dataIndex="preview"
            width={50}
            align={'center'}
            render={(_: string, item: Activity) => (
              <OneButton
                icon={<EyeOutlined />}
                type="primary"
                shape="circle"
                onClick={() => {
                  setActivityPreview(item);
                  setPreviewVisible(true);
                }}
              ></OneButton>
            )}
          /> */}

          {checkACL(acl.ACTIVITIES, permissions.W) ? (
            <Column
              title={identifier ? t('Copy') : t('Edit')}
              dataIndex={'edit'}
              width={50}
              fixed={'right'}
              align={'center'}
              render={(_: string, item: Activity) => (
                <OneButton
                  onClick={() => {
                    setCreateVisible(true);
                    setActivityEdit(item);
                  }}
                  icon={identifier ? <CopyOutlined /> : <EditOutlined />}
                  type="primary"
                  shape="circle"
                ></OneButton>
              )}
            />
          ) : null}
        </Table>
      </Content>

      {/* <ActivityPreview activity={activityPreview} setVisible={setPreviewVisible} visible={previewVisible} /> */}

      <ActivityCreate
        visible={createVisible}
        reload={reloadActivities}
        setActivity={setActivityEdit}
        setVisible={setCreateVisible}
        activity={activityEdit}
        copy={!!identifier}
      />
    </>
  );
};

export default ActivityList;
