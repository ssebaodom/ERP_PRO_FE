import React, { useEffect, useState } from "react";
import "./ModalAddCustomerForm.css";
import { Input, Modal, Space, Button, Select, Form } from "antd";

import send_icon from "../../../../Icons/send_icon.svg";
import { ApiGetTaskDetail, ApiGetTaskMaster } from "../../API";

// bắt buộc khai báo bên ngoài

const ModalAddCustomerForm = (props) => {
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});

  const handleCancelModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
    inputForm.resetFields();
  };

  const onSubmitForm = () => {
    const a = { ...inputForm.getFieldsValue() };
    console.log(a);
  };

  const onSubmitFormFail = () => {};

  const getDataEdit = (id) => {
    ApiGetTaskMaster({ id: id, orderby: "id" }).then((res) => {
      inputForm.setFieldValue(`taskName`, res.data[0]?.text);
      inputForm.setFieldValue(`taskType`, res.data[0]?.loai_cv);
      inputForm.setFieldValue(`priority`, res.data[0]?.muc_do);
      inputForm.setFieldValue(`assignedName`, res.data[0]?.assigned_name);
      inputForm.setFieldValue(`deptName`, res.data[0]?.ma_bp);
      inputForm.setFieldValue(`tourName`, res.data[0]?.ma_tuyen);
    });
  };

  useEffect(() => {
    setOpenModal(props.openModalState);
    if (props.openModalState && props.openModalType === "Edit") {
      setInitialValues({});
      getDataEdit(props.currentRecord ? props.currentRecord : 0);
    }
  }, [JSON.stringify(props)]);

  return (
    <Modal
      className="default_modal"
      open={isOpenModal}
      onCancel={handleCancelModal}
      closable={false}
      centered
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width={600}
    >
      <div className="default_modal_header">
        <span className="default_header_label">Thêm mới hình thức khách hàng</span>
      </div>
      <Form
        form={inputForm}
        className="default_modal_container"
        onFinishFailed={onSubmitFormFail}
        onFinish={onSubmitForm}
      >
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Mã hình thức
            </span>
            <Form.Item
              name="formCode"
              rules={[{ required: true, message: "Điền mã hình thức" }]}
            >
              <Input placeholder="Nhập mã hình thức" />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Tên hình thức
            </span>
            <Form.Item
              name="formName"
              rules={[{ required: true, message: "Điền tên hình thức" }]}
            >
              <Input placeholder="Nhập tên hình thức" />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Trạng thái
            </span>
            <Form.Item
              name="status"
              rules={[{ required: true, message: "Điền tên hình thức" }]}
            >
              <Select
                defaultValue="1"
                options={[
                  { value: "1", label: "Hoạt động" },
                  { value: "0", label: "Huỷ" },
                ]}
              />
            </Form.Item>
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

export default ModalAddCustomerForm;
