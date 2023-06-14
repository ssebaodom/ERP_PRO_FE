import React, { useEffect } from "react";

import { Form, Table, Button, Select, Modal } from "antd";
import { useState } from "react";

import renderCells from "../../../app/hooks/renderCells";
import renderColumns from "../../../app/hooks/renderColumns";
import renderEditColumns from "../../../app/hooks/renderEditColumns";
import getChangedTableRow from "../../../app/hooks/getChangedTableRow";
import getEditRowsValue from "../../../app/hooks/getEditRowsValue";
import { useDebouncedCallback } from "use-debounce";
import { ApiGetTaskDetail } from "../API";
import { v4 } from "uuid";

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
  const [columns, setColumns] = useState([]);

  const [data2, setData2] = useState([]);
  const [value, setValue] = useState();
  const [isOpenModal, setOpenModal] = useState(false);

  const handleCustomerSelected = useDebouncedCallback((value) => {
    ApiGetTaskDetail({ id: 21, orderby: "id" }).then((res) => {
      const a = res.data.map((item) => {
        return {
          value: item.ma_kh,
          label: item.ten_kh,
        };
      });
      console.log(a);
      setData2([...a]);
    });
  }, 600);

  const layout = [
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
      type: "AutoComplete",
      searchItem: handleCustomerSelected,
      lookupData: data2,
    },
  ];

  // const getDataEdit = (id) => {
  //   ApiGetTaskDetail({ id: id, orderby: "id" }).then((res) => {
  //     // const layout = res.reportLayoutModel.map((item) => {
  //     //   item.editable = true;
  //     //   if (item.field === "ma_kh") {
  //     //     return {
  //     //       title: item.name,
  //     //       dataIndex: item.field,
  //     //       type: item.type,
  //     //       editable: true,
  //     //       key: item.field,
  //     //       searchItem: handleCustomerSelected,
  //     //       lookupData: data2,
  //     //     };
  //     //   }
  //     //   return {
  //     //     title: item.name,
  //     //     dataIndex: item.field,
  //     //     type: item.type,
  //     //     editable: true,
  //     //     key: item.field,
  //     //   };
  //     // });
  //     // const data = res.data.map((item, index) => {
  //     //   item.key = index;
  //     //   return item;
  //     // });
  //     // setData(data);
  //   });
  // };

  // useEffect(() => {
  //   setColumns(layout);
  // }, [isOpenModal]);

  const edit = (record) => {
    const inputRecord = getEditRowsValue(record);
    form.setFieldsValue({
      ...inputRecord,
    });
    setEditingKey([record.key, ...editingKey]);
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

  const [customerSelectData, setCustomerSelectData] = useState([]);

  const mergedColumns = renderEditColumns(layout, editingKey);

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

  const handleSearch = (newValue) => {
    handleCustomerSelected(1);
  };
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleCancelModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div>
      {/* <Select
        showSearch
        value={value}
        placeholder="{props.placeholder}"
        style={{ width: "200px" }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={data2}
      /> */}

      <Button onClick={handleOpenModal}>Click me</Button>

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
        <Form>
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
        </Form>
      </Modal>
    </div>
  );
};
export default App;
