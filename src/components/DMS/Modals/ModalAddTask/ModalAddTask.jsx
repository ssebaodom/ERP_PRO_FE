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
  Result,
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
import { ApiGetTaskDetail, ApiGetTaskMaster, ApiWebLookup } from "../../API";
import { useDebouncedCallback } from "use-debounce";
import { EdgeFilterLens } from "@antv/g6-pc";
import TableLocale from "../../../../Context/TableLocale";

// bắt buộc khai báo bên ngoài
const EditableCell = (cell) => {
  return renderCells(cell);
};

const ModalAddTask = (props) => {
  const [detailForm] = Form.useForm();
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});
  const [customerSelectData, setCustomerSelectData] = useState([]);
  const [editingKey, setEditingKey] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleCustomerSelected = useDebouncedCallback((value) => {
    if (value) {
      ApiWebLookup({
        userId: "1",
        controller: "dmkh_lookup",
        pageIndex: 1,
        FilterValueCode: value.trim(),
      }).then((res) => {
        const customerData = res.data.map((item) => {
          return {
            value: item.code,
            label: item.code,
            ten_kh: item.name,
          };
        });
        setCustomers([...customerData]);
      });
    }
  }, 600);

  const handleCancelModal = () => {
    setOpenModal(false);
    props.handleCloseModal();
    inputForm.resetFields();
    setEditingKey([]);
    setSelectedRowKeys([]);
    setInitialValues({});
    setDataSource([]);
    setColumns([]);
  };

  const onSubmitForm = () => {
    const a = { ...inputForm.getFieldsValue(), ...{ detail: dataSource } };
    console.log(a);
  };

  const onSubmitFormFail = () => {};

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

  const scrollToField = (field, fieldName) => {
    const allFields = detailForm.getFieldsValue(true);

    if (!fieldName) {
      const itemFocusName = Object.keys(allFields)
        .filter((item) => item.includes(field))
        .pop();
      document.getElementById(itemFocusName).focus();
    } else {
      document.getElementById(fieldName).focus();
    }
  };

  const onSelect = async (record, selected, selectedRows) => {
    const keys = selectedRows.map((item) => item.key);
    setSelectedRowKeys([...keys]);
    if (selected) {
      await edit(record);
      scrollToField("ma_kh", `${selectedRows.pop().key}_ma_kh`);
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
      case "ma_kh":
        const selectedCustomer = customers.find((item) => {
          return item.value.trim() === Object.values(changedValues)[0].trim();
        });
        detailForm.setFieldValue(
          `${changedKey}ten_kh`,
          selectedCustomer.ten_kh.trim()
        );
        setCustomers([]);
        break;

      default:
        break;
    }
  };

  const getDataEdit = (id) => {
    ApiGetTaskDetail({ id: id, orderby: "id" }).then((res) => {
      const layout = res.reportLayoutModel.map((item) => {
        item.editable = true;
        if (item.field === "ma_kh") {
          return {
            title: item.name,
            dataIndex: item.field,
            type: item.type,
            editable: true,
            key: item.field,
            searchItem: handleCustomerSelected,
            lookupData: customers,
          };
        }

        return {
          title: item.name,
          dataIndex: item.field,
          type: item.type,
          editable: true,
          key: item.field,
        };
      });
      setColumns(layout);

      const data = res.data.map((item, index) => {
        item.key = index;
        return item;
      });

      setDataSource(data);
    });

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
    });
  };

  useEffect(() => {
    if (customers.length > 0) {
      const layout = [...columns];
      layout.map((item) => {
        if (item.dataIndex === "ma_kh") {
          item.lookupData = customers;
        }
      });
      setColumns(layout);
    } else {
      const layout = [...columns];
      layout.map((item) => {
        if (item.dataIndex === "ma_kh") {
          item.lookupData = [];
        }
      });
      setColumns(layout);
    }
  }, [JSON.stringify(customers)]);

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
      width={1000}
    >
      <div className="default_modal_header">
        <span className="default_header_label">Thêm mới công việc</span>
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
              rules={[
                { required: true, message: "Vui lòng điền tên công việc" },
              ]}
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
                rules={[
                  { required: true, message: "Vui lòng chọn loại công việc" },
                ]}
              >
                <Select
                  placeholder="Chọn loại công việc"
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
              <Input placeholder="Nhập người nhận việc" />
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <span className="default_bold_label">Bộ phận</span>
            <Form.Item
              name="deptName"
              rules={[{ required: true, message: "Vui lòng điền bộ phận" }]}
            >
              <Input placeholder="Nhập bộ phận" />
            </Form.Item>
          </Space>
          <Space direction="vertical">
            <span className="default_bold_label">Tuyến</span>
            <Form.Item
              name="tourName"
              rules={[{ required: true, message: "Vui lòng tên tuyến" }]}
            >
              <Input placeholder="Nhập tuyến" />
            </Form.Item>
          </Space>
        </div>

        <div
          className="default_modal_group_items default_modal_details"
          style={{ flexDirection: "column", gap: "10px" }}
        >
          <div className="default_table_header">
            <span className="default_bold_table_label">Chi tiết</span>
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
                        style={{
                          height: "12px",
                          width: "12px",
                          margin: "0 auto",
                        }}
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
                  onClick={async () => {
                    await addRow();
                    scrollToField("ma_kh");
                  }}
                ></Button>
              </Tooltip>
              <Tooltip placement="topLeft" title="Xoá dòng">
                <Button
                  className="default_detail_button"
                  icon={
                    <img
                      style={{
                        height: "12px",
                        width: "12px",
                        margin: "0 auto",
                      }}
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
                      style={{
                        height: "12px",
                        width: "12px",
                        margin: "0 auto",
                      }}
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
                      style={{
                        height: "12px",
                        width: "12px",
                        margin: "0 auto",
                      }}
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
              locale={TableLocale()}
              components={{
                body: {
                  cell: dataSource.length > 0 ? EditableCell : "",
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
              scroll={{
                y: "20vh",
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
