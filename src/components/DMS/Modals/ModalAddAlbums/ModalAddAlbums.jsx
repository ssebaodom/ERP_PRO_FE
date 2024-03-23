import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import "./ModalAddAlbums.css";

import { memo } from "react";
import { KeyFormatter } from "../../../../app/Options/KeyFormatter";
import send_icon from "../../../../Icons/send_icon.svg";
import { formStatus } from "../../../../utils/constants";
import { SoFuckingUltimateApi, SoFuckingUltimateGetApi } from "../../API";

const ModalAddAlbums = ({
  handleCloseModal,
  openModalState,
  currentRecord,
  openModalType,
  refreshData,
}) => {
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});
  const [selectLoading, setSelectLoading] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);
  const [disableFields, setDisableFields] = useState(false);

  const handleCancelModal = () => {
    setOpenModal(false);
    handleCloseModal();
    inputForm.resetFields();
  };

  const onSubmitForm = (data) => {
    const master = { ...data };
    SoFuckingUltimateApi({
      store: "Api_create_dmalbum",
      data: {
        action:
          openModalType === formStatus.EDIT ? openModalType : formStatus.ADD,
        userid: 0,
        ...master,
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data === true) {
          notification.success({
            message: `Thành công`,
          });
          refreshData();
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
      store: "api_get_dmalbum",
      data: {
        id: id.trim(),
        pageIndex: 1,
        pageSize: 10,
      },
    }).then((res) => {
      const keys = Object.keys(inputForm.getFieldsValue());
      keys.map((item) => {
        inputForm.setFieldValue(item, res.data[0][item]);
      });
      setDisableFields(true);
    });
  };

  useEffect(() => {
    setOpenModal(openModalState);
    if (openModalState && openModalType === formStatus.EDIT) {
      getDataEdit(currentRecord ? currentRecord : 0);
    }
  }, [JSON.stringify(openModalState)]);

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
          openModalType == formStatus.EDIT ? "Sửa" : "Thêm mới"
        } album`}</span>
      </div>
      <Form
        form={inputForm}
        className="default_modal_container"
        onFinishFailed={onSubmitFormFail}
        onFinish={onSubmitForm}
      >
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "150px" }}>
              Mã album
            </span>
            <Form.Item
              name="ma_album"
              rules={[
                { required: true, message: "Mã album không được để trống" },
              ]}
            >
              <Input
                disabled={disableFields}
                onInput={(e) => (e.target.value = KeyFormatter(e.target.value))}
                placeholder="Mã album"
              />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "150px" }}>
              Tên album
            </span>
            <Form.Item
              name="ten_album"
              rules={[
                { required: true, message: "Tên album không được để trống" },
              ]}
            >
              <Input placeholder="Tên album" />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "150px" }}>
              Yêu cầu ảnh
            </span>
            <Form.Item
              name="yc_anh_yn"
              initialValue={false}
              valuePropName="checked"
            >
              <Checkbox></Checkbox>
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "150px" }}>
              Ghi chú
            </span>
            <Form.Item name="ghi_chu">
              <Input.TextArea
                autoSize={{
                  minRows: 1,
                  maxRows: 4,
                }}
                placeholder="Ghi chú"
              />
            </Form.Item>
          </div>
        </div>

        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "150px" }}>
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

export default memo(ModalAddAlbums);
