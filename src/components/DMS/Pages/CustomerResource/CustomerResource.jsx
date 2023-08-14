import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import OperationColumn from "../../../../app/hooks/operationColumn";
import renderColumns from "../../../../app/hooks/renderColumns";
import ConfirmDialog from "../../../../Context/ConfirmDialog";
import TableLocale from "../../../../Context/TableLocale";
import { SoFuckingUltimateApi, SoFuckingUltimateGetApi } from "../../API";
import ModalAddCustomerResource from "../../Modals/ModalAddCustomerResource/ModalAddCustomerResource";
import "./CustomerResource.css";

const CustomerResource = () => {
  // initialize #########################################################################
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    SearchKey: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 1,
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

  const refreshData = () => {
    setPagination({ ...pagination, pageIndex: 1, current: 1 });
    if (pagination.pageIndex === 1) {
      setLoading(true);
      getdata();
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record.ma_nguon);
    setOpenModalAddTaskState(true);
    setOpenModalType("EDIT");
  };

  const handleOpenDeleteDialog = (record) => {
    setIsOpenModalDeleteTask(true);
    setCurrentItemSelected(record);
  };

  const handleDelete = (keys) => {
    SoFuckingUltimateApi({
      store: "api_delete_customer_resource",
      data: {
        id: keys.replaceAll(" ", ""),
        userid: 0,
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data === true) {
          notification.success({
            message: `Thành công`,
          });
          refreshData();
          setSelectedRowKeys([]);
          handleCloseDeleteDialog();
        } else {
          notification.warning({
            message: `Có lỗi xảy ra khi thực hiện`,
          });
        }
      })
      .catch((err) => {});
  };
  const handleCloseDeleteDialog = () => {
    setIsOpenModalDeleteTask(false);
    setCurrentItemSelected({});
  };

  const getdata = () => {
    delete pagination?.current;
    SoFuckingUltimateGetApi({
      store: "Get_Customer_Source",
      data: { ...tableParams, ...pagination },
    }).then((res) => {
      let layout = renderColumns(res?.reportLayoutModel);
      layout.push({
        title: " ",
        dataIndex: "",
        editable: false,
        dataType: "Operation",
        fixed: "right",
        align: "Center",
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
      const data = res.data;
      data.map((item, index) => {
        item.key = item.ma_nguon;
        return item;
      });
      setData(data);
      setTotalResults(res?.pagegination?.totalRecord);
      setLoading(false);
    });
  };

  const handleTableChange = (paginationChanges, filters, sorter) => {
    setPagination({
      ...pagination,
      pageIndex: paginationChanges.current,
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
    setOpenModalType("ADD");
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

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

  return (
    <div className="default_list_layout page_default">
      <div className="list__header__bar">
        <span className="default_header_label">
          Danh sách nguồn khách hàng (
          <span className="sub_text_color">{totalResults}</span>)
        </span>
        <div className="list__header__tools">
          {selectedRowKeys.length > 0 && (
            <>
              <Button
                className="default_button"
                danger
                onClick={handleOpenDeleteDialog}
                icon={<i className="pi pi-trash"></i>}
              >
                <span
                  style={{ fontWeight: "bold" }}
                >{`Xoá ${selectedRowKeys.length} nguồn`}</span>
              </Button>
            </>
          )}
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
      <ModalAddCustomerResource
        openModalState={openModalAddTaskState}
        openModalType={openModalType}
        currentRecord={currentRecord}
        handleCloseModal={setOpenModalAddTaskState}
        refreshData={refreshData}
      />
      <ConfirmDialog
        state={isOpenModalDeleteTask}
        title="Xoá"
        description={`Xoá mã : ${currentItemSelected.ma_nguon}, tên nguồn: ${currentItemSelected.ten_nguon}`}
        handleOkModal={handleDelete}
        handleCloseModal={handleCloseDeleteDialog}
        keys={
          currentItemSelected.ma_nguon
            ? currentItemSelected.ma_nguon
            : selectedRowKeys.join(",").trim()
        }
      />
    </div>
  );
};

export default CustomerResource;
