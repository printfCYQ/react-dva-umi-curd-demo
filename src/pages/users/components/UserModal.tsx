import React, { useEffect, FC } from 'react';
import { Modal, Form, Input } from 'antd';
import { SingleUserModelState, FormValues } from '../data';

interface UserModalProps {
  visible: boolean;
  record: SingleUserModelState | undefined;
  onCancel: () => void;
  onFinish: (values: FormValues) => void;
}

const UserModal: FC<UserModalProps> = (props: any) => {
  const { visible, record, onCancel, onFinish } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (record === undefined) {
      form.resetFields();
    } else {
      form.setFieldsValue(record);
    }
  }, [visible]);

  const onOk = () => {
    form.submit();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        forceRender
      >
        <Form
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Create Time"
            name="create_time"
            rules={[
              { required: true, message: 'Please input your createTime!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please input your status!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModal;
