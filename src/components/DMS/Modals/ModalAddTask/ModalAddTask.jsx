import React, { useEffect, useState } from "react";
import "./ModalAddTask.css";
import {
  Input,
  Dropdown,
  Menu,
  Modal,
  Space,
  Button,
  DatePicker,
  Select,
  Form,
  TimePicker,
  Table,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import ResizableAntdTable from "resizable-antd-table";
import send_icon from "../../../../Icons/send_icon.svg";
import { v4 as uuidv4 } from "uuid";
import addNewRow from "../../../../app/hooks/addNewRow";

const ModalAddTask = (props) => {
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({
    taskType: "lucy",
    priority: "low",
    tourName: "abc",
  });
  const [inputForm] = Form.useForm();

  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "3",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "4",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "5",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
  ]);

  const addRow = () => {
    const newRow = addNewRow(columns);
    setDataSource([...dataSource, newRow]);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      dataType: "Text",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      dataType: "Numeric",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      dataType: "Text",
      key: "address",
    },
  ];

  const handleChangeTaskName = (value) => {
    console.log(inputForm.getFieldValue());
    inputForm.setFieldsValue("");
  };

  const handleCancelModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
    inputForm.resetFields();
  };

  const onSubmitForm = () => {
    const a = { ...inputForm.getFieldsValue(), ...{ detail: dataSource } };
    console.log(a);
  };

  const onSubmitFormFail = () => {};

  useEffect(() => {
    setOpenModal(props.openModalState);
  }, [props]);
  return (
    <Modal
      className="default_modal"
      open={isOpenModal}
      onCancel={handleCancelModal}
      closable={false}
      centered
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width={1000}
    >
      <div className="default_modal_header">
        <span className="default_header_label">Thêm mới công việc</span>
      </div>
      <Form
        form={inputForm}
        initialValues={initialValues}
        className="default_modal_container"
        onFinishFailed={onSubmitFormFail}
        onFinish={onSubmitForm}
      >
        <div className="default_modal_group_items">
          <Space direction="vertical">
            <span className="default_bold_label">Tên công việc</span>
            <Form.Item
              name="taskName"
              rules={[
                { required: true, message: "Vui lòng điền tên công việc" },
              ]}
            >
              <Input
                onChange={handleChangeTaskName}
                placeholder="Nhập tên công việc"
              />
            </Form.Item>
          </Space>
        </div>

        <div className="default_modal_group_items">
          <Space direction="horizontal">
            <Space direction="vertical" style={{ width: "100%" }}>
              <span className="default_bold_label">Loại công việc</span>
              <Form.Item
                name="taskType"
                rules={[
                  { required: true, message: "Vui lòng chọn loại công việc" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "jack", label: "Jack" },
                    { value: "lucy", label: "Lucy" },
                    { value: "Yiminghe", label: "yiminghe" },
                  ]}
                />
              </Form.Item>
            </Space>
            <Space direction="vertical" style={{ width: "100%" }}>
              <span className="default_bold_label">Mức độ ưu tiên</span>
              <Form.Item
                name="priority"
                rules={[{ required: true, message: "Vui lòng mức độ ưu tiên" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "low", label: "Thấp" },
                    { value: "medium", label: "Trung bình" },
                    { value: "high", label: "Cao" },
                  ]}
                />
              </Form.Item>
            </Space>
            <Space direction="vertical">
              <span className="default_bold_label">Bắt đầu</span>
              <Space className="modal__time__picker">
                <Form.Item
                  name="startTime"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giờ bắt đầu",
                    },
                  ]}
                >
                  <TimePicker placeholder="Giờ" format={"HH:mm"} />
                </Form.Item>
                <Form.Item
                  name="startDate"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày bắt đầu",
                    },
                  ]}
                >
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Space>
            </Space>
            <Space direction="vertical">
              <span className="default_bold_label">Kết thúc</span>
              <Space className="modal__time__picker">
                <Form.Item
                  name="endTime"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày kết thúc",
                    },
                  ]}
                >
                  <TimePicker placeholder="Giờ" format={"HH:mm"} />
                </Form.Item>
                <Form.Item
                  name="endDate"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày kết thúc",
                    },
                  ]}
                >
                  <DatePicker
                    format={"DD/MM/YYYY"}
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Space>
            </Space>
          </Space>
        </div>

        <div className="default_modal_group_items">
          <Space direction="vertical">
            <span className="default_bold_label">Người nhận việc</span>
            <Form.Item
              name="assignedName"
              rules={[
                { required: true, message: "Vui lòng điền người nhận việc" },
              ]}
            >
              <Input
                onChange={handleChangeTaskName}
                placeholder="Nhập người nhận việc"
              />
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <span className="default_bold_label">Bộ phận</span>
            <Form.Item
              name="deptName"
              rules={[{ required: true, message: "Vui lòng điền bộ phận" }]}
            >
              <Input
                onChange={handleChangeTaskName}
                placeholder="Nhập bộ phận"
              />
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <span className="default_bold_label">Tuyến</span>
            <Form.Item
              name="tourName"
              rules={[{ required: true, message: "Vui lòng tên tuyến" }]}
            >
              <Input onChange={handleChangeTaskName} placeholder="Nhập tuyến" />
            </Form.Item>
          </Space>
        </div>

        <div
          className="default_modal_group_items default_modal_details"
          style={{ flexDirection: "column", gap: "10px" }}
        >
          <span
            className="default_bold_label"
            style={{ borderBottom: "1.5px solid #E2E4EE", padding: "10px 0px" }}
          >
            Chi tiết
          </span>

          <Table
            columns={columns}
            dataSource={dataSource}
            rowClassName="default_detail_table_row"
            className="default_detail_table"
            pagination={{
              position: ["none"],
              defaultPageSize: 1000,
            }}
          />
          <div
            className="default_modal_group_items"
            style={{ flexDirection: "column", gap: "10px" }}
          >
            <Button
              className="default_button"
              style={{ width: "120px", padding: "5px 15px" }}
              icon={<PlusOutlined className="sub_text_color" />}
              onClick={() => {
                addRow();
              }}
            >
              <span style={{ fontWeight: "bold" }}>Thêm mới</span>
            </Button>
          </div>
        </div>

        <Space style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            className="default_subsidiary_button"
            onClick={handleCancelModal}
          >
            Huỷ
          </Button>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="default_primary_button"
              icon={<img src={send_icon} alt="" />}
            >
              Lưu
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default ModalAddTask;
