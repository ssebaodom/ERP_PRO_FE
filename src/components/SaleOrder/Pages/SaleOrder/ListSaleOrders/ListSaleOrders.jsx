import { Button, Col, Input, Pagination, Table } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableLocale from "../../../../../Context/TableLocale";
import {
  setCurrentSaleOrder,
  setSaleOrderCurrentStep,
  setSaleOrderLoading,
} from "../../../Store/Sagas/SaleOrderActions";
import { getSaleOrderInfo } from "../../../Store/Selector/Selector";

const ListSaleOrders = () => {
  const [selectedRowkeys, setselectedRowkeys] = useState([]);
  const curentData = useSelector(getSaleOrderInfo);

  const columns = [
    {
      dataIndex: "title",
      title: "Name",
      width: "10px",
    },
    {
      dataIndex: "description",
      title: "Description",
    },
  ];

  const dataSource = [
    {
      key: 1,
      title: `content 1`,
      description: `Công ty TNHH Trùng Khánh`,
    },
    {
      key: 2,
      title: `content 2`,
      description: `description of content 2`,
    },
    {
      key: 3,
      title: `content 3`,
      description: `description of content 3`,
    },
    {
      key: 4,
      title: `content 4`,
      description: `description of content 4`,
    },
    {
      key: 5,
      title: `content 4`,
      description: `description of content 4`,
    },
    {
      key: 6,
      title: `content 4`,
      description: `description of content 4`,
    },
    {
      key: 7,
      title: `content 4`,
      description: `description of content 4`,
    },
    {
      key: 8,
      title: `content 4`,
      description: `description of content 4`,
    },
    {
      key: 9,
      title: `content 4`,
      description: `description of content 4`,
    },
    {
      key: 10,
      title: `content 4`,
      description: `description of content 4`,
    },
  ];

  const handleRowSelect = (record) => {
    setselectedRowkeys([record?.key]);
  };

  useEffect(() => {
    if (selectedRowkeys.length > 0) {
      setSaleOrderLoading(true);
      setSaleOrderCurrentStep(0);
      setCurrentSaleOrder(_.first(selectedRowkeys));
      let timer = setTimeout(() => setSaleOrderLoading(false), 1000);
    }
  }, [JSON.stringify(selectedRowkeys)]);

  return (
    <Col span={5} className="flex flex-column h-full min-h-0 gap-3">
      <div
        className="w-full h-full min-h-0 p-2 border-round-lg flex flex-column gap-2"
        style={{ background: "white" }}
      >
        <div className="flex gap-2">
          <Input placeholder="Tìm kiếm..." />
          <Button className="default_button">
            <i
              className="pi pi-filter sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>
        </div>
        <div className="h-full overflow-auto">
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: () => handleRowSelect(record),
              };
            }}
            className="table_hide_selection"
            rowClassName={"cursor-pointer border-round-lg"}
            columns={columns}
            dataSource={dataSource}
            size="small"
            locale={TableLocale()}
            pagination={{
              position: ["none"],
            }}
            rowSelection={{
              selectedRowKeys: selectedRowkeys,
              type: "radio",
              columnWidth: 0,
              renderCell: () => "",
            }}
          />
        </div>
      </div>
      <div
        className="p-2 relative text-center border-round-lg"
        style={{ background: "white" }}
      >
        <Pagination
          defaultCurrent={1}
          total={100}
          simple
          showSizeChanger={false}
        />
      </div>
    </Col>
  );
};

export default ListSaleOrders;
