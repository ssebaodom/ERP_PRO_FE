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
} from "antd";
import dayjs from "dayjs";
const ModalAddTask = (props) => {
  const [isOpenModal, setOpenModal] = useState();
  const [addForm] = Form.useForm();

  const handleOkSearchModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
  };

  const handleChangeTaskName = (value) => {
    console.log(addForm.getFieldValue());
  };

  const handleCancelSearchModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
  };

  useEffect(() => {
    setOpenModal(props.openModalState);
  }, [props]);
  return (
    <Modal
      className="default_modal"
      open={isOpenModal}
      onOk={handleOkSearchModal}
      onCancel={handleCancelSearchModal}
      closable={false}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      style={{ top: 100, padding: 0 }}
      width={1000}
    >
      <div className="default_modal_header">
        <span className="default_header_label">Thêm mới công việc</span>
      </div>
      <Form form={addForm} className="default_modal_container">
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
          <Space direction="horizontal" style={{ gap: "16px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <span className="default_bold_label">Loại công việc</span>
              <Form.Item
                name="taskType"
                rules={[
                  { required: true, message: "Vui lòng chọn loại công việc" },
                ]}
              >
                <Select
                  defaultValue="lucy"
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
                name="Độ ưu tiên"
                rules={[{ required: true, message: "Vui lòng mức độ ưu tiên" }]}
              >
                <Select
                  defaultValue="low"
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
                  name="Giờ bắt đầu"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giờ bắt đầu",
                    },
                  ]}
                >
                  <TimePicker
                    defaultValue={dayjs("12:08", "HH:mm")}
                    format={"HH:mm"}
                  />
                </Form.Item>
                <Form.Item
                  name="Ngày bắt đầu"
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
                  <TimePicker
                    defaultValue={dayjs("12:08", "HH:mm")}
                    format={"HH:mm"}
                  />
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
              name="TaskName"
              rules={[{ required: true, message: "Vui lòng tên tuyến" }]}
            >
              <Input onChange={handleChangeTaskName} placeholder="Nhập tuyến" />
            </Form.Item>
          </Space>
        </div>

        <div className="default_modal_group_items default_modal_details">
          <span className="default_bold_label" style={{borderBottom:'1.5px solid #E2E4EE',padding:'10px 0px'}}>Chi tiết</span>

        </div>
      </Form>
    </Modal>
  );
};

export default ModalAddTask;
