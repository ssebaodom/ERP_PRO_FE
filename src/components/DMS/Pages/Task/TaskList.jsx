import { Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import OperationColumn from "../../../../app/hooks/operationColumn";
import renderColumns from "../../../../app/hooks/renderColumns";
import ConfirmDialog from "../../../../Context/ConfirmDialog";
import TableLocale from "../../../../Context/TableLocale";
import { formStatus } from "../../../../utils/constants";
import HeaderTableBar from "../../../ReuseComponents/HeaderTableBar";
import { ApiGetTaskList } from "../../API";
import ModalAddTask from "../../Modals/ModalAddTask/ModalAddTask";
import "./TaskList.css";

const TaskList = () => {
  // initialize #########################################################################
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    keywords: "",
    orderby: "id",
  });
  const [pagination, setPagination] = useState({
    pageindex: 1,
    pageSize: 10,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [openModalType, setOpenModalType] = useState("Add");
  const [currentRecord, setCurrentRecord] = useState(null);
  const [openModalAddTaskState, setOpenModalAddTaskState] = useState(false);
  const [isOpenModalDeleteTask, setIsOpenModalDeleteTask] = useState(false);
  const [currentItemSelected, setCurrentItemSelected] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  //functions #########################################################################

  const refreshData = useCallback(() => {
    setPagination({ ...pagination, pageindex: 1, current: 1 });
    if (pagination.pageindex === 1) {
      setLoading(true);
    }
  }, [pagination]);

  const handleEdit = (record) => {
    setCurrentRecord(record.id);
    setOpenModalAddTaskState(true);
    setOpenModalType(formStatus.EDIT);
  };

  const handleOpenDeleteDialog = (record) => {
    setIsOpenModalDeleteTask(true);
    setCurrentItemSelected(record ? record : {});
  };

  const handleCloseDeleteDialog = () => {
    setIsOpenModalDeleteTask(false);
    setCurrentItemSelected({});
  };

  const handleDelete = (keys) => {
    console.log("Gọi API delete ở đây", currentItemSelected);
    handleCloseDeleteDialog();
    refreshData();
  };

  const getdata = () => {
    ApiGetTaskList({
      ...tableParams,
      pageindex: pagination.pageindex,
      pageSize: pagination.pageSize,
    }).then((res) => {
      let layout = renderColumns(res?.data?.reportLayoutModel);
      layout.push({
        title: "Chức năng",
        dataIndex: "",
        editable: false,
        dataType: "Operation",
        align: "center",
        fixed: "right",
        render: (_, record) => {
          return (
            <OperationColumn
              record={record}
              editFunction={handleEdit}
              deleteFunction={handleOpenDeleteDialog}
            />
          );
        },
      });
      setTableColumns(layout);
      const data = res.data.data;
      data.map((item, index) => {
        item.key = item.id;
        return item;
      });
      setData(data);
      setTotalResults(res.data.pagegination.totalRecord);
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
    setSelectedRowKeys([]);

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      setData([]);
    }
  };

  const openModalAddTask = () => {
    setOpenModalAddTaskState(!openModalAddTaskState);
    setOpenModalType(formStatus.ADD);
    setCurrentRecord(0);
  };

  const onSelect = async (record, selected, selectedRows) => {
    const keys = selectedRows.map((item) => item.key);
    setSelectedRowKeys([...keys]);
  };

  const onSelectAll = (selected, selectedRows) => {
    if (selected) {
      const selectedKeys = selectedRows.map((record) => {
        return record.key;
      });
      setSelectedRowKeys([...selectedKeys]);
    } else {
      setSelectedRowKeys([]);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onSelectAll: onSelectAll,
    onSelect: onSelect,
  };

  const changePaginations = (item) => {
    if (pagination.pageSize !== item) {
      setData([]);
    }
    setPagination({ ...pagination, pageSize: item });
  };

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), pagination]);

  return (
    <div className="default_list_layout page_default">
      <HeaderTableBar
        name={"công việc"}
        title={"Danh sách công việc "}
        changePaginations={changePaginations}
        totalResults={totalResults}
        addEvent={openModalAddTask}
        refreshEvent={refreshData}
        deleteItems={{
          delete: handleOpenDeleteDialog,
          count: selectedRowKeys.length,
        }}
      />

      <div className="h-full min-h-0">
        <Table
          columns={tableColumns}
          rowSelection={rowSelection}
          rowKey={(record) => record.key}
          dataSource={data}
          rowClassName={"default_table_row"}
          className="default_table"
          locale={TableLocale()}
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
        openModalType={openModalType}
        currentRecord={currentRecord}
        handleCloseModal={setOpenModalAddTaskState}
        refreshData={refreshData}
      />

      <ConfirmDialog
        state={isOpenModalDeleteTask}
        title="Xoá"
        description={`Xoá  ${
          currentItemSelected.id
            ? "công việc : " +
              currentItemSelected.id +
              " - " +
              currentItemSelected.text
            : `${selectedRowKeys.length} công việc`
        }`}
        handleOkModal={handleDelete}
        handleCloseModal={handleCloseDeleteDialog}
        keys={
          currentItemSelected.id
            ? currentItemSelected.id
            : selectedRowKeys.join(",").trim()
        }
      />
    </div>
  );
};

export default TaskList;
