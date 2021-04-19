import React, { useState, FC } from 'react';
import { Table, Space, Popconfirm, Button } from 'antd';
import { connect, Dispatch, Loading, UserModelState } from 'umi';
import { SingleUserModelState,FormValues } from './data.d';
import UserModal from './components/UserModal';
interface UserPageProps {
  users: UserModelState;
  dispatch: Dispatch;
  userListLoding: boolean;
}

const UserListPage: FC<UserPageProps> = ({
  users,
  dispatch,
  userListLoding,
}) => {
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<SingleUserModelState | undefined>(undefined);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: SingleUserModelState) => (
        <Space size="middle">
          <a
            onClick={() => {
              edit(record);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => {
              confirm(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>删除</a>
          </Popconfirm>
          ,
        </Space>
      ),
    },
  ];

  const confirm = (id: number) => {
    console.log(id);
    dispatch({
      type: 'users/del',
      payload: { id },
    });
  };

  const edit = (record: SingleUserModelState) => {
    setVisible(true);
    setRecord(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values: FormValues) => {
    console.log('Success:', values);

    const id = record ? record.id : 0;

    if (id) {
      dispatch({
        type: 'users/edit',
        payload: { id, values },
      });
    } else {
      dispatch({
        type: 'users/add',
        payload: { values },
      });
    }

    setVisible(false);
  };

  const handleAdd = () => {
    setRecord(undefined);
    setVisible(true);
  };

  return (
    <div className="list-table">
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add
      </Button>
      <Table
        columns={columns}
        dataSource={users.data}
        rowKey="id"
        loading={userListLoding}
      />
      <UserModal
        visible={visible}
        record={record}
        onFinish={onFinish}
        onCancel={handleCancel}
      ></UserModal>
    </div>
  );
};

const mapStateToProps = ({
  users,
  loading,
}: {
  users: UserModelState;
  loading: Loading;
}) => {
  return { users, userListLoding: loading.models.users };
};

export default connect(mapStateToProps)(UserListPage);
