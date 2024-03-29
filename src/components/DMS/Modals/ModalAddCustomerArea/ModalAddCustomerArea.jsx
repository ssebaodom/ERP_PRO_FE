import { Button, Form, Input, Modal, notification, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import "./ModalAddCustomerArea.css";

import { useDebouncedCallback } from "use-debounce";
import { KeyFormatter } from "../../../../app/Options/KeyFormatter";
import SelectItemCode from "../../../../Context/SelectItemCode";
import SelectNotFound from "../../../../Context/SelectNotFound";
import send_icon from "../../../../Icons/send_icon.svg";
import {
  ApiWebLookup,
  SoFuckingUltimateApi,
  SoFuckingUltimateGetApi,
} from "../../API";

// bắt buộc khai báo bên ngoài

const ModalAddCustomerArea = (props) => {
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});
  const [selectLoading, setSelectLoading] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);
  const [disableFields, setDisableFields] = useState(false);

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

  const handleCancelModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
    inputForm.resetFields();
    setDisableFields(false);
  };

  const onSubmitForm = () => {
    const a = { ...inputForm.getFieldsValue() };
    SoFuckingUltimateApi({
      store: "Api_Create_area",
      data: {
        action: props.openModalType === "EDIT" ? props.openModalType : "ADD",
        ma_khu_vuc: a.areaCode,
        ten_khu_vuc: a.areaName,
        ds_tinh: a.provinceCode.join(","),
        ds_quan: a.districtCode.join(","),
        status: a.status,
        userid: 0,
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

  const getDataEdit = (id) => {
    SoFuckingUltimateGetApi({
      store: "Get_Area",
      data: {
        id: id.trim(),
        pageIndex: 1,
        pageSize: 10,
        SearchKey: "",
        status: "",
      },
    }).then((res) => {
      const provinceCode =
        res.data[0]?.ds_tinh.trim().split(",")[0] !== ""
          ? res.data[0]?.ds_quan.split(",")
          : [];
      const districtCode =
        res.data[0]?.ds_quan.split(",")[0] !== ""
          ? res.data[0]?.ds_quan.split(",")
          : [];
      inputForm.setFieldValue(`areaCode`, res.data[0]?.ma_khu_vuc);
      inputForm.setFieldValue(`areaName`, res.data[0]?.ten_khu_vuc);
      inputForm.setFieldValue(`provinceCode`, provinceCode);
      inputForm.setFieldValue(`districtCode`, districtCode);
      inputForm.setFieldValue(`status`, res.data[0]?.status);
      setDisableFields(true);
    });
  };

  const handleSelectionChange = useDebouncedCallback((actions, value) => {
    switch (actions) {
      case "province":
        lookupData({ controller: "dmtinh_lookup", value: value });
        break;
      case "district":
        lookupData({ controller: "dmquan_lookup", value: value });
        break;

      default:
        break;
    }
  }, 600);

  useEffect(() => {
    setOpenModal(props.openModalState);
    if (props.openModalState && props.openModalType === "EDIT") {
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
          props.openModalType == "EDIT" ? "Sửa" : "Thêm mới"
        } danh mục khu vực`}</span>
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
              Mã khu vực
            </span>
            <Form.Item
              name="areaCode"
              rules={[{ required: true, message: "Điền mã khu vực" }]}
            >
              <Input
                disabled={disableFields}
                onInput={(e) => (e.target.value = KeyFormatter(e.target.value))}
                placeholder="Nhập mã khu vực"
              />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Tên khu vực
            </span>
            <Form.Item
              name="areaName"
              rules={[{ required: true, message: "Điền tên khu vực" }]}
            >
              <Input placeholder="Nhập tên khu vực" />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Tỉnh thành
            </span>
            <Form.Item
              name="provinceCode"
              rules={[{ required: true, message: "Điền tỉnh thành" }]}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder={`Tỉnh thành`}
                style={{
                  width: "100%",
                  flex: "none",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("province", e);
                }}
                onSelect={(key, item) => {}}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Quận huyện
            </span>
            <Form.Item
              name="districtCode"
              rules={[{ required: true, message: "Điền quận huyện" }]}
            >
              <Select
                mode="multiple"
                showSearch
                placeholder={`Quận huyện`}
                style={{
                  width: "100%",
                  flex: "none",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("district", e);
                }}
                onSelect={(key, item) => {
                  // setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
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
              rules={[{ required: true, message: "Điền tên trạng thái" }]}
              initialValue={"1"}
            >
              <Select
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

export default ModalAddCustomerArea;
