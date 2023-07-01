import React, { useEffect, useState } from "react";
import "./ModalAddTaskSchedule.css";
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
  Tooltip,
  Checkbox,
  Spin,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import ResizableAntdTable from "resizable-antd-table";
import send_icon from "../../../../Icons/send_icon.svg";
import copy__icon from "../../../../Icons/copy__icon.svg";
import delete__icon from "../../../../Icons/delete__icon.svg";
import lock__icon from "../../../../Icons/lock__icon.svg";
import checked__icon from "../../../../Icons/checked__icon.svg";
import addNewRow from "../../../../app/hooks/addNewRow";
import renderCells from "../../../../app/hooks/renderCells";
import renderEditColumns from "../../../../app/hooks/renderEditColumns";
import getEditRowsValue from "../../../../app/hooks/getEditRowsValue";
import getChangedTableRow from "../../../../app/hooks/getChangedTableRow";
import {
  ApiCreateTaskSchedule,
  ApiGetTaskDetail,
  ApiGetTaskMaster,
  ApiWebLookup,
} from "../../API";
import { useDebouncedCallback } from "use-debounce";
import { EdgeFilterLens } from "@antv/g6-pc";
import SelectItemCode from "../../../../Context/SelectItemCode";
import SelectNotFound from "../../../../Context/SelectNotFound";

const ModalAddTaskSchedule = (props) => {
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});
  const [customers, setCustomers] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);

  const handleCancelModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
    inputForm.resetFields();
  };

  const onSubmitForm = () => {
    const inputValues = { ...inputForm.getFieldsValue() };
    console.log(inputValues);
    ApiCreateTaskSchedule({
      id: "<string>",
      type: "<string>",
      ngay: 23,
      ngay_th: inputValues.startDate,
      gio_th: "<string>",
      ngay_cuoi_thang: "<string>",
      t1: 1,
      t2: 1,
      t3: 0,
      t4: 1,
      t5: 0,
      t6: 0,
      t7: 0,
      ghi_chu: "<string>",
      status: "<string>",
      ten_cv: "<string>",
      user_id: "<string>",
      event_yn: "String",
      muc_do: 1,
      full_day: 1,
      end_date: inputValues.endDate,
      ma_dvcs: "<string>",
      ma_tuyen: "<string>",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onSubmitFormFail = () => {};

  const getDataEdit = (id) => {
    ApiGetTaskMaster({ id: id, orderby: "id" }).then((res) => {
      inputForm.setFieldValue(`taskName`, res.data[0]?.text);
      inputForm.setFieldValue(`taskType`, res.data[0]?.loai_cv);
      inputForm.setFieldValue(`priority`, res.data[0]?.muc_do);
      inputForm.setFieldValue(`startTime`, dayjs(res.data[0]?.start_date));
      inputForm.setFieldValue(`startDate`, dayjs(res.data[0]?.start_date));
      inputForm.setFieldValue(`endTime`, dayjs(res.data[0]?.end_date));
      inputForm.setFieldValue(`endDate`, dayjs(res.data[0]?.end_date));
      inputForm.setFieldValue(`assignedName`, res.data[0]?.assigned_name);
      inputForm.setFieldValue(`deptName`, res.data[0]?.ma_bp);
      inputForm.setFieldValue(`tourName`, res.data[0]?.ma_tuyen);
      inputForm.setFieldValue(`t1`, res.data[0]?.t1);
      inputForm.setFieldValue(`t2`, res.data[0]?.t2);
      inputForm.setFieldValue(`t3`, res.data[0]?.t3);
      inputForm.setFieldValue(`t4`, res.data[0]?.t4);
      inputForm.setFieldValue(`t5`, res.data[0]?.t5);
      inputForm.setFieldValue(`t6`, res.data[0]?.t6);
      inputForm.setFieldValue(`t7`, res.data[0]?.t7);
    });
  };

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
      case "loai_cv":
        lookupData({ controller: "dmloaicv_lookup", value: value });
        break;

      case "assigned_name":
        lookupData({ controller: "user_lookup", value: value });
        break;

      case "dept":
        lookupData({ controller: "dmbp_lookup", value: value });
        break;

      case "tour":
        lookupData({ controller: "dmtuyen_lookup", value: value });
        break;

      default:
        break;
    }
  }, 600);

  useEffect(() => {}, [JSON.stringify(customers)]);

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
      width={900}
    >
      <div className="default_modal_header">
        <span className="default_header_label">{`${
          props.openModalType == "Edit" ? "Sửa" : "Thêm"
        } mới lịch công việc`}</span>
      </div>
      <Form
        form={inputForm}
        className="default_modal_container"
        onFinishFailed={onSubmitFormFail}
        onFinish={onSubmitForm}
      >
        <div className="default_modal_group_items">
          <Space direction="vertical">
            <span className="default_bold_label">Tên công việc</span>
            <Form.Item
              name="taskName"
              rules={[{ required: true, message: " điền tên công việc" }]}
            >
              <Input placeholder="Nhập tên công việc" />
            </Form.Item>
          </Space>
        </div>

        <div className="default_modal_group_items">
          <Space direction="horizontal">
            <Space direction="vertical" style={{ width: "100%" }}>
              <span className="default_bold_label">Loại công việc</span>
              <Form.Item
                name="taskType"
                rules={[{ required: true, message: " chọn loại công việc" }]}
              >
                <Select
                  showSearch
                  placeholder={` nhập loại công việc`}
                  style={{
                    width: "100%",
                  }}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                  onSearch={(e) => {
                    handleSelectionChange("loai_cv", e);
                  }}
                  onSelect={(e) => {
                    setSelectOptions([]);
                  }}
                >
                  {SelectItemCode(selectOptions)}
                </Select>
              </Form.Item>
            </Space>
            <Space direction="vertical" style={{ width: "100%" }}>
              <span className="default_bold_label">Mức độ ưu tiên</span>
              <Form.Item
                name="priority"
                rules={[{ required: true, message: " mức độ ưu tiên" }]}
              >
                <Select
                  placeholder="Chọn mức độ"
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
                      message: " chọn giờ bắt đầu",
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
                      message: "Hãy chọn ngày bắt đầu",
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
                      message: " chọn ngày kết thúc",
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
                      message: "Hãy chọn ngày kết thúc",
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
              rules={[{ required: true, message: " điền người nhận việc" }]}
            >
              <Select
                showSearch
                placeholder={`Nhập người nhận việc`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("assigned_name", e);
                }}
                onSelect={(e) => {
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <span className="default_bold_label">Bộ phận</span>
            <Form.Item name="deptName">
              <Select
                showSearch
                placeholder={`Nhập bộ phận`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("dept", e);
                }}
                onSelect={(e) => {
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <span className="default_bold_label">Tuyến</span>
            <Form.Item
              name="tourName"
              rules={[{ required: true, message: " nhập tên tuyến" }]}
            >
              <Select
                showSearch
                placeholder={`Nhập tuyến`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("tour", e);
                }}
                onSelect={(e) => {
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
          </Space>
        </div>

        <div
          className="default_modal_group_items default_modal_details"
          style={{ flexDirection: "column", gap: "10px" }}
        >
          <div className="default_table_header">
            <span className="default_bold_label">Lịch</span>
          </div>
          <div className="default_modal_group_items">
            <Space direction="vertical">
              <span className="default_bold_label">Ngày định kỳ</span>
              <Form.Item name="periodicalDay">
                <DatePicker
                  style={{ width: "100%" }}
                  format={"DD/MM/YYYY"}
                  placeholder="Chọn ngày"
                />
              </Form.Item>
            </Space>
            <Space direction="vertical">
              <span className="default_bold_label">Ngày trong tháng</span>
              <Form.Item name="DayInMonth">
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  max={31}
                  placeholder="Ngày"
                ></InputNumber>
              </Form.Item>
            </Space>
            <Space direction="vertical">
              <span className="default_bold_label">Ngày cuối tháng</span>
              <Form.Item
                initialValue={false}
                valuePropName="checked"
                name="lastDayInMonth"
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Space>

            <Space direction="vertical">
              <span className="default_bold_label">Thời gian</span>
              <Form.Item name="timeActive">
                <TimePicker
                  style={{ width: "100%" }}
                  placeholder="Giờ"
                  format={"HH:mm"}
                />
              </Form.Item>
            </Space>
          </div>

          <div
            className="default_modal_group_items"
            style={{
              textAlign: "center",
              background: "#fff",
              borderRadius: "4px",
              padding: "7px",
              fontWeight: "bold",
            }}
          >
            <span>Thứ 2</span>
            <span>Thứ 3</span>
            <span>Thứ 4</span>
            <span>Thứ 5</span>
            <span>Thứ 6</span>
            <span>Thứ 7</span>
            <span>Chủ nhật</span>
          </div>

          <div
            className="default_modal_group_items"
            style={{ textAlign: "center", padding: "0px 7px" }}
          >
            <Form.Item name="t2" initialValue={false} valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name="t3" initialValue={false} valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name="t4" initialValue={false} valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name="t5" initialValue={false} valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name="t6" initialValue={false} valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name="t7" initialValue={false} valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name="t1" initialValue={false} valuePropName="checked">
              <Checkbox></Checkbox>
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

export default ModalAddTaskSchedule;
