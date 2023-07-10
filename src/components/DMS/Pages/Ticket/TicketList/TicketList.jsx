import React from "react";
import "./TicketList.css";
import { Button, notification, Space, Table } from "antd";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import ResizableAntdTable from "resizable-antd-table";
import { useEffect, useState } from "react";
import {
  ApiGetTicketList,
  ApiGetTourList,
  SoFuckingUltimateApi,
} from "../../../API";
import edit__icon from "../../../../../Icons/edit__icon.svg";
import delete__icon from "../../../../../Icons/delete__icon.svg";
import ConfirmDialog from "../../../../../Context/ConfirmDialog";
import ModalAddCustomerResource from "../../../Modals/ModalAddCustomerResource/ModalAddCustomerResource";
import renderColumns from "../../../../../app/hooks/renderColumns";
import ModalAddTicket from "../../../Modals/ModalAddTicket/ModalAddTicket";

const TicketList = () => {
  // initialize #########################################################################
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    orderby: "ma_kh",
    ma_kh: "",
    ten_kh: "",
    ten_nvbh: "",
    ma_nv: "",
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

  const refreshData = () => {
    setPagination({ ...pagination, pageindex: 1, current: 1 });
    if (pagination.pageindex === 1) {
      setLoading(true);
      getdata();
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record.id);
    setOpenModalAddTaskState(true);
    setOpenModalType("Edit");
  };

  const handleOpenDeleteDialog = (record) => {
    setIsOpenModalDeleteTask(true);
    setCurrentItemSelected(record);
  };

  const handleDelete = () => {
    SoFuckingUltimateApi({
      store: "api_delete_ticket",
      data: {
        id_ticket: currentItemSelected.id_ticket,
        userid: 0,
      },
    })
      .then((res) => {
        if (res.status === 200 && res.data === true) {
          notification.success({
            message: `Thành công`,
          });
          refreshData();
        } else {
          notification.warning({
            message: `Có lỗi xảy ra khi thực hiện`,
          });
        }
      })
      .catch((err) => {});

    handleCloseDeleteDialog();
    refreshData();
  };
  const handleCloseDeleteDialog = () => {
    setIsOpenModalDeleteTask(false);
    setCurrentItemSelected({});
  };

  const getdata = () => {
    ApiGetTicketList({ ...tableParams, ...pagination }).then((res) => {
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
            <span
              style={{
                display: "flex",
                gap: "15px",
                height: "20px",
                justifyContent: "center",
              }}
            >
              <img
                className="default_images_clickable"
                onClick={(e) => {
                  handleEdit(record);
                }}
                src={edit__icon}
                alt=""
              ></img>
              <img
                className="default_images_clickable"
                src={delete__icon}
                onClick={(e) => {
                  handleOpenDeleteDialog(record);
                }}
                alt=""
              ></img>
            </span>
          );
        },
      });
      setTableColumns(layout);
      const data = res.data.data;
      data.map((item, index) => {
        item.key = item.id_ticket;
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
    setSelectedRowKeys([]);

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      setData([]);
    }
  };

  const openModalAddTask = () => {
    setOpenModalAddTaskState(!openModalAddTaskState);
    setOpenModalType("Add");
    setCurrentRecord(0);
  };

  const onSelect = async (record, selected, selectedRows) => {
    const keys = selectedRows.map((item) => item.key);
    console.log(selectedRows);
    setSelectedRowKeys([...keys]);
  };

  const onSelectAll = (selected, selectedRows) => {
    console.log(selectedRows);
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
          Danh sách ticket (
          <span className="sub_text_color">{totalResults}</span>)
        </span>
        <div className="list__header__tools">
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
          rowSelection={rowSelection}
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
      <ModalAddTicket
        openModalState={openModalAddTaskState}
        openModalType={openModalType}
        currentRecord={currentRecord}
        handleCloseModal={setOpenModalAddTaskState}
        refreshData={refreshData}
      />
      <ConfirmDialog
        state={isOpenModalDeleteTask}
        title="Xoá"
        description={`Xoá ticket : ${currentItemSelected.id_ticket}, khách hàng: ${currentItemSelected.ten_kh}`}
        handleOkModal={handleDelete}
        handleCloseModal={handleCloseDeleteDialog}
      />
    </div>
  );
};

export default TicketList;
