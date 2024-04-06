import { uuidv4 } from "@antv/xflow-core";
import { Button, Form, Image, Segmented, Select } from "antd";
import React, { useCallback, useState } from "react";
import { Column } from "react-base-table";
import RenderPerformanceTableCell from "../../../../../app/hooks/RenderPerformanceTableCell";
import PerformanceTable from "../../../../ReuseComponents/PerformanceTable/PerformanceTable";
import RetailPaidInfo from "../RetailPaidInfo/RetailPaidInfo";

const columns = [
  {
    key: "image",
    title: "Ảnh",
    dataKey: "image",
    width: 60,
    align: Column.Alignment.CENTER,
    resizable: false,
    frozen: Column.FrozenDirection.LEFT,
    cellRenderer: ({ cellData }) => (
      <Image title="" style={{ height: 45 }} src={cellData} alt="SSE"></Image>
    ),
  },

  {
    key: "ten_vt",
    title: "Tên vật tư",
    dataKey: "ten_vt",
    className: "flex-1",
    headerClassName: "flex-1",
    width: 100,
    resizable: false,
    sortable: false,
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "ma_vt",
    title: "Mã vật tư",
    dataKey: "ma_vt",
    width: 0,
    hidden: true,
    resizable: false,
    sortable: false,
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "ma_kho",
    title: "Kho",
    dataKey: "ma_kho",
    width: 120,
    resizable: false,
    sortable: false,
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "dvt",
    title: "Đơn vị tính",
    dataKey: "dvt",
    width: 100,
    resizable: false,
    sortable: false,
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "so_luong",
    title: "Số lượng",
    dataKey: "so_luong",
    width: 100,
    resizable: false,
    sortable: false,
    editable: true,
    required: true,
    type: "Numeric",
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "don_gia",
    title: "Đơn giá",
    dataKey: "don_gia",
    width: 100,
    resizable: false,
    sortable: false,
    editable: true,
    required: true,
    type: "Numeric",
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },
];

const RetailOrderInfo = () => {
  const [itemForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState([]);

  const handleAddRowData = () => {
    console.log(itemForm.getFieldsValue());

    setData([
      ...data,
      {
        id: uuidv4(),
        ma_vt: "VT004",
        ten_vt: "New item1",
        image:
          "https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/characters/hu_tao/image.png?strip=all&quality=100",
        description: "Đại học",
        ma_kho: "GG@gmail.com",
        dvt: "Cái",
        so_luong: 999,
        don_gia: 90000,
      },
    ]);
  };

  const handleRemoveRowData = () => {
    const filteredData = [...data].filter(
      (item) => !selectedRowkeys.includes(item?.id)
    );

    setData(filteredData);
  };

  const handleSelectedRowKeyChange = useCallback((keys) => {
    setSelectedRowkeys(keys);
  }, []);

  const handleChange = (e, a, f) => {
    console.log(e);
    console.log(a);
    console.log(f);
  };

  return (
    <div className="h-full min-h-0 flex gap-1">
      <div className="h-full min-h-0 w-full min-w-0 flex flex-column gap-1">
        <div className="h-full min-h-0 overflow-hidden border-round-md">
          <div
            className="w-full p-2 flex gap-5 align-items-center"
            style={{ background: "white" }}
          >
            <Select
              showSearch
              placeholder="Tìm kiếm..."
              style={{
                width: 600,
              }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onChange={handleChange}
              optionLabelProp="value"
              options={[
                {
                  label: <span>manager</span>,
                  title: "manager",
                  options: [
                    {
                      label: <span>Jack</span>,
                      value: "Jack",
                    },
                    {
                      label: <span>Lucy</span>,
                      value: "Lucy",
                    },
                  ],
                },
                {
                  label: <span>engineer</span>,
                  title: "engineer",
                  options: [
                    {
                      label: <span>Chloe</span>,
                      value: "Chloe",
                    },
                    {
                      label: <span>Lucas</span>,
                      value: "Lucas",
                    },
                  ],
                },
              ]}
            />
            <div className="Retail_order_tabs_container justify-content-end align-items-center w-full min-w-0 flex gap-2">
              <Segmented
                options={[
                  "Đơn hàng 1",
                  "Đơn hàng 2",
                  "Đơn hàng 3",
                  "Đơn hàng 4",
                ]}
                onChange={(value) => {
                  console.log(value); // string
                }}
              />
              <Button shape="circle">
                <i className="pi pi-plus sub_text_color"></i>
              </Button>
            </div>
          </div>
          <Form form={itemForm} component={false} initialValues={{}}>
            <PerformanceTable
              selectable
              columns={columns}
              data={data}
              onSelectedRowKeyChange={handleSelectedRowKeyChange}
            />
          </Form>
        </div>
        <div
          className="border-round-md flex gap-2 p-2 "
          style={{
            height: "3.15rem",
            flexShrink: 0,
            background: "aliceblue",
          }}
        >
          <Button className="default_button" onClick={handleAddRowData}>
            <i
              className="pi pi-pencil warning_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>

          <Button
            className="default_button"
            danger
            onClick={handleRemoveRowData}
          >
            <i className="pi pi-trash" style={{ fontWeight: "bold" }}></i>
          </Button>

          <Button className="default_button">
            <i
              className="pi pi-print sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>

          <Button className="default_button">
            <i
              className="pi pi-angle-left sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>

          <Button className="default_button">
            <i
              className="pi pi-angle-right sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>
        </div>
      </div>
      <RetailPaidInfo itemForm={itemForm} />
    </div>
  );
};

export default RetailOrderInfo;
