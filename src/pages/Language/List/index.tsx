import { FC, useEffect, useState } from 'react';
import { Col, Layout, Popconfirm, Table, Row } from 'antd/es';
import { EditOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { OneButton, OnePageTitle } from 'components/atoms';
import { formatDate } from 'utils/DateUtils';
import { useAppContext } from 'providers/AppProvider';
import LanguageCreate from 'pages/Language/Create';
import defaultService from 'services/defaultService';
import { checkACL } from 'utils/AclUtils';
import Constants from 'utils/Constants';
import { Language } from 'interfaces';
import './style.less';

const { Content } = Layout;
const { Column } = Table;

const LanguageList: FC = (): JSX.Element => {
  const { t } = useAppContext();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageEdit, setLanguageEdit] = useState<Language>();
  const [baseLanguage, setBaseLanguage] = useState<Language>();
  const [createVisible, setCreateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState('');
  const [languagesToDelete, setLanguagesToDelete] = useState<React.Key[]>([]);

  const getLanguages = async () => {
    setLoading(true);
    const response = await defaultService.get(`${Constants.api.LANGUAGES}`, []);

    await setLanguages(response);
    findAndSetBaseLanguage(response);
    setLoading(false);
  };

  const deleteLanguages = async () => {
    if (languagesToDelete.length) {
      setLoading(true);
      await defaultService.delete(Constants.api.LANGUAGES, languagesToDelete);
      setLanguagesToDelete([]);
      await getLanguages();
    }
  };

  const reloadLanguages = async (_reload: boolean) => {
    if (_reload) {
      setReload(`${Math.random()}`);
    }
  };

  const findAndSetBaseLanguage = async (languages: Language[]) => {
    if (languages?.length) {
      const _baseLanguage = languages.find((language) => language.base);
      const base: any = { translation: _baseLanguage?.translation };

      for (const key in _baseLanguage) {
        if (Object.prototype.hasOwnProperty.call(_baseLanguage, key) && key !== 'translation') {
          base[key] = '';
        }
      }

      setBaseLanguage(base);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setLanguagesToDelete(selectedRowKeys);
    },
  };

  useEffect(() => {
    setLanguagesToDelete([]);
  }, [loading]);

  useEffect(() => {
    getLanguages();
  }, [, reload]);

  return (
    <>
      <OnePageTitle title={t('Languages')} />

      <Content>
        <Row>
          {checkACL(Constants.acl.LANGUAGES, Constants.permissions.W) ? (
            <Col span={24} style={{ textAlign: 'right' }}>
              <OneButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setLanguageEdit(baseLanguage);
                  setCreateVisible(true);
                }}
              >
                {t('New language')}
              </OneButton>
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Content>

      <Content className="one-page-list">
        <div className={'one-table-actions relative'}>
          {!!languagesToDelete.length && checkACL(Constants.acl.LANGUAGES, Constants.permissions.M) && (
            <Popconfirm
              title={t('Are you sure to delete these languages?')}
              onConfirm={() => deleteLanguages()}
              okText={t('Yes')}
              cancelText={t('No')}
              icon={<ExclamationCircleOutlined />}
            >
              <OneButton type="primary" className="one-delete" icon={<DeleteOutlined />}>
                {t('Delete')}
              </OneButton>
            </Popconfirm>
          )}
        </div>

        <Table
          loading={loading}
          dataSource={languages}
          scroll={{ x: 1200 }}
          rowKey={'_id'}
          rowSelection={
            checkACL(Constants.acl.LANGUAGES, Constants.permissions.M)
              ? { type: 'checkbox', selectedRowKeys: languagesToDelete, ...rowSelection }
              : undefined
          }
        >
          <Column title={t('Name')} dataIndex="name" width={90} />
          <Column title={t('Language code')} dataIndex="lang" width={90} />
          <Column title={t('Language ISO code')} dataIndex="isoCode" width={90} />
          <Column
            title={t('Created At')}
            dataIndex="createdAt"
            width={90}
            sorter={true}
            render={(_: string, item: Language) => formatDate(item.createdAt)}
          />
          <Column
            title={t('Updated At')}
            dataIndex="updatedAt"
            width={90}
            sorter={true}
            render={(_: string, item: Language) => formatDate(item.updatedAt)}
          />
          {checkACL(Constants.acl.LANGUAGES, Constants.permissions.W) ? (
            <Column
              title={t('Edit')}
              dataIndex={'edit'}
              width={50}
              fixed={'right'}
              align={'center'}
              render={(_: string, item: Language) => (
                <OneButton
                  onClick={() => {
                    setCreateVisible(true);
                    setLanguageEdit(item);
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

      <LanguageCreate
        visible={createVisible}
        reload={reloadLanguages}
        setLanguage={setLanguageEdit}
        setVisible={setCreateVisible}
        language={languageEdit}
      />
    </>
  );
};

export default LanguageList;
