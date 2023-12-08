import { Button, Divider, Form, InputNumber, Modal, Table } from "antd";
import { ProgressBar } from "primereact/progressbar";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OperationColumn from "../../../../app/hooks/operationColumn";
import renderColumns from "../../../../app/hooks/renderColumns";
import { quantityFormat } from "../../../../app/Options/DataFomater";
import TableLocale from "../../../../Context/TableLocale";
import { SoFuckingUltimateGetApi } from "../../../DMS/API";
import FormSelectDetail from "../../../ReuseComponents/FormSelectDetail";
import { setIsOpenModal } from "../../Store/Actions/KPIPlans";
import { getKPIPlansState } from "../../Store/Selectors/Selectors";
import "./KPIPlansDetail.css";

const KPIPlansDetail = () => {
  const [inputForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    keywords: "",
  });
  const [pagination, setPagination] = useState({
    pageindex: 1,
    pageSize: 5,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [performRate, setPerformRate] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [initialValue, setInitialValue] = useState({});

  const KPIPlanState = useSelector(getKPIPlansState);

  const handleCloseModal = () => {
    setIsOpenModal(false);
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
              deleteFunction={() => {
                console.log(record);
              }}
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
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      setData([]);
    }
  };

  const onDeselect = async () => {
    await setSelectedRowKeys([]);
    await setInitialValue({});
    await inputForm.resetFields();
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    columnTitle: (
      <i className="pi pi-ban deselect_button" onClick={onDeselect}></i>
    ),
    type: "radio",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), pagination]);

  return (
    <Modal
      open={KPIPlanState.isOpenModal}
      onCancel={handleCloseModal}
      okText="Hoàn thành"
      centered
      cancelButtonProps={{ style: { display: "none" } }}
      width={800}
      destroyOnClose
      title="Chi tiết KPI"
    >
      <div className="">
        <Table
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={data}
          rowClassName={"default_table_row"}
          className="default_table"
          locale={TableLocale()}
          scroll={{ x: "auto" }}
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

      <Divider style={{ margin: "10px 0px" }} />

      <Form
        initialValues={initialValue}
        form={inputForm}
        className="default_modal_container"
      >
        <div className="default_modal_group_items">
          <div className="default_modal_group_items">
            <FormSelectDetail
              width={100}
              codeWidth={120}
              controller={"dmkh_lookup"}
              keyCode="ma_kpi"
              keyName="ten_kpi"
              label="Mã KPI"
              placeHolderCode="KPI"
              placeHolderName="Tên KPI"
              form={inputForm}
              direction="column"
            />
          </div>
          <div className="default_modal_group_items">
            <FormSelectDetail
              width={100}
              codeWidth={120}
              controller={"dmvt_lookup"}
              keyCode="ma_vt"
              keyName="ten_vt"
              label="Sản phẩm"
              placeHolderCode="Sản phẩm"
              placeHolderName="Tên sản phẩm"
              form={inputForm}
              direction="column"
            />
          </div>
        </div>
        <div className="default_modal_group_items">
          <div className="default_modal_group_items">
            <div
              className="split__view__detail__primary__item"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span className="default_bold_label" style={{ width: ` 100px` }}>
                Kế hoạch
              </span>

              <div className="flex w-full gap-2">
                <Form.Item
                  name="ke_hoach"
                  rules={[
                    {
                      required: true,
                      message: `Điền kế hoạch`,
                    },
                  ]}
                  initialValue={0}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    min="0"
                    step={quantityFormat}
                    stringMode
                  />
                </Form.Item>
              </div>
            </div>

            <div
              className="split__view__detail__primary__item"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span className="default_bold_label" style={{ width: ` 100px` }}>
                Trọng số
              </span>

              <div className="flex w-full gap-2">
                <Form.Item
                  name="trong_so"
                  rules={[
                    {
                      required: true,
                      message: `Điền trọng số`,
                    },
                  ]}
                  initialValue={0}
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    min="0"
                    step={quantityFormat}
                    stringMode
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="KPI__effectuate__rate__container">
            <p className="default_bold_label">Thực hiện</p>
            <ProgressBar
              pt={{
                value: {
                  style: {
                    background: "linear-gradient(to right, #657194, #4779CF)",
                    flex: "none",
                  },
                },
              }}
              value={performRate}
            ></ProgressBar>
          </div>
        </div>

        <div
          className="split__view__detail__primary__item"
          style={{
            justifyContent: "center",
          }}
        >
          <Button>{selectedRowKeys.length > 0 ? "Lưu" : "Thêm mới"}</Button>
        </div>
      </Form>
      <Divider style={{ margin: "10px 0px" }} />
    </Modal>
  );
};

export default KPIPlansDetail;
