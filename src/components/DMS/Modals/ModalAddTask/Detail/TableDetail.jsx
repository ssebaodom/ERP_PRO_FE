import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Table, Tooltip } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import addNewRow from "../../../../../app/hooks/addNewRow";
import getChangedTableRow from "../../../../../app/hooks/getChangedTableRow";
import getEditRowsValue from "../../../../../app/hooks/getEditRowsValue";
import RenderCells from "../../../../../app/hooks/renderCells";
import renderEditColumns from "../../../../../app/hooks/renderEditColumns";
import { GetUniqueArray } from "../../../../../app/Options/GetUniqueArray";
import TableLocale from "../../../../../Context/TableLocale";
import checked__icon from "../../../../../Icons/checked__icon.svg";
import copy__icon from "../../../../../Icons/copy__icon.svg";
import delete__icon from "../../../../../Icons/delete__icon.svg";
import lock__icon from "../../../../../Icons/lock__icon.svg";
import { setTaskDetail } from "../../../Store/Sagas/Sagas";

const EditableCell = (cell, form) => {
  return RenderCells(cell, form);
};

const TableDetail = ({ form, data, Tablecolumns }, ref) => {
  const [editingKey, setEditingKey] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  useImperativeHandle(ref, () => ({
    getData: async () => {
      await BtnSave("GetData");
      setIsChecked(true);
    },
  }));

  const BtnSave = async () => {
    const rawData = [...dataSource];
    const newData = [];
    const rows = await form.validateFields();
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

  const addRow = async () => {
    const newRow = addNewRow(columns);
    setDataSource([...dataSource, newRow]);
    edit(newRow);
    setSelectedRowKeys([...selectedRowKeys, newRow.key]);
  };

  const edit = (record) => {
    const inputRecord = getEditRowsValue(record);
    form.setFieldsValue({
      ...inputRecord,
    });
    setEditingKey([record.key, ...editingKey]);
  };

  const scrollToField = (field, fieldName) => {
    const allFields = form.getFieldsValue(true);

    if (!fieldName) {
      const itemFocusName = Object.keys(allFields)
        .filter((item) => item.includes(field))
        .pop();
      document.getElementById(itemFocusName).focus();
    } else {
      document.getElementById(fieldName).focus();
    }
  };

  const deleteRow = async () => {
    const newData = await dataSource.filter((item) => {
      return !selectedRowKeys.includes(item.key);
    });
    setDataSource([...newData]);
    setSelectedRowKeys([]);
    setEditingKey([]);
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
        break;

      default:
        break;
    }
  };

  const cancel = (record) => {
    const newEditingKey = editingKey.filter((key) => key !== record);
    setEditingKey(newEditingKey);
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

  ////////////////////////Effects////////////////////

  useEffect(() => {
    if (Tablecolumns) setColumns(Tablecolumns);
  }, [Tablecolumns]);

  useEffect(() => {
    if (data) setDataSource(data);
  }, [data]);

  useEffect(() => {
    if (isChecked) {
      setTaskDetail([...GetUniqueArray(dataSource, "ma_kh")]);
      setIsChecked(false);
    }
  }, [isChecked]);

  return (
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
        form={form}
        component={false}
        onValuesChange={handleChangedValues}
        ref={ref}
      >
        <Table
          rowSelection={rowSelection}
          components={{
            body: {
              cell: (cells) => {
                if (dataSource.length > 0) {
                  return EditableCell(cells, form);
                }
                return <></>;
              },
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
  );
};

export default forwardRef(TableDetail);
