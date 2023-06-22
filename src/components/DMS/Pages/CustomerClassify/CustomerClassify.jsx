import React from "react";
import "./CustomerClassify.css";
import { Button, Space, Table } from "antd";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import ResizableAntdTable from "resizable-antd-table";
import { useEffect, useState } from "react";
import qs from "qs";
import ModalAddTask from "../../Modals/ModalAddTask/ModalAddTask";
import { ApiGetTourList } from "../../API";
import renderColumns from "../../../../app/hooks/renderColumns";
import edit__icon from "../../../../Icons/edit__icon.svg";
import delete__icon from "../../../../Icons/delete__icon.svg";
import ConfirmDialog from "../../../../Context/ConfirmDialog";
import ModalAddCustomerResource from "../../Modals/ModalAddCustomerResource/ModalAddCustomerResource";
import ModalClassifyCustomer from "../../Modals/ModalClassifyCustomer/ModalClassifyCustomer";

const CustomerClassify = () => {
  // initialize #########################################################################
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    keywords: "",
    orderby: "ma_tuyen",
    ma_nv: "",
    mo_ta: "",
    ten_nv: "",
    ma_tuyen: "",
    ten_tuyen: "",
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
    setIsOpenModalDeleteTask(!isOpenModalDeleteTask);
    setCurrentItemSelected(record);
  };

  const handleDelete = () => {
    console.log("Gọi API delete ở đây", currentItemSelected);
    handleCloseDeleteDialog();
    refreshData();
  };
  const handleCloseDeleteDialog = () => {
    setIsOpenModalDeleteTask(false);
    setCurrentItemSelected({});
  };

  const getdata = () => {
    ApiGetTourList({ ...tableParams, ...pagination }).then((res) => {
      let layout = renderColumns(res?.data?.reportLayoutModel);
      layout.push({
        title: "Chức năng",
        dataIndex: "",
        editable: false,
        dataType: "Operation",
        fixed: "right",
        render: (_, record) => {
          return (
            <span style={{ display: "flex", gap: "15px", height: "20px" }}>
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
        item.key = item.ma_tuyen;
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
    setOpenModalType("Add");
    setCurrentRecord(0);
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
          Danh sách tuyến (
          <span className="sub_text_color">{totalResults}</span>)
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
      <ModalClassifyCustomer
        openModalState={openModalAddTaskState}
        openModalType={openModalType}
        currentRecord={currentRecord}
        handleCloseModal={setOpenModalAddTaskState}
      />
      <ConfirmDialog
        state={isOpenModalDeleteTask}
        title="Mày có muốn xoá cái này khum"
        description={`Xoá công việc : ${currentItemSelected.ten_tuyen}`}
        handleOkModal={handleDelete}
        handleCloseModal={handleCloseDeleteDialog}
      />
    </div>
  );
};

export default CustomerClassify;
