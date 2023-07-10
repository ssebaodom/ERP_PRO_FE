import React, { useEffect, useState } from "react";
import "./ModalAddTicket.css";
import {
  Input,
  Modal,
  Space,
  Button,
  Select,
  Form,
  ColorPicker,
  notification,
} from "antd";

import send_icon from "../../../../Icons/send_icon.svg";
import {
  ApiGetTaskDetail,
  ApiGetTaskMaster,
  ApiWebLookup,
  SoFuckingUltimateApi,
} from "../../API";
import SelectNotFound from "../../../../Context/SelectNotFound";
import SelectItemCode from "../../../../Context/SelectItemCode";
import { useDebouncedCallback } from "use-debounce";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";

// bắt buộc khai báo bên ngoài

const ModalAddTicket = (props) => {
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onChange = ({ fileList }) => {
    setFileList(fileList);
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleCancelModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
    inputForm.resetFields();
    setFileList([]);
  };

  const onSubmitForm = () => {
    const a = { ...inputForm.getFieldsValue() };
    SoFuckingUltimateApi({
      store: "api_create_ticket",
      data: {
        ma_kh: a.customerCode,
        ma_nv: a.employeeCode,
        dien_giai: a.description,
        loai_tk: a.ticketTypeCode,
        taskid: a.taskCode,
        status: a.status,
        user: 0,
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data === true) {
          notification.success({
            message: `Thành công`,
          });
          props.refreshData();
          handleCancelModal();
        } else {
          notification.warning({
            message: `Có lỗi xảy ra khi thực hiện`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onSubmitFormFail = () => {};

  const lookupData = (item) => {
    setSelectLoading(true);
    ApiWebLookup({
      userId: "1",
      controller: item.controller,
      pageIndex: 1,
      FilterValueCode: item.value.trim(),
    }).then((res) => {
      const resOptions = res.data.map((item) => {
        return {
          value: item.code.trim(),
          label: item.name.trim(),
        };
      });
      setSelectLoading(false);
      setSelectOptions([...resOptions]);
    });
  };

  const handleSelectionChange = useDebouncedCallback((actions, value) => {
    switch (actions) {
      case "sale_employee":
        lookupData({ controller: "dmnvbh_lookup", value: value });
        break;
      case "customer":
        lookupData({ controller: "dmkh_lookup", value: value });
        break;
      case "unit":
        lookupData({ controller: "dmdvcs_lookup", value: value });
        break;
      case "ticket_type":
        lookupData({ controller: "dmloaitk_lookup", value: value });
        break;
      case "task":
        lookupData({ controller: "sysevents_lookup", value: value });
        break;
      default:
        break;
    }
  }, 600);

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
        <span className="default_header_label">{`${
          props.openModalType == "Edit" ? "Sửa" : "Thêm mới"
        } ticket`}</span>
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
              Khách hàng
            </span>
            <Form.Item
              style={{ width: "150px", flex: "none" }}
              name="customerCode"
              rules={[{ required: true, message: "Điền khách hàng" }]}
            >
              <Select
                showSearch
                placeholder={`Khách hàng`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={true}
                dropdownStyle={{ minWidth: "20%" }}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("customer", e);
                }}
                onSelect={(key, item) => {
                  inputForm.setFieldValue("customerName", item.label);
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
            <Form.Item name="customerName">
              <Input
                disabled={true}
                className="default_disable_input"
                placeholder="Tên khách hàng"
              />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Nhân viên
            </span>
            <Form.Item
              style={{ width: "150px", flex: "none" }}
              name="employeeCode"
              rules={[{ required: true, message: "Điền nhân viên" }]}
            >
              <Select
                showSearch
                placeholder={`Nhân viên`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={true}
                dropdownStyle={{ minWidth: "20%" }}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("sale_employee", e);
                }}
                onSelect={(key, item) => {
                  inputForm.setFieldValue("employeeName", item.label);
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
            <Form.Item name="employeeName">
              <Input
                disabled={true}
                className="default_disable_input"
                placeholder="Tên nhân viên"
              />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Loại ticket
            </span>
            <Form.Item
              style={{ width: "150px", flex: "none" }}
              name="ticketTypeCode"
              rules={[{ required: true, message: "Điền loại ticket" }]}
            >
              <Select
                showSearch
                placeholder={`Loại ticket`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("ticket_type", e);
                }}
                onSelect={(key, item) => {
                  inputForm.setFieldValue("ticketTypeName", item.label);
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
            <Form.Item name="ticketTypeName">
              <Input
                disabled={true}
                className="default_disable_input"
                placeholder="Tên loại ticket"
              />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Công việc
            </span>
            <Form.Item
              style={{ width: "150px", flex: "none" }}
              name="taskCode"
              rules={[{ required: true, message: "Điền tên công việc" }]}
            >
              <Select
                showSearch
                placeholder={`Tên công việc`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                dropdownStyle={{ minWidth: "20%" }}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("task", e);
                }}
                onSelect={(key, item) => {
                  inputForm.setFieldValue("taskName", item.label);
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
            <Form.Item name="taskName">
              <Input
                disabled={true}
                className="default_disable_input"
                placeholder="Tên công việc"
              />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Nội dung
            </span>
            <Form.Item name="description">
              <Input.TextArea
                autoSize={{
                  minRows: 1,
                  maxRows: 4,
                }}
                placeholder="Nhập nội dung"
              />
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
              initialValue={"1"}
              rules={[{ required: true, message: "Điền tên trạng thái" }]}
            >
              <Select
                options={[
                  { value: "1", label: "Đã xử lý" },
                  { value: "0", label: "Chưa xử lý" },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <ImgCrop
            rotationSlider
            modalTitle={"Chỉnh sửa"}
            showReset
            resetText={"Khôi phục"}
            aspect={0.5625}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              action="localhost:3000"
              multiple
              beforeUpload={(file) => {
                console.log(file);
              }}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </ImgCrop>
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

export default ModalAddTicket;
