import React from "react";

import { Form, Table, Button } from "antd";
import { useState } from "react";

import renderCells from "../../../app/hooks/renderCells";
import renderColumns from "../../../app/hooks/renderColumns";
import renderEditColumns from "../../../app/hooks/renderEditColumns";
import getChangedTableRow from "../../../app/hooks/getChangedTableRow";
import getEditRowsValue from "../../../app/hooks/getEditRowsValue";

const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableCell = (cell) => {
  return renderCells(cell);
};

const App = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const edit = (record) => {
    const inputRecord = getEditRowsValue(record);
    form.setFieldsValue({
      ...inputRecord,
    });
    setEditingKey([...record.key, ...editingKey]);
  };
  const cancel = (record) => {
    const newEditingKey = editingKey.filter((key) => key !== record);
    setEditingKey(newEditingKey);
  };

  const BtnSave = async () => {
    const rawData = [...data];
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

    setData(rawData);
    setEditingKey([]);
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true,
      type: "Text",
    },
    {
      title: "age",
      dataIndex: "age",
      width: "15%",
      editable: true,
      type: "Numeric",
    },
    {
      title: "address",
      dataIndex: "address",
      width: "40%",
      editable: true,
      type: "Text",
    },
  ];
  const mergedColumns = renderEditColumns(columns, editingKey);

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

  return (
    <div>
      <Button onClick={BtnSave}>Click me</Button>
      <Form form={form} component={false}>
        <Table
          rowSelection={rowSelection}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};
export default App;
