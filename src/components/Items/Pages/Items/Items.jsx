import { Table } from "antd";
import React, { useEffect, useState } from "react";
import OperationColumn from "../../../../app/hooks/operationColumn";
import renderColumns from "../../../../app/hooks/renderColumns";
import TableLocale from "../../../../Context/TableLocale";
import { formStatus } from "../../../../utils/constants";
import { SoFuckingUltimateGetApi } from "../../../DMS/API";
import HeaderTableBar from "../../../ReuseComponents/HeaderTableBar";
import ModalViewItems from "../../Modal/ModalItems/ModalViewItems";

const Items = () => {
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
    setCurrentRecord(record.ma_vt);
    setIsOpenViewModal(true);
    setOpenModalType(formStatus.VIEW);
  };

  const handleOpenDeleteDialog = (record) => {
    setIsOpenModalDelete(true);
    setCurrentItemSelected(record ? record : {});
  };

  //   const handleDelete = (keys) => {
  //     SoFuckingUltimateApi({
  //       store: "api_delete_tour_list",
  //       data: {
  //         ma_tuyen: keys.replaceAll(" ", ""),
  //         userid: 0,
  //       },
  //     })
  //       .then((res) => {
  //         if (res.status === 200 && res.data === true) {
  //           notification.success({
  //             message: `Thành công`,
  //           });
  //           refreshData();
  //           handleCloseDeleteDialog();
  //         } else {
  //           notification.warning({
  //             message: `Có lỗi xảy ra khi thực hiện`,
  //           });
  //         }
  //       })
  //       .catch((err) => {});
  //   };

  //   const handleCloseDeleteDialog = () => {
  //     setIsOpenModalDeleteTask(false);
  //     setCurrentItemSelected({});
  //     setSelectedRowKeys([]);
  //   };

  const getdata = () => {
    delete pagination?.current;

    SoFuckingUltimateGetApi({
      store: "api_get_items_list",
      data: { ...tableParams, ...pagination },
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
          return <OperationColumn record={record} viewFunction={handleEdit} />;
        },
      });
      setTableColumns(layout);
      const data = res.data;
      data.map((item, index) => {
        item.key = item.ma_vt;
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
    setPagination({ ...pagination, pageSize: item });
  };

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

  return (
    <div className="default_list_layout page_default">
      <HeaderTableBar
        name={"vật tư"}
        title={"Danh mục vật tư"}
        changePaginations={changePaginations}
        totalResults={totalResults}
        refreshEvent={refreshData}
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
      <ModalViewItems
        openModalState={isOpenViewModal}
        openModalType={openModalType}
        currentRecord={currentRecord}
        handleCloseModal={setIsOpenViewModal}
        refreshData={refreshData}
      />
    </div>
  );
};

export default Items;
