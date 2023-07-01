import React, { useEffect, useState } from "react";
import "./ModalAddTour.css";
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
  ApiGetTaskDetail,
  ApiGetTaskMaster,
  ApiGetTourDetail,
  ApiGetTourList,
  ApiWebLookup,
} from "../../API";
import { useDebouncedCallback } from "use-debounce";
import { EdgeFilterLens } from "@antv/g6-pc";
import SelectItemCode from "../../../../Context/SelectItemCode";
import SelectNotFound from "../../../../Context/SelectNotFound";
import TableLocale from "../../../../Context/TableLocale";

// bắt buộc khai báo bên ngoài
const EditableCell = (cell) => {
  return renderCells(cell);
};

const ModalAddTour = (props) => {
  const [detailForm] = Form.useForm();
  const [inputForm] = Form.useForm();
  const [isOpenModal, setOpenModal] = useState();
  const [initialValues, setInitialValues] = useState({});
  const [customers, setCustomers] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [editingKey, setEditingKey] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    keywords: "",
    orderby: "ma_tuyen",
    ma_nv: "",
    mo_ta: "",
    ten_nv: "",
    ma_tuyen: "",
    ten_tuyen: "",
    pageindex: 1,
    pagesize: 10,
  });

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
    const a = { ...inputForm.getFieldsValue() };
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
    ApiGetTourDetail({ ma_tuyen: id }).then((res) => {
      const layout = res.detail.map((item) => {
        item.editable = true;
        if (item.Field === "ma_kh") {
          return {
            title: item.Name,
            dataIndex: item.Field,
            type: item.Type,
            editable: true,
            key: item.Field,
            searchItem: handleCustomerSelected,
            lookupData: customers,
          };
        }

        return {
          title: item.Name,
          dataIndex: item.Field,
          type: item.Type,
          editable: true,
          key: item.Field,
        };
      });

      setColumns(layout);

      const data = res.master.map((item, index) => {
        item.key = index;
        return item;
      });

      setDataSource(data);
    });

    ApiGetTourList({ ...tableParams, ma_tuyen: id, orderby: "ma_tuyen" }).then(
      (res) => {
        inputForm.setFieldValue(`tourCode`, res.data[0]?.ma_tuyen);
        inputForm.setFieldValue(`tourName`, res.data[0]?.ten_tuyen);
        inputForm.setFieldValue(`saleEmployeeCode`, res.data[0]?.ma_nv);
        inputForm.setFieldValue(`saleEmployeeName`, res.data[0]?.ten_nvbh);
        inputForm.setFieldValue(`description`, res.data[0]?.mo_ta);
        inputForm.setFieldValue(`unitCode`, res.data[0]?.dvcs);
        inputForm.setFieldValue(`unitName`, res.data[0]?.ten_dvcs);
      }
    );
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
      case "sale_employee":
        lookupData({ controller: "dmnvbh_lookup", value: value });
        break;

      case "unit":
        lookupData({ controller: "dmdvcs_lookup", value: value });
        break;
      default:
        break;
    }
  }, 600);

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
    if (props.openModalState) {
      setInitialValues({});
      getDataEdit(props.currentRecord ? props.currentRecord : 'null');
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
        <span className="default_header_label">Thêm mới tuyến</span>
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
              Mã tuyến
            </span>
            <Form.Item
              name="tourCode"
              rules={[{ required: true, message: "Điền mã tuyến" }]}
            >
              <Input placeholder="Nhập mã tuyến" />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Tên tuyến
            </span>
            <Form.Item
              name="tourName"
              rules={[{ required: true, message: "Điền tên tuyến" }]}
            >
              <Input placeholder="Nhập tên tuyến" />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              NV phụ trách
            </span>
            <Form.Item
              style={{ width: "150px", flex: "none" }}
              name="saleEmployeeCode"
              rules={[{ required: true, message: "Điền nhân viên phụ trách" }]}
            >
              <Select
                showSearch
                placeholder={`Nhân viên`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("sale_employee", e);
                }}
                onSelect={(key, item) => {
                  inputForm.setFieldValue("saleEmployeeName", item.label);
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
            <Form.Item name="saleEmployeeName">
              <Input
                disabled={true}
                className="default_disable_input"
                placeholder="Nhân viên"
              />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Đơn vị cơ sở
            </span>
            <Form.Item
              style={{ width: "150px", flex: "none" }}
              name="unitCode"
              rules={[{ required: true, message: "Điền đơn vị" }]}
            >
              <Select
                showSearch
                placeholder={`Đơn vị`}
                style={{
                  width: "100%",
                }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={SelectNotFound(selectLoading, selectOptions)}
                onSearch={(e) => {
                  handleSelectionChange("unit", e);
                }}
                onSelect={(key, item) => {
                  inputForm.setFieldValue("unitName", item.label);
                  setSelectOptions([]);
                }}
              >
                {SelectItemCode(selectOptions)}
              </Select>
            </Form.Item>
            <Form.Item name="unitName">
              <Input
                disabled={true}
                className="default_disable_input"
                placeholder="Tên đơn vị"
              />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Người tạo
            </span>
            <Form.Item name="createdUser">
              <Input placeholder="Nhập người tạo" />
            </Form.Item>
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Mô tả
            </span>
            <Form.Item name="description">
              <Input placeholder="Nhập mô tả" />
            </Form.Item>
          </div>
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
              components={{
                body: {
                  cell: dataSource.length > 0 ? EditableCell : "",
                },
              }}
              locale={TableLocale()}
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

export default ModalAddTour;
