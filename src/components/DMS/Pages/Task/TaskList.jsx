import React from "react";
import "./TaskList.css";
import { Button, Table } from "antd";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import ResizableAntdTable from "resizable-antd-table";
import { useEffect, useState } from "react";
import qs from "qs";
import ModalAddTask from "../../Modals/ModalAddTask/ModalAddTask";
import { ApiGetTaskList } from "../../API";
import renderColumns from "../../../../app/hooks/renderColumns";

const TaskList = () => {
  // initialize #########################################################################
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    keywords: "",
    oderby: "id",
  });
  const [pagination, setPagination] = useState({
    pageindex: 1,
    pageSize: 10,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [openModalAddTaskState, setOpenModalAddTaskState] = useState(false);

  //functions #########################################################################

  const refreshData = () => {
    setPagination({ ...pagination, pageindex: 1, current: 1 });
    if (pagination.pageindex === 1) {
      setLoading(true);
      getdata();
    }
  };

  const getdata = () => {
    ApiGetTaskList({ ...tableParams, ...pagination }).then((res) => {
      let layout = renderColumns(res?.data?.reportLayoutModel);
      setTableColumns(layout);
      const data = res.data.data;
      data.map((item, index) => {
        item.key = item.id;
        return item;
      });
      setData(data);
      setTotalResults(res.data.pagegination.totalpage * pagination.pageSize);
      setLoading(false);
    });
  };

  const handleTableChange = (paginationChanges, filters, sorter) => {
    setPagination({
      ...pagination,
      pageindex: paginationChanges.current,
      current: paginationChanges.current,
    });
    setTableParams({ ...tableParams, ...filters, ...sorter });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      setData([]);
    }
  };

  const openModalAddTask = () => {
    setOpenModalAddTaskState(!openModalAddTaskState);
  };

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

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
        <Table
          columns={tableColumns}
          rowSelection={true}
          rowKey={(record) => record.key}
          dataSource={data}
          rowClassName={"default_table_row"}
          className="default_table"
          pagination={{
            ...pagination,
            total: totalResults,
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
