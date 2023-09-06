import { Button, Divider, Form, Input, Pagination, Space, Steps } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { filterKeyHelper } from "../../../../app/Functions/filterHelper";
import { formatData } from "../../../../app/hooks/dataFormatHelper";
import { formStatus } from "../../../../utils/constants";
import Filter from "../../../DMS/Pages/DMSCustomerList/Modals/Filter";
import LoadingComponents from "../../../Loading/LoadingComponents";
import HeaderTableBar from "../../../ReuseComponents/HeaderTableBar";
import { SoFuckingUltimateGetApi } from "../../../SystemOptions/API";
import {
  fetchSaleOutDetail,
  fetchSaleOutMaster,
} from "../../Store/Sagas/Sagas";
import {
  getCurrentSaleOutDetail,
  getCurrentSaleOutMaster,
  getFinalDetail,
} from "../../Store/Selector/Selector";
import SaleoutDetail from "./Detail/SaleoutDetail";
import SaleOutMaster from "./Detail/SaleOutMaster";
import SummaryMaster from "./Detail/summaryMaster";
import "./SaleOut.css";

const SaleOut = () => {
  // initialize #########################################################################
  const [detailForm] = Form.useForm();

  const [detailData, setDetailData] = useState([]);
  const [detailColums, setDetailColums] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [tableParams, setTableParams] = useState({
    DateFrom: "2022-10-30",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [totalResults, setTotalResults] = useState(0);
  const [openModalType, setOpenModalType] = useState(formStatus.ADD);
  const [currentRecord, setCurrentRecord] = useState({
    stt_rec: "A00000000",
    ngay_ct: dayjs().format("DD/MM/YYYY"),
  });
  const [currentItemSelected, setCurrentItemSelected] = useState({});
  const [isOpenAdvanceFilter, setIsOpenAdvanceFilter] = useState(false);
  const [filterForm] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [action, setAction] = useState(formStatus.VIEW);
  const [initialCustomerValue, setInitialCustomerValue] = useState({});
  const [isSimpleFilter, setIsSimpleFilter] = useState(false);

  const currentSaleOutMaster = useSelector(getCurrentSaleOutMaster);
  const currentSaleOutDetail = useSelector(getCurrentSaleOutDetail);
  const finalDetails = useSelector(getFinalDetail);

  const detailTable = useRef();

  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([
    {
      key: 0,
      title: "Thông tin chính",
    },
    {
      key: 1,
      title: "Đơn hàng",
    },
  ]);

  //functions #########################################################################

  const refreshData = () => {
    setPagination({ ...pagination, pageIndex: 1, current: 1 });
    if (pagination.pageIndex === 1) {
      setLoading(true);
    }
  };

  const getdata = async () => {
    setLoading(true);
    await SoFuckingUltimateGetApi({
      store: "api_get_order_list",
      data: {
        ...tableParams,
        ...pagination,
      },
    }).then((res) => {
      setCustomerList(res.data.data);
      setTotalResults(res?.data.pagegination?.totalRecord);
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

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      setDetailData([]);
    }
  };

  const handleChangePagintion = (currentPage, pageSize) => {
    setPagination({ ...pagination, pageIndex: currentPage });
  };

  const openAdvanceFilter = async () => {
    await setIsOpenAdvanceFilter(true);
  };

  const onSubmitForm = () => {
    const a = { ...filterForm.getFieldsValue() };
    const initialValue = filterForm.getFieldValue("customerCode");
  };

  const handleSelectedMasterItem = (item) => {
    setCurrentRecord(item);
    setAction(formStatus.VIEW);
  };

  const onFilter = (items) => {
    console.log(items);
  };

  const handleSaveDetailForm = (items) => {
    setAction(formStatus.VIEW);
    detailTable.current.getData();
  };

  const onStepsChange = (step) => {
    setCurrentStep(step);
  };

  const handleSearchCustomer = useDebouncedCallback(async (searchValue) => {
    const newKeywords = await filterKeyHelper(searchValue);
    setTableParams({ ...tableParams });
    setPagination({ ...pagination, pageIndex: 1 });
  }, 800);

  const handleShowFilter = () => {
    if (!isSimpleFilter) {
      setIsSimpleFilter(true);
    }
  };

  const handleHiddenFilter = () => {
    setIsSimpleFilter((prevCurrPos) => false);
    handleSearchCustomer("");
  };

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

  // Khi chọn khách sẽ load dữ liệu detail
  useEffect(() => {
    fetchSaleOutDetail(currentRecord);
    if (currentRecord) {
      setLoadingDetail(true);
      fetchSaleOutMaster(currentRecord);
      setCurrentStep(0);
    }
  }, [JSON.stringify(currentRecord)]);

  // Khi lấy dữ liệu set thành initial để khi huỷ không bị mất
  useEffect(() => {
    if (currentSaleOutMaster?.data?.length > 0) {
      setInitialCustomerValue({
        ...formatData(
          currentSaleOutMaster?.data[0],
          currentSaleOutMaster?.reportLayoutModel
        ),
      });
    }
    setLoadingDetail(false);
  }, [JSON.stringify(currentSaleOutMaster)]);

  useEffect(() => {
    if (currentSaleOutDetail && currentRecord) {
      setDetailData(currentSaleOutDetail.data);
      setDetailColums(currentSaleOutDetail.reportLayoutModel);
    }
  }, [JSON.stringify(currentSaleOutDetail)]);

  // Refresh lại form để nhận dữ liệu
  useEffect(() => {
    detailForm.resetFields();
  }, [JSON.stringify(initialCustomerValue)]);

  useEffect(() => {
    if (finalDetails) {
      console.log(finalDetails);
    }
  }, [finalDetails]);

  return (
    <div
      className="default_list_layout page_default"
      style={{ height: "90vh", gap: "15px" }}
    >
      <div className="split__view__container" style={{ height: "96%" }}>
        <div className="split__view__header__bar">
          <HeaderTableBar
            name={"Saleout"}
            title={"Danh sách phiếu saleout"}
            totalResults={totalResults}
            advanceFilter={openAdvanceFilter}
            refreshEvent={refreshData}
          />
        </div>
        <div className="split__view__detail">
          <div className="split__view__detail__left" style={{ flex: "0.28" }}>
            <div
              className={` ${
                isSimpleFilter
                  ? "split__view__detail__left__filter"
                  : "split__view__detail__left__item"
              } split__view__header split__view__detail__header`}
              onClick={handleShowFilter}
            >
              {!isSimpleFilter ? (
                <>
                  <span>Số CT</span>
                  <span>Ngày CT</span>
                  <span>Tên khách hàng</span>
                </>
              ) : (
                <>
                  <Input
                    style={{
                      height: "30px",
                      minWidth: 0,
                    }}
                    size="middle"
                    placeholder="Tìm kiếm..."
                    onChange={(e) => {
                      handleSearchCustomer(e.target.value);
                    }}
                  />
                  <Button
                    onClick={handleHiddenFilter}
                    className="default_warning_button"
                  >
                    Huỷ
                  </Button>
                </>
              )}
            </div>
            <div className="split__view__detail__left__item__container h-full">
              {/* selected */}
              {loading == false ? (
                customerList.map((item, index) => (
                  <div
                    key={index}
                    className={`split__view__detail__left__item split_view_item ${
                      item.so_ct === currentRecord ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      handleSelectedMasterItem(item);
                    }}
                  >
                    <span>{item?.so_ct?.trim()}</span>
                    <span>
                      {dayjs(item?.ngay_ct?.trim()).format("DD/MM/YYYY")}
                    </span>
                    <span>{item?.ten_kh?.trim()}</span>
                  </div>
                ))
              ) : (
                <LoadingComponents
                  text={"Đang tải..."}
                  size={50}
                  loading={true}
                />
              )}
            </div>

            <div className="split__view__pagination">
              <Pagination
                simple
                defaultCurrent={1}
                current={pagination.pageIndex}
                total={totalResults}
                onChange={handleChangePagintion}
              />
            </div>
          </div>
          <div className="split__view__detail__right">
            <Form
              initialValues={initialCustomerValue}
              form={detailForm}
              onFinish={handleSaveDetailForm}
              className="split__view__detail__primary relative w-full justify-content-between"
              style={{ flex: 1 }}
            >
              {loadingDetail ? (
                <LoadingComponents
                  text={"Đang tải..."}
                  size={50}
                  loading={true}
                />
              ) : (
                <>
                  <div className="flex flex-column h-full min-h-0">
                    <Steps
                      className="w-fit"
                      style={{ marginBottom: "20px" }}
                      current={currentStep}
                      items={steps}
                      onChange={onStepsChange}
                    />
                    <Divider style={{ margin: "10px 0px" }} />
                    <div
                      className="h-full min-h-0"
                      style={{
                        display: `${
                          steps[currentStep].key == 0 ? "block" : "none"
                        }`,
                      }}
                    >
                      <SaleOutMaster action={action} form={detailForm} />
                    </div>

                    <div
                      className="h-full min-h-0"
                      style={{
                        display: `${
                          steps[currentStep].key == 1 ? "block" : "none"
                        }`,
                      }}
                    >
                      <SaleoutDetail
                        masterForm={detailForm}
                        data={detailData}
                        Action={action}
                        Tablecolumns={detailColums}
                        ref={detailTable}
                      />
                    </div>
                  </div>

                  <div className="split__view__detail__summary">
                    <SummaryMaster action={action} />

                    <Space className="justify-content-end">
                      {action !== "VIEW" ? (
                        <>
                          <Button
                            onClick={(e) => {
                              detailForm.resetFields();
                              setAction(formStatus.VIEW);
                            }}
                            className="default_subsidiary_button"
                          >
                            Huỷ
                          </Button>

                          <Button
                            type="primary"
                            htmlType="submit"
                            className="default_primary_button"
                          >
                            Lưu
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={(e) => setAction(formStatus.EDIT)}
                            className="default_warning_button"
                          >
                            Sửa
                          </Button>
                        </>
                      )}
                    </Space>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>

      <Filter
        setIsOpenAdvanceFilter={setIsOpenAdvanceFilter}
        isOpenAdvanceFilter={isOpenAdvanceFilter}
        onFilter
      />
    </div>
  );
};

export default SaleOut;
