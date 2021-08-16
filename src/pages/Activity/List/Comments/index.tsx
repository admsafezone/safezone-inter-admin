import { FC, useEffect, useState } from 'react';
import { Table, Typography } from 'antd/es';
import { ReloadOutlined } from '@ant-design/icons';
import { useAppContext } from 'providers/AppProvider';
import { formatDate } from 'utils/DateUtils';
import Constants from 'utils/Constants';
import { queryBuilder, FilterItem, Pager } from 'utils/ApiUtils';
import defaultService from 'services/defaultService';
import { Activity, Comment } from 'interfaces';
import './style.less';

const { Title } = Typography;
const { Column } = Table;

interface CommentsProps {
  activity: Activity;
}

const Comments: FC<CommentsProps> = ({ activity }: CommentsProps) => {
  const { t, options } = useAppContext();
  const [comments, setComments] = useState<Activity[]>([]);
  const [filters, setFilters] = useState<FilterItem[]>([
    {
      key: 'activity',
      values: [activity._id],
      type: '',
      options: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [noComment, setNoComment] = useState(true);
  const [pager, setPager] = useState<Pager>({
    current: 1,
    limit: Number(options?.pagerLimit || process.env.REACT_APP_PAGER_SIZE || 20),
    total: 0,
    sortBy: 'createdAt|-1',
  });

  const getComments = async (page: Pager = pager, filter: FilterItem[] = filters) => {
    setLoading(true);
    const params = queryBuilder(page, filter);
    const response = await defaultService.get(`${Constants.api.COMMENTS}/?${params}`, []);

    await setComments(response?.list);
    setPager({ ...response?.pager, sortBy: page.sortBy });
    setLoading(false);
    setNoComment(!response?.list?.length && filter.length <= 1);
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
    getComments(page, _filters);
  };

  const onChangePage = (page, filters, sorter) => {
    const sortBy = sorter.order ? `${sorter.field}|${sorter.order === 'ascend' ? '-1' : '1'}` : '';
    const _pager = { ...pager, current: page.current, total: page.total, limit: page.pageSize, sortBy };

    return searchHandler('active', filters['active'] || [], 'b', '', _pager);
  };

  const getFilterValues = (key) => {
    const { values } = filters.find((f) => f.key === key) || {};
    return values;
  };

  useEffect(() => {
    getComments();
  }, [activity]);

  if (noComment) {
    return (
      <p>
        {loading ? (
          <>
            <ReloadOutlined spin /> {t('Loading')}...
          </>
        ) : (
          t('No comments yet')
        )}
      </p>
    );
  }

  return (
    <div className={comments.length ? 'one-comment-row' : 'one-comment-row relative'}>
      <Title level={4} className="comment-title" title={t('Activity comments')}>
        {t('Activity comments')}
      </Title>
      <Table
        loading={loading}
        dataSource={comments}
        rowKey={'_id'}
        pagination={{
          responsive: true,
          position: ['topRight', 'bottomRight'],
          showTotal: (total: number, range: number[]) => `${range[0]} - ${range[1]} ${t('of')} ${total} ${t('items')}`,
          defaultPageSize: pager.limit,
          total: pager.total,
          current: pager.current,
        }}
        onChange={onChangePage}
      >
        <Column
          title={t('User')}
          dataIndex="user"
          width={140}
          render={(_, comment: Comment) =>
            comment.user ? `${comment.user?.name} ${comment.user?.surname}` : t('Not found')
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
          render={(_: string, item: Comment) => (item.active ? t('Yes') : t('No'))}
        />
        <Column
          title={t('Created At')}
          dataIndex="createdAt"
          width={100}
          sorter={true}
          render={(_: string, item: Comment) => formatDate(item.createdAt)}
        />
        <Column title={t('Comment')} dataIndex="text" width={600} />
      </Table>
    </div>
  );
};

export default Comments;
