import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Table, Tooltip } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  getAllValueByColumn,
  getAllValueByRow,
} from "../../../../../app/Functions/getTableValue";
import addNewRow from "../../../../../app/hooks/addNewRow";
import getChangedTableRow from "../../../../../app/hooks/getChangedTableRow";
import getEditRowsValue from "../../../../../app/hooks/getEditRowsValue";
import RenderEditCell from "../../../../../app/hooks/RenderEditCell";
import renderEditColumnsV2 from "../../../../../app/hooks/renderEditColumnsV2";
import { FilterNullArray } from "../../../../../app/Options/GetUniqueArray";
import TableLocale from "../../../../../Context/TableLocale";
import checked__icon from "../../../../../Icons/checked__icon.svg";
import copy__icon from "../../../../../Icons/copy__icon.svg";
import delete__icon from "../../../../../Icons/delete__icon.svg";
import lock__icon from "../../../../../Icons/lock__icon.svg";

import { setFinalDetails } from "../../../Store/Sagas/Sagas";

const EditableCell = (cell, form, addRow) => {
  return RenderEditCell(cell, form, addRow);
};

const TableDetail = ({ masterForm, data, Tablecolumns, Action }, ref) => {
  const [detailForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  useImperativeHandle(ref, () => ({
    getData: async () => {
      await BtnSave();
      setIsChecked(true);
    },
  }));

  ////////////////////////////////////////btntable////////////////////////////////////////
  const BtnSave = async () => {
    const rawData = [...dataSource];
    const newData = [];
    const rows = await detailForm.validateFields();
    await editingKey.map(async (key) => {
      const changedData = await getChangedTableRow(key, rows, rawData);
      newData.push(changedData);
    });

    await newData.map((item) => {
      const index = rawData.findIndex((record) => item?.key === record?.key);
      if (index > -1) {
        rawData.splice(index, 1, item);
      }
    });

    setDataSource(FilterNullArray(rawData, "ma_vt"));
    setEditingKey([]);
    setSelectedRowKeys([]);
  };

  const addRow = async () => {
    const newRow = addNewRow(columns);
    setDataSource([...dataSource, newRow]);
    const inputRecord = getEditRowsValue(newRow);
    detailForm.setFieldsValue({
      ...inputRecord,
    });
    setSelectedRowKeys([...selectedRowKeys, newRow.key]);
    setEditingKey([...editingKey, newRow.key]);
  };

  const deleteRow = async () => {
    const newData = await dataSource.filter((item) => {
      return !selectedRowKeys.includes(item.key);
    });
    setDataSource([...newData]);
    setSelectedRowKeys([]);
    setEditingKey([]);
  };

  const addnew = async () => {
    await addRow();
    scrollToField("ma_vt");
  };

  ///////////////////////////////////////////////////////////////////////////////////////

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

  const handleChangedValues = async (changedValues, allValues) => {
    var columnsValues = [];
    var rowValues = {};
    const keys = Object.keys(allValues);
    const changedObject = Object.keys(changedValues)[0];

    const changedKey = changedObject.substring(0, changedObject.indexOf("_"));
    const changedColumn = changedObject.substring(
      changedObject.indexOf("_") + 1,
      changedObject.length
    );
    switch (changedColumn) {
      case "ma_vt":
        columnsValues = await getAllValueByColumn(changedColumn, allValues);
        break;
      case "so_luong":
        rowValues = await getAllValueByRow(changedKey, allValues);

        await detailForm.setFieldValue(
          `${changedKey}_tien_nt2`,
          rowValues?.so_luong * rowValues?.gia_nt2
        );

        masterForm.setFieldValue(
          "t_so_luong",
          await getAllValueByColumn(changedColumn, allValues).reduce(
            (sum, x) => sum + x
          )
        );

        masterForm.setFieldValue(
          "t_tt_nt",
          await getAllValueByColumn(
            "tien_nt2",
            detailForm.getFieldsValue()
          ).reduce((sum, x) => sum + x)
        );
        break;
      case "gia_nt2":
        rowValues = await getAllValueByRow(changedKey, allValues);

        await detailForm.setFieldValue(
          `${changedKey}_tien_nt2`,
          rowValues?.so_luong * rowValues?.gia_nt2
        );

        masterForm.setFieldValue(
          "t_tt_nt",
          await getAllValueByColumn(
            "tien_nt2",
            detailForm.getFieldsValue()
          ).reduce((sum, x) => sum + x)
        );

        break;
      default:
        break;
    }
  };

  const onSelect = async (record, selected, selectedRows) => {
    const keys = selectedRows.map((item) => item?.key);
    setSelectedRowKeys([...keys]);
  };

  const onSelectAll = (selected, selectedRows) => {
    if (selected) {
      const selectedKeys = selectedRows.map((record) => {
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
    if (Tablecolumns) {
      const layout = Tablecolumns.map((item) => {
        return {
          title: item.name,
          dataIndex: item.field,
          type: item.type,
          editable: true,
          key: item.field,
        };
      });

      setColumns(layout);
    }
  }, [Tablecolumns]);

  useEffect(() => {
    if (data) {
      var initData = [...data];
      initData = initData.map((item, index) => ({
        ...item,
        key: index,
      }));
      setDataSource(initData);
    }
  }, [data]);

  useEffect(() => {
    if (isChecked) {
      setFinalDetails([...FilterNullArray(dataSource, "ma_vt")]);
      setIsChecked(false);
    }
  }, [isChecked]);

  return (
    <div
      className="default_modal_group_items default_modal_details"
      style={{ flexDirection: "column", gap: "10px", height: "100%" }}
    >
      <div className="default_table_header" style={{ flex: 0 }}>
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
                scrollToField("ma_vt");
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
        ref={ref}
        className="h-full"
      >
        <Table
          rowSelection={rowSelection}
          components={{
            body: {
              cell: (cells) => {
                if (dataSource.length > 0) {
                  return EditableCell(cells, detailForm, addnew);
                }
                return <></>;
              },
            },
          }}
          locale={TableLocale()}
          columns={renderEditColumnsV2(columns, Action)}
          dataSource={dataSource}
          rowClassName="default_detail_table_row"
          className="default_detail_table sticky h-full"
          pagination={{
            position: ["none"],
            defaultPageSize: 1000,
          }}
        />
      </Form>
    </div>
  );
};

export default forwardRef(TableDetail);
