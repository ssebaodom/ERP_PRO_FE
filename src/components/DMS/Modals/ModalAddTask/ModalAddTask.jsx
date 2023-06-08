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
  Tooltip,
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
import { ApiGetTaskDetail, ApiGetTaskMaster } from "../../API";
const ModalAddTask = (props) => {
  const [detailForm] = Form.useForm();
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({
    taskType: "lucy",
    priority: "low",
    tourName: "abc",
  });
  const [editingKey, setEditingKey] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleCustomerSelected = (value)=>{
    console.log(value)
    ApiGetTaskMaster({id:21,orderby:'id'}).then(res=>{
      console.log(res)
    })
    ApiGetTaskDetail({id:21,orderby:'id'}).then(res=>{
      console.log(res)
    })
  }


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
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      type: "Text",
      editable: true,
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      type: "Numeric",
      editable: true,
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      type: "Text",
      editable: true,
      key: "address",
    },
    {
      title: "Customer",
      dataIndex: "Customer",
      type: "AutoComplete",
      lookupData: [],
      searchItem:handleCustomerSelected,
      editable: true,
      key: "Customer",
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
    setEditingKey([]);
    setSelectedRowKeys([]);
  };

  const onSubmitForm = () => {
    const a = { ...inputForm.getFieldsValue(), ...{ detail: dataSource } };
    console.log(a);
  };

  const onSubmitFormFail = () => {};

  const EditableCell = (cell) => {
    return renderCells(cell);
  };

  const edit = (record) => {
    const inputRecord = getEditRowsValue(record);
    detailForm.setFieldsValue({
      ...inputRecord,
    });
    setEditingKey([record.key, ...editingKey]);
  };

  const cancel = (record) => {
    const newEditingKey = editingKey.filter((key) => key !== record);
    setEditingKey(newEditingKey);
  };

  const BtnSave = async () => {
    const rawData = [...dataSource];
    const newData = [];
    const rows = await detailForm.validateFields();
    await editingKey.map(async (key) => {
      const changedData = await getChangedTableRow(key, rows, rawData);
      newData.push(changedData);
    });

    await newData.map((item) => {
      const index = rawData.findIndex((record) => item.key === record.key);
      if (index > -1) {
        rawData.splice(index, 1, item);
      }
    });

    setDataSource(rawData);
    setEditingKey([]);
    setSelectedRowKeys([]);
  };

  const addRow = () => {
    const newRow = addNewRow(columns);
    setDataSource([...dataSource, newRow]);
    edit(newRow);
    setSelectedRowKeys([...selectedRowKeys, newRow.key]);
  };

  const deleteRow = async () => {
    const newData = await dataSource.filter((item) => {
      return !selectedRowKeys.includes(item.key);
    });
    setDataSource([...newData]);
    setSelectedRowKeys([]);
    setEditingKey([]);
  };

  const onSelect = (record, selected, selectedRows) => {
    const keys = selectedRows.map((item) => item.key);
    setSelectedRowKeys([...keys]);
    if (selected) {
      edit(record);
    } else cancel(record.key);
  };

  const onSelectAll = (selected, selectedRows) => {
    if (selected) {
      const selectedKeys = selectedRows.map((record) => {
        edit(record);
        return record.key;
      });
      setEditingKey([...selectedKeys]);
      setSelectedRowKeys([...selectedKeys]);
    } else {
      setEditingKey([]);
      setSelectedRowKeys([]);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onSelectAll: onSelectAll,
    onSelect: onSelect,
  };

  const handleChangedValues = (changedValues, allValues) => {
    console.log(1)
    const keys = Object.keys(allValues);
    const changedObject = Object.keys(changedValues)[0];
    const changedKey = changedObject.substring(
      0,
      changedObject.indexOf("_") + 1
    );
    const changedColumn = changedObject.substring(
      changedObject.indexOf("_") + 1,
      changedObject.length
    );
    switch (changedColumn) {
      case "name":
        detailForm.setFieldValue(`${changedKey}age`, 1);
        break;

      default:
        break;
    }
  };

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
          <div className="default_table_header">
            <span className="default_bold_label">Chi tiết</span>
            <div
              className="default_modal_group_items"
              style={{
                flexDirection: "roo",
                gap: "10px",
                alignItems: "flex-end",
                flex: "none",
              }}
            >
              {editingKey.length > 0 ? (
                <Tooltip placement="topLeft" title="Nhận">
                  <Button
                    className="default_detail_button"
                    icon={
                      <img
                        style={{ height: "12px", width: "12px" }}
                        src={checked__icon}
                        alt=""
                      />
                    }
                    onClick={() => {
                      BtnSave();
                    }}
                  ></Button>
                </Tooltip>
              ) : (
                ""
              )}

              <Tooltip placement="topLeft" title="Thêm dòng">
                <Button
                  className="default_primary_detail_button"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    addRow();
                  }}
                ></Button>
              </Tooltip>
              <Tooltip placement="topLeft" title="Xoá dòng">
                <Button
                  className="default_detail_button"
                  icon={
                    <img
                      style={{ height: "18px", width: "12px" }}
                      src={delete__icon}
                      alt=""
                    />
                  }
                  onClick={() => {
                    deleteRow();
                  }}
                ></Button>
              </Tooltip>
              <Tooltip placement="topLeft" title="Nhân dòng">
                <Button
                  className="default_detail_button"
                  icon={
                    <img
                      style={{ height: "18px", width: "12px" }}
                      src={copy__icon}
                      alt=""
                    />
                  }
                  onClick={() => {
                    addRow();
                  }}
                ></Button>
              </Tooltip>
              <Tooltip placement="topLeft" title="Khoá dòng">
                <Button
                  className="default_detail_button"
                  icon={
                    <img
                      style={{ height: "18px", width: "12px" }}
                      src={lock__icon}
                      alt=""
                    />
                  }
                  onClick={() => {
                    addRow();
                  }}
                ></Button>
              </Tooltip>
            </div>
          </div>

          <Form
            form={detailForm}
            component={false}
            onValuesChange={handleChangedValues}
          >
            <Table
              rowSelection={rowSelection}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              columns={renderEditColumns(columns, editingKey)}
              dataSource={dataSource}
              rowClassName="default_detail_table_row"
              className="default_detail_table"
              pagination={{
                position: ["none"],
                defaultPageSize: 1000,
              }}
            />
          </Form>
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
