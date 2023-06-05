import React, { useContext, useEffect, useState } from "react";
import router from "../../../../router/routes";
import InvoiceOptions from "../../Modals/InvoiceIOptions/InvoiceOptions";
import qs from "qs";
import { Button, Table } from "antd";
import { getLoading } from "../../../../store/selectors/Selectors";
import ResizableAntdTable from "resizable-antd-table";

const HDBH = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render: (name) => `${name.first} ${name.last}`,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      filters: [
        {
          text: "Male",
          value: "male",
        },
        {
          text: "Female",
          value: "female",
        },
      ],
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
  ];

  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });

  const fetchData = () => {
    setLoading(true);
    fetch(
      `https://randomuser.me/api?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then(({ results }) => {
        setData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 200,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <div className="page_2_side_default">
      <InvoiceOptions
        selectedKey={router.state.location.pathname.slice(1, 99)}
      />
      <div className="page_2_side_default_right">
        <div className="page_2_side_default_right_tools">
          <Button style={{ width: "100px" }}>Thêm</Button>
          <Button style={{ width: "100px" }}>Sửa</Button>
          <Button style={{ width: "100px" }} danger>
            Xoá
          </Button>
          <Button style={{ width: "100px" }}>Xem</Button>
        </div>
        <div className="page_2_side_default_right_details">
          <ResizableAntdTable
            columns={columns}
            rowKey={(record) => record.login.uuid}
            dataSource={data}
            rowClassName={"default_table_row"}
            className="default_table"
            pagination={{
              ...tableParams.pagination,
              position: ["bottomCenter"],
              className: "default_pagination_bar",
            }}
            sticky={true}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HDBH;
