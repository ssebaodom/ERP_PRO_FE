import {
  Button,
  Divider,
  Form,
  Input,
  notification,
  Pagination,
  Space,
  Steps,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { filterKeyHelper } from "../../../../app/Functions/filterHelper";
import { getIndexRow } from "../../../../app/Functions/getIndexRow";
import {
  dataProcessing,
  formatData,
} from "../../../../app/hooks/dataFormatHelper";
import ConfirmDialog from "../../../../Context/ConfirmDialog";
import { getUserInfo } from "../../../../store/selectors/Selectors";
import { formStatus } from "../../../../utils/constants";
import { UltimatePutDataApi } from "../../../DMS/API";
import Filter from "../../../DMS/Pages/DMSCustomerList/Modals/Filter";
import LoadingComponents from "../../../Loading/LoadingComponents";
import HeaderTableBar from "../../../ReuseComponents/HeaderTableBar";
import { SoFuckingUltimateGetApi } from "../../../SystemOptions/API";
import { SoFuckingUltimateApi } from "../../API";
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
  const [masterForm] = Form.useForm();

  const [detailData, setDetailData] = useState([]);
  const [detailColums, setDetailColums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [tableParams, setTableParams] = useState({
    DateFrom: "2022/10/30",
    DateTo: dayjs(),
  });
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [totalResults, setTotalResults] = useState(0);
  const [currentRecord, setCurrentRecord] = useState({
    stt_rec: "A00000000",
    so_ct: "000001",
    ngay_ct: dayjs(),
  });
  const [isOpenAdvanceFilter, setIsOpenAdvanceFilter] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const [action, setAction] = useState(formStatus.VIEW);
  const [initialCustomerValue, setInitialCustomerValue] = useState({});
  const [isSimpleFilter, setIsSimpleFilter] = useState(false);

  const currentSaleOutMaster = useSelector(getCurrentSaleOutMaster);
  const currentSaleOutDetail = useSelector(getCurrentSaleOutDetail);
  const finalDetails = useSelector(getFinalDetail);
  const userInfo = useSelector(getUserInfo);

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
    delete pagination?.current;
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

  const handleChangePagintion = (currentPage, pageSize) => {
    setPagination({ ...pagination, pageIndex: currentPage });
  };

  const openAdvanceFilter = async () => {
    await setIsOpenAdvanceFilter(true);
  };

  const onSubmitForm = () => {
    const master = {
      ...dataProcessing(masterForm.getFieldsValue(), [
        "cacel_reason",
        "t_so_luong",
        "t_tt_nt",
        "ten_kh2",
        "ten_nvbh",
        "ten_kh",
      ]),
      stt_rec: action == formStatus.EDIT ? currentRecord.stt_rec : null,
      so_ct: action == formStatus.EDIT ? currentRecord.so_ct : "",
      UserId: 0,
      UnitId: userInfo.unitId,
    };

    var detail = [...finalDetails];
    detail = detail.map((item, index) => {
      return {
        stt_rec0: getIndexRow(index),
        ...item,
      };
    });
    UltimatePutDataApi({
      store: "app_create_sale_out",
      data: master,
      listData: detail,
    })
      .then((res) => {
        if (res.status != "Failed") {
          notification.success({
            message: `Thành công`,
          });
          refreshData();
          setAction(formStatus.VIEW);
        } else {
          notification.warning({
            message: `Có lỗi xảy ra khi thực hiện`,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectedMasterItem = (item) => {
    setCurrentRecord(item);
    setAction(formStatus.VIEW);
  };

  const onFilter = (items) => {
    console.log(items);
  };

  const handleSaveDetailForm = async (items) => {
    try {
      await masterForm.validateFields();
      detailTable.current.getData();
    } catch (error) {
      return;
    }
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

  const handleAddNew = () => {
    setAction(formStatus.ADD);
    setInitialCustomerValue({});
    setDetailData([]);
  };

  const handleOpenDeleteDialog = () => {
    if (currentRecord.stt_rec != "A00000000" && action !== formStatus.ADD) {
      setIsOpenDeleteModal(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsOpenDeleteModal(false);
  };

  const handleDelete = (key) => {
    SoFuckingUltimateApi({
      store: "api_Order_Cancel",
      data: {
        LetterId: currentRecord.stt_rec,
        UserId: 0,
        UnitId: userInfo.unitId,
      },
    }).then((res) => {
      if (res.status === 200 && res.data === true) {
        notification.success({
          message: `Thành công`,
        });
        refreshData();
        setAction(formStatus.VIEW);
        handleCloseDeleteDialog();
      } else {
        notification.warning({
          message: `Có lỗi xảy ra khi thực hiện`,
        });
      }
    });
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
    masterForm.resetFields();
  }, [JSON.stringify(initialCustomerValue)]);

  useEffect(() => {
    if (finalDetails.length > 0) {
      onSubmitForm();
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
            addEvent={handleAddNew}
            deleteEvent={handleOpenDeleteDialog}
          />
        </div>
        <div className="split__view__detail">
          <div className="split__view__detail__left" style={{ flex: "0.28" }}>
            <div
              className={` ${
                isSimpleFilter
                  ? "split__view__detail__left__filter"
                  : "split__view__detail__left__item_SO"
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
                    className={`split__view__detail__left__item_SO split_view_item ${
                      item.so_ct === currentRecord.so_ct ? "selected" : ""
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
              form={masterForm}
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
                      <SaleOutMaster action={action} form={masterForm} />
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
                        masterForm={masterForm}
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
                              masterForm.resetFields();
                              setAction(formStatus.VIEW);
                            }}
                            className="default_subsidiary_button"
                          >
                            Huỷ
                          </Button>

                          <Button
                            onClick={handleSaveDetailForm}
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
        onFilter={onFilter}
      />

      <ConfirmDialog
        state={isOpenDeleteModal}
        title="Xoá đơn hàng"
        description={`Xoá chứng từng: ${currentRecord.so_ct}, ngày lập: ${dayjs(
          currentRecord.ngay_ct
        ).format("DD/MM/YYYY")}`}
        handleOkModal={handleDelete}
        handleCloseModal={handleCloseDeleteDialog}
        keys={currentRecord.stt_rec}
      />
    </div>
  );
};

export default SaleOut;
