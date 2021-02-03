import { FC, Key, useContext, useEffect, useState } from 'react';
import Col from 'antd/es/col';
import Form from 'antd/es/form';
import Layout from 'antd/es/layout';
import Radio from 'antd/es/radio';
import Popconfirm from 'antd/es/popconfirm';
import Table from 'antd/es/table';
import Popover from 'antd/es/popover';
import Input from 'antd/es/input';
import Title from 'antd/es/typography/Title';
import Row from 'antd/es/row';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import ClearOutlined from '@ant-design/icons/ClearOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import OneButton from 'components/atoms/OneButton';
import { Profile, Resource } from 'interfaces';
import { formatDate } from 'utils/DateUtils';
import AppContext from 'contexts/AppContext';
import defaultService from 'services/defaultService';
import { checkACL } from 'utils/AclUtils';
import Constants from 'utils/Constants';
import './style.less';

const { Content } = Layout;
const { Column } = Table;

const ProfileManager: FC = (): JSX.Element => {
  const { t } = useContext(AppContext);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [editedResource, setEditedResource] = useState({});
  const [profilesToDelete, setProfilesToDelete] = useState<React.Key[]>([]);
  const [expandedRow, setExpandedRow] = useState<Key[]>([0]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [form] = Form.useForm();

  const getProfiles = async () => {
    setLoading(true);
    const response = await defaultService.get(Constants.api.PROFILES, []);
    await setProfiles(response);
    setLoading(false);
  };

  const getResources = async () => {
    setLoading(true);
    const response = await defaultService.get(Constants.api.RESOURCES, []);
    await setResources(response);
    setLoading(false);
  };

  const saveProfiles = async () => {
    if (Object.keys(editedResource).length) {
      setLoading(true);

      const data = Object.keys(editedResource).map((p) => {
        const resources = Object.keys(editedResource[p]);
        const acls = {};
        for (const resource of resources) {
          acls[`acl.${resource}`] = editedResource[p][resource];
        }
        const profile = profiles.find((_p: Profile) => _p._id === Number(p));
        return { _id: Number(p), ...acls, name: profile?.name };
      });

      await defaultService.put(Constants.api.PROFILES, data);
      setEditedResource({});
      await getProfiles();
      form.resetFields();
    }
  };

  const addProfile = async () => {
    const { newProfile } = form.getFieldsValue();
    if (newProfile) {
      const ids = profiles.map((p: Profile) => p._id);
      const maxId = ids.reduce((acc, value) => Math.max(acc, value), 0);
      const newId: Key = maxId + 1;
      const acl = {};
      resources.forEach((r: Resource) => (acl[`acl.${r.aclResource}`] = r.defaultPermission));
      const profileToAdd = {
        _id: newId,
        name: newProfile,
        acl: {},
      };
      setProfiles([profileToAdd, ...profiles]);
      await setEditedResource({ [newId]: acl });
      setExpandedRow([newId]);
      form.resetFields();
      setPopoverVisible(false);
    }
  };

  const deleteProfiles = async () => {
    if (profilesToDelete.length) {
      setLoading(true);
      await defaultService.delete(Constants.api.PROFILES, profilesToDelete);
      setProfilesToDelete([]);
      await getProfiles();
    }
  };

  const onChangePermission = async (value: string, profile: number, resource: string) => {
    if (!editedResource[profile]) {
      editedResource[profile] = {};
    }
    editedResource[profile][resource] = value;
    setEditedResource({ ...editedResource });
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setProfilesToDelete(selectedRowKeys);
    },
  };

  useEffect(() => {
    setProfilesToDelete([]);
  }, [loading]);

  useEffect(() => {
    getProfiles();
    getResources();
  }, []);

  return (
    <>
      <Content>
        <Row>
          {checkACL(Constants.acl.PROFILES, Constants.permissions.W) ? (
            <Col span={24} style={{ textAlign: 'right' }}>
              <Popover
                visible={popoverVisible}
                onVisibleChange={setPopoverVisible}
                placement="left"
                title={t('New profile')}
                trigger="click"
                content={
                  <Form form={form}>
                    <Form.Item name="newProfile">
                      <Input type="text" placeholder={t('Type the new profile name')} style={{ width: '250px' }} />
                    </Form.Item>
                    <OneButton icon={<PlusOutlined />} type="primary" onClick={() => addProfile()}>
                      {t('Add')}
                    </OneButton>
                  </Form>
                }
              >
                <OneButton icon={<PlusOutlined />} type="primary">
                  {t('New profile')}
                </OneButton>
              </Popover>
            </Col>
          ) : (
            ''
          )}
        </Row>
      </Content>

      <Content className="one-page-profile-list">
        <Row justify="end">
          <Col span={12}>
            {!!profilesToDelete.length && checkACL(Constants.acl.PROFILES, Constants.permissions.M) && (
              <Popconfirm
                title={t('Are you sure to delete these profiles?')}
                onConfirm={() => deleteProfiles()}
                okText={t('Yes')}
                cancelText={t('No')}
                icon={<WarningOutlined />}
              >
                <OneButton type="primary" className="one-delete-profile" icon={<DeleteOutlined />}>
                  {t('Delete')}
                </OneButton>
              </Popconfirm>
            )}
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            {!!Object.keys(editedResource).length && checkACL(Constants.acl.PROFILES, Constants.permissions.W) && (
              <>
                <Popconfirm
                  title={t('All changes will be discarded!')}
                  onConfirm={() => {
                    getProfiles();
                    setEditedResource({});
                  }}
                  okText={t('Ok')}
                  placement="leftTop"
                  icon={<ExclamationCircleOutlined />}
                >
                  <OneButton
                    type="default"
                    className="one-reset-profile"
                    icon={<ClearOutlined />}
                    style={{ marginRight: 24 }}
                  >
                    {t('Reset')}
                  </OneButton>
                </Popconfirm>
                <Popconfirm
                  title={t("The changes will only be applied at the users' next login!")}
                  onConfirm={() => saveProfiles()}
                  okText={t('Ok')}
                  placement="leftTop"
                  icon={<ExclamationCircleOutlined />}
                >
                  <OneButton type="primary" className="one-save-profile" icon={<SaveOutlined />}>
                    {t('Save')}
                  </OneButton>
                </Popconfirm>
              </>
            )}
          </Col>
        </Row>

        <Table
          className="one-profile-table"
          loading={loading}
          dataSource={profiles}
          rowKey={'_id'}
          pagination={false}
          rowSelection={
            checkACL(Constants.acl.USERS, Constants.permissions.M)
              ? { type: 'checkbox', selectedRowKeys: profilesToDelete, ...rowSelection }
              : undefined
          }
          expandable={{
            expandedRowKeys: expandedRow,
            onExpand: (_, record: Profile) => {
              const index = expandedRow.indexOf(record._id);
              let expended = expandedRow;
              if (index !== -1) {
                expended.splice(index, 1);
              } else {
                expended = [...expended, record._id];
              }
              setExpandedRow(expended);
            },
            expandedRowRender: (p: Profile) => (
              <>
                <Title level={5} className="one-resource-title">
                  {t('Resources permissions')}
                </Title>
                {resources.map((r: Resource) => (
                  <Row
                    key={r._id}
                    gutter={[12, 24]}
                    onChange={(event: any) => onChangePermission(event.target.value, p._id, r.aclResource)}
                    className="one-resource-row"
                  >
                    <Col span={10}>{`${t(r.name)} (${r.aclResource})`}</Col>
                    <Col span={14}>
                      <Radio.Group
                        name={`${r.aclResource}-${p._id}`}
                        value={
                          (editedResource[p._id] && editedResource[p._id][r.aclResource]) ||
                          p.acl[r.aclResource] ||
                          r.defaultPermission
                        }
                      >
                        <Radio value={Constants.permissions.NONE}>{t('None')}</Radio>
                        <Radio value={Constants.permissions.R}>{t('Read')}</Radio>
                        <Radio value={Constants.permissions.W}>{t('Write')}</Radio>
                        <Radio value={Constants.permissions.M}>{t('Manager')}</Radio>
                      </Radio.Group>
                    </Col>
                  </Row>
                ))}
              </>
            ),
            rowExpandable: () => checkACL(Constants.acl.PROFILES, Constants.permissions.R),
          }}
        >
          <Column title={t('Name')} dataIndex="name" width={200} />
          <Column
            title={t('Created At')}
            dataIndex="createdAt"
            align={'right'}
            render={(_: string, item: Profile) => formatDate(item.createdAt)}
          />
          <Column
            title={t('Updated At')}
            dataIndex="updatedAt"
            align={'right'}
            render={(_: string, item: Profile) => formatDate(item.updatedAt)}
          />
        </Table>
      </Content>
    </>
  );
};

export default ProfileManager;
