import {
  Button,
  DatePicker,
  Form,
  Modal,
  notification,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { formStatus } from "../../../../utils/constants";
import { SoFuckingUltimateGetApi, UltimatePutDataApi } from "../../../DMS/API";
import FormSelectDetail from "../../../ReuseComponents/FormSelectDetail";
import { getApproveItemDetail } from "../../Store/Selectors/Selectors";
import TableDetail from "./Details/TableDetail";

const ModalApproveItems = ({
  handleCloseModal,
  openModalState,
  currentRecord,
  openModalType,
  refreshData,
}) => {
  const [dataForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});
  const [selectLoading, setSelectLoading] = useState(false);

  const [detailData, setDetailData] = useState([]);
  const [detaiLayout, setDetaiLayout] = useState([]);
  const detailTable = useRef();
  const detailTableData = useSelector(getApproveItemDetail);

  const handleCancelModal = () => {
    setOpenModal(false);
    setDetailData([]);
    handleCloseModal();
    dataForm.resetFields();
  };

  const onSubmitForm = async () => {
    const master = {
      id: currentRecord ? currentRecord : null,
      action:
        openModalType === formStatus.EDIT ? openModalType : formStatus.ADD,
      UserId: 0,
      ...dataForm.getFieldsValue(),
    };
    delete master.ten_nvbh;

    UltimatePutDataApi({
      store: "api_create_item_approve",
      data: master,
      listData: detailTableData,
    })
      .then((res) => {
        if (res.status != "Failed") {
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
      store: "api_get_items_approve",
      data: {
        id: id,
        pageIndex: 1,
        pageSize: 10,
      },
    }).then((res) => {
      const keys = Object.keys(dataForm.getFieldsValue());
      if (res.data.length > 0)
        keys.map((item) => {
          const field = res?.reportLayoutModel?.find(
            (layout) => layout?.field == item
          );
          return field?.type == "Datetime"
            ? dataForm.setFieldValue(item, dayjs(res?.data[0][item]))
            : dataForm.setFieldValue(item, res?.data[0][item]);
        });
    });

    SoFuckingUltimateGetApi({
      store: "api_get_approve_item_detail",
      data: {
        id: id,
      },
    }).then((res) => {
      setDetailData(res?.data);
      setDetaiLayout(res?.reportLayoutModel);
    });
  };

  const checkingData = async () => {
    try {
      await dataForm.validateFields();
      detailTable.current.getData();
    } catch (error) {
      console.log(error);
      return;
    }
  };

  //////////////////////////effects/////////////////////////////////////////////

  useEffect(() => {
    setOpenModal(openModalState);
    if (openModalState) {
      getDataEdit(currentRecord ? currentRecord : 0);
    }
  }, [JSON.stringify(openModalState)]);

  useEffect(() => {
    if (detailTableData && detailTableData.length > 0) {
      onSubmitForm();
    }
  }, [detailTableData]);

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
        } phân quyền sản phẩm`}</span>
      </div>
      <Form
        form={dataForm}
        className="default_modal_container"
        onFinishFailed={onSubmitFormFail}
        onFinish={onSubmitForm}
      >
        <FormSelectDetail
          disable={openModalType == formStatus.VIEW ? true : false}
          label="Nhân viên"
          keyCode="ma_nvbh"
          keyName="ten_nvbh"
          controller="dmnvbh_lookup"
          form={dataForm}
          placeHolderCode="Nhân viên"
          placeHolderName="Tên nhân viên"
          required={true}
        />

        <div className="default_modal_group_items">
          <div className="split__view__detail__primary__item">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Ngày bắt đầu
            </span>

            <Form.Item
              className="flex-1"
              name="date_from"
              rules={[{ required: true, message: "Điền ngày bắt đầu" }]}
            >
              <DatePicker
                disabled={openModalType === "VIEW" ? true : false}
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                placeholder="Chọn ngày"
              />
            </Form.Item>
          </div>

          <div className="split__view__detail__primary__item">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Ngày kết thúc
            </span>

            <Form.Item
              className="flex-1"
              name="date_to"
              rules={[{ required: true, message: "Điền ngày kết thúc" }]}
            >
              <DatePicker
                disabled={openModalType === "VIEW" ? true : false}
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                placeholder="Chọn ngày"
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

        <TableDetail
          Tablecolumns={detaiLayout}
          data={detailData}
          masterForm={dataForm}
          Action={openModalType}
          ref={detailTable}
        />

        <Space style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            className="default_subsidiary_button"
            onClick={handleCancelModal}
          >
            Huỷ
          </Button>

          <Form.Item>
            <Button
              onClick={checkingData}
              className="default_primary_button"
              icon={<i className="pi pi-send"></i>}
            >
              Lưu
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default memo(ModalApproveItems);
