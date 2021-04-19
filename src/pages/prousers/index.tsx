import React, { useState, FC } from 'react';
import { Popconfirm, Button, Pagination, message } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { connect, Dispatch, Loading, UserModelState } from 'umi';
import { SingleUserModelState, FormValues } from './data.d';
import UserModal from './components/UserModal';
import { edit, add } from './service';

interface UserPageProps {
  prousers: UserModelState;
  dispatch: Dispatch;
  userListLoding: boolean;
}

const UserListPage: FC<UserPageProps> = ({
  prousers,
  dispatch,
  userListLoding,
}) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [record, setRecord] = useState<SingleUserModelState | undefined>(
    undefined,
  );

  const columns: ProColumns<SingleUserModelState>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      valueType: 'digit',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      valueType: 'text',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      valueType: 'text',
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (text: any, record: SingleUserModelState) => [
        <a
          onClick={() => {
            editClick(record);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={() => {
            confirm(record.id);
          }}
          okText="Yes"
          cancelText="No"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const confirm = (id: number) => {
    console.log(id);
    dispatch({
      type: 'prousers/del',
      payload: { id },
    });
  };

  const editClick = (record: SingleUserModelState) => {
    setVisible(true);
    setRecord(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = async (values: FormValues) => {
    setConfirmLoading(true);
    console.log('Success:', values);

    const id = record ? record.id : 0;

    let fun;

    id ? (fun = edit) : (fun = add);

    const res = await fun({ id, values });
    if (res) {
      setVisible(false);
      message.success(`${id ? '编辑' : '新增'}成功`);

      reloadTable();
      setConfirmLoading(false);
    } else {
      message.error(`${id ? '编辑' : '新增'}失败`);
      setConfirmLoading(false);
    }
  };

  const handleAdd = () => {
    setRecord(undefined);
    setVisible(true);
  };
  const paginationHandel = (page: number, pageSize: number | undefined) => {
    console.log(page, pageSize);
    dispatch({
      type: 'prousers/getRemote',
      payload: {
        page,
        per_page: pageSize,
      },
    });
  };

  const pageSizeHandel = (current: number, size: number) => {
    console.log(current, size);
    dispatch({
      type: 'prousers/getRemote',
      payload: {
        page: current,
        per_page: size,
      },
    });
  };

  const reloadTable = () => {
    dispatch({
      type: 'prousers/getRemote',
      payload: {
        page: prousers.meta.page,
        per_page: prousers.meta.per_page,
      },
    });
  };

  return (
    <div className="list-table">
      <ProTable
        headerTitle="user List"
        columns={columns}
        dataSource={prousers.data}
        rowKey="id"
        loading={userListLoding}
        search={false}
        pagination={false}
        options={{
          density: true,
          fullScreen: true,
          reload: () => {
            reloadTable();
          },
          setting: true,
          search: true,
        }}
        toolBarRender={() => [
          <Button onClick={handleAdd} type="primary">
            Add
          </Button>,
          <Button onClick={reloadTable} type="primary">
            reLoad
          </Button>,
        ]}
      />
      <Pagination
        style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}
        total={prousers.meta.total}
        current={prousers.meta.page}
        pageSize={prousers.meta.per_page}
        pageSizeOptions={['5', '10', '15', '20']}
        showSizeChanger
        showQuickJumper
        showTotal={(total: number) => `Total ${total} items`}
        onChange={paginationHandel}
        onShowSizeChange={pageSizeHandel}
      />
      <UserModal
        confirmLoading={confirmLoading}
        visible={visible}
        record={record}
        onFinish={onFinish}
        onCancel={handleCancel}
      ></UserModal>
    </div>
  );
};

const mapStateToProps = ({
  prousers,
  loading,
}: {
  prousers: UserModelState;
  loading: Loading;
}) => {
  return { prousers, userListLoding: loading.models.prousers };
};

export default connect(mapStateToProps)(UserListPage);
