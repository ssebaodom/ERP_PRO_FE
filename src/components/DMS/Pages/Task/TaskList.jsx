import React from "react";
import "./TaskList.css";
import { Button } from "antd";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import ResizableAntdTable from "resizable-antd-table";
import { useEffect, useState } from "react";
import qs from "qs";
import ModalAddTask from "../../Modals/ModalAddTask/ModalAddTask";

const TaskList = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [openModalAddTaskState, setOpenModalAddTaskState] = useState(false);

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

  const refreshData = () => {
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });
  };

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

  const openModalAddTask = () => {
    setOpenModalAddTaskState(!openModalAddTaskState);
  };

  return (
    <div className="task__list page_default">
      <div className="task__list__header__bar">
        <span className="default_header_label">
          Danh sách công việc <span>(30)</span>
        </span>
        <div className="task__list__header__tools">
          <Button
            className="default_button"
            onClick={openModalAddTask}
            icon={<PlusOutlined className="sub_text_color" />}
          >
            <span style={{ fontWeight: "bold" }}>Thêm mới</span>
          </Button>
          <Button className="default_button" onClick={refreshData}>
            <SyncOutlined
              style={{ fontSize: "20px", width: "20px", height: "20px" }}
              className="sub_text_color"
            />
          </Button>
        </div>
      </div>
      <div className="task__list__data_container">
        <ResizableAntdTable
          columns={columns}
          rowKey={(record) => record.login.uuid}
          dataSource={data}
          rowClassName={"default_table_row"}
          className="default_table"
          pagination={{
            ...tableParams.pagination,
            position: ["bottomCenter"],
            showSizeChanger: false,
            className: "default_pagination_bar",
          }}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
      <ModalAddTask
        openModalState={openModalAddTaskState}
        handleCloseModal={setOpenModalAddTaskState}
      />
    </div>
  );
};

export default TaskList;
