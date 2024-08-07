import { notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import OperationColumn from "../../../../app/hooks/operationColumn";

import renderColumns from "../../../../app/hooks/renderColumns";
import ConfirmDialog from "../../../../Context/ConfirmDialog";
import TableLocale from "../../../../Context/TableLocale";
import { formStatus } from "../../../../utils/constants";
import {
  SoFuckingUltimateApi,
  SoFuckingUltimateGetApi,
} from "../../../DMS/API";
import HeaderTableBar from "../../../ReuseComponents/HeaderTableBar";
import ModalApproveItems from "../../Modal/ModalApproveItems/ModalApproveItems";

const ApproveItems = () => {
  // initialize #########################################################################
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    keywords: "",
  });
  const [pagination, setPagination] = useState({
    pageindex: 1,
    pageSize: 10,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [openModalType, setOpenModalType] = useState(formStatus.ADD);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [currentItemSelected, setCurrentItemSelected] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  //functions #########################################################################

  const refreshData = () => {
    setPagination({ ...pagination, pageindex: 1, current: 1 });
    if (pagination.pageindex === 1) {
      setLoading(true);
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record.Id);
    setIsOpenViewModal(true);
    setOpenModalType(formStatus.EDIT);
  };

  const handleOpenDeleteDialog = (record) => {
    setIsOpenModalDelete(true);
    setCurrentItemSelected(record ? record : {});
  };

  const handleDelete = (keys) => {
    SoFuckingUltimateApi({
      store: "api_delete_approve_items",
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
    setIsOpenModalDelete(false);
    setCurrentItemSelected({});
    setSelectedRowKeys([]);
  };

  const getdata = () => {
    SoFuckingUltimateGetApi({
      store: "api_get_items_approve",
      data: {
        ...tableParams,
        pageindex: pagination.pageindex,
        pageSize: pagination.pageSize,
      },
    }).then((res) => {
      let layout = renderColumns(res?.reportLayoutModel);
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
      const data = res.data;
      data.map((item, index) => {
        item.key = item.Id;
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
    setIsOpenViewModal(!isOpenViewModal);
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
        name={"quyền"}
        title={"Phân quyền sản phẩm"}
        changePaginations={changePaginations}
        addEvent={openModalAddTask}
        totalResults={totalResults}
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
      <ModalApproveItems
        openModalState={isOpenViewModal}
        openModalType={openModalType}
        currentRecord={currentRecord}
        handleCloseModal={setIsOpenViewModal}
        refreshData={refreshData}
      />
      <ConfirmDialog
        state={isOpenModalDelete}
        title="Xoá"
        description={`Xoá  ${
          currentItemSelected.Id
            ? "quyền nhân viên: " +
              currentItemSelected.ma_nvbh +
              " - " +
              currentItemSelected.ten_nvbh
            : `${selectedRowKeys.length} quyền`
        }`}
        handleOkModal={handleDelete}
        handleCloseModal={handleCloseDeleteDialog}
        keys={
          currentItemSelected.Id
            ? currentItemSelected.Id
            : selectedRowKeys.join(",").trim()
        }
      />
    </div>
  );
};

export default ApproveItems;
