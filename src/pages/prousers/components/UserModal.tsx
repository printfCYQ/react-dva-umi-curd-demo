import React, { useEffect, FC } from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';
import { SingleUserModelState, FormValues } from '../data';
import moment from 'moment';

interface UserModalProps {
  visible: boolean;
  confirmLoading: boolean;
  record: SingleUserModelState | undefined;
  onCancel: () => void;
  onFinish: (values: FormValues) => void;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UserModal: FC<UserModalProps> = (props: any) => {
  const { visible, record, onCancel, onFinish, confirmLoading } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (record === undefined) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...record,
        create_time: moment(record.create_time),
        status: Boolean(record.status),
      });
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
        title={record ? '编辑' : '新增'}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={onOk}
        onCancel={onCancel}
        forceRender
      >
        <Form
          {...layout}
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ status: true }}
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
            <DatePicker showTime />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please input your status!' }]}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserModal;
