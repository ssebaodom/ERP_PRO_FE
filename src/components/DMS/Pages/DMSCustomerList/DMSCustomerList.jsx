import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Form, Input, Pagination, Space, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { filterKeyHelper } from "../../../../app/Functions/filterHelper";
import { formStatus } from "../../../../utils/constants";
import LoadingComponents from "../../../Loading/LoadingComponents";
import { SoFuckingUltimateGetApi } from "../../API";
import {
  fetchDMSCustomersDetail,
  setCurrentTab,
} from "../../Store/Sagas/Sagas";
import { getcurrentDMSCustomer } from "../../Store/Selector/Selectors";
import "./DMSCustomerList.css";
import CIHistory from "./Modals/CIHistory";
import CustomerCheckinHistory from "./Modals/CustomerCheckinHistory";
import DetailInfoCustomer from "./Modals/DetailInfoCustomer";
import Filter from "./Modals/Filter";
import MasterInfoCustomer from "./Modals/MasterInfoCustomer";
import SOHistory from "./Modals/SOHistory";
import TKHistory from "./Modals/TKHistory";

const DMSCustomerList = () => {
  // initialize #########################################################################
  const [detailForm] = Form.useForm();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [tableParams, setTableParams] = useState({
    keywords: "",
    orderby: "ten_dm",
  });
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [totalResults, setTotalResults] = useState(0);
  const [openModalType, setOpenModalType] = useState("Add");
  const [currentRecord, setCurrentRecord] = useState(null);
  const [currentItemSelected, setCurrentItemSelected] = useState({});
  const [isOpenAdvanceFilter, setIsOpenAdvanceFilter] = useState(false);
  const [filterForm] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [action, setAction] = useState(formStatus.VIEW);
  const detailCustomer = useSelector(getcurrentDMSCustomer);
  const [initialCustomerValue, setInitialCustomerValue] = useState({});

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
      store: "get_vcrdm",
      data: {
        ...tableParams,
        ...pagination,
      },
    }).then((res) => {
      setCustomerList(res.data);
      setTotalResults(res.pagegination.totalRecord);
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
      setData([]);
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
    // console.log(a);
    const initialValue = filterForm.getFieldValue("customerCode");
  };

  const handleSelectedCustomer = (item) => {
    setCurrentRecord(item);
    setAction(formStatus.VIEW);
  };

  const onFilter = (items) => {
    console.log(items);
  };

  const handleSaveDetailForm = (items) => {
    console.log(items);
    setAction(formStatus.VIEW);
    setInitialCustomerValue({ ...initialCustomerValue, ...items });
  };

  const onTabChanges = (tabKey) => {
    setCurrentTab(tabKey);
  };

  const handleSearchCustomer = useDebouncedCallback(async (searchValue) => {
    const newKeywords = await filterKeyHelper(searchValue);
    setTableParams({ ...tableParams, keywords: newKeywords });
    setPagination({ ...pagination, pageIndex: 1 });
  }, 800);

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

  // Khi chọn khách sẽ load dữ liệu detail
  useEffect(() => {
    if (currentRecord) {
      setLoadingDetail(true);
      fetchDMSCustomersDetail(currentRecord);
    }
  }, [JSON.stringify(currentRecord)]);

  // Khi lấy dữ liệu set thành initial để khi huỷ không bị mất
  useEffect(() => {
    if (detailCustomer && currentRecord) {
      setInitialCustomerValue({
        customerName: detailCustomer?.ten_dm?.trim(),
        phone: detailCustomer?.dien_thoai?.trim(),
        address: detailCustomer?.dia_chi?.trim(),
        birthDay: dayjs(detailCustomer?.ngay_sinh).format("DD/MM/YYYY"),
        tourName: detailCustomer?.ten_tuyen?.trim(),
        areaCode: detailCustomer?.nh_kh1?.trim(),
        areaName: detailCustomer?.ten_khu_vuc?.trim(),
        provinceCode: detailCustomer?.nh_kh2?.trim(),
        provinceName: detailCustomer?.ten_tinh?.trim(),
        districtCode: detailCustomer?.nh_kh3?.trim(),
        districtName: detailCustomer?.ten_quan?.trim(),
        wardsCode: detailCustomer?.nh_kh4?.trim(),
        wardsName: detailCustomer?.ten_phuong?.trim(),
        resourceCode: detailCustomer?.nh_kh5?.trim(),
        resourceName: detailCustomer?.nh_kh5?.trim(),
        unitCode: detailCustomer?.nh_kh6?.trim(),
        unitName: detailCustomer?.ten_dvcs?.trim(),
        typeCode: detailCustomer?.nh_kh7?.trim(),
        typeName: detailCustomer?.nh_kh7?.trim(),
        formCode: detailCustomer?.nh_kh7?.trim(),
        formName: detailCustomer?.nh_kh7?.trim(),
        tourCode: detailCustomer?.ma_tuyen?.trim(),
        employeeCode: detailCustomer?.ma_nvbh?.trim(),
        employeeName: detailCustomer?.ma_nvbh?.trim(),
      });
      detailForm.resetFields();
      setLoadingDetail(false);
    }
  }, [JSON.stringify(detailCustomer)]);

  // Refresh lại form để nhận dữ liệu
  useEffect(() => {
    detailForm.resetFields();
  }, [JSON.stringify(initialCustomerValue)]);

  return (
    <div
      className="default_list_layout page_default"
      style={{ height: "90vh", gap: "15px" }}
    >
      <div className="list__header__bar">
        <span className="default_header_label">
          Danh sách khách hàng DMS (
          <span className="sub_text_color">{totalResults}</span>)
        </span>
        <div className="list__header__tools">
          <Button
            className="default_button"
            icon={<PlusOutlined className="sub_text_color" />}
          >
            <span style={{ fontWeight: "bold" }}>Thêm mới</span>
          </Button>
          <Button
            className="default_button"
            icon={<PlusOutlined className="sub_text_color" />}
          >
            <span style={{ fontWeight: "bold" }}>Nhập dữ liệu</span>
          </Button>
          <Button
            className="default_button"
            icon={<PlusOutlined className="sub_text_color" />}
          >
            <span style={{ fontWeight: "bold" }}>Xuất dữ liệu</span>
          </Button>
          <Button className="default_button" onClick={refreshData}>
            <SyncOutlined
              style={{ fontSize: "20px", width: "20px", height: "20px" }}
              className="sub_text_color"
            />
          </Button>
        </div>
      </div>

      <div className="split__view__container">
        <div className="split__view__header__bar">
          <div className="split__view__search__bar">
            <Input
              style={{
                width: "15vw",
                height: "30px",
              }}
              size="middle"
              className="default_input"
              placeholder="Tìm kiếm..."
              onChange={(e) => {
                handleSearchCustomer(e.target.value);
              }}
            />
            <Button
              style={{ borderRadius: "4px", height: "30px" }}
              className="default_button"
              onClick={openAdvanceFilter}
            >
              <span style={{ fontWeight: "bold" }}>Nâng cao</span>
            </Button>
          </div>
        </div>
        <div className="split__view__detail">
          <div className="split__view__detail__left">
            <div className="split__view__detail__left__item split__view__header split__view__detail__header">
              <span>STT</span>
              <span>Tên khách</span>
              <span>Số điện thoại</span>
            </div>
            <div className="split__view__detail__left__item__container h-full">
              {/* selected */}
              {loading == false ? (
                customerList.map((item, index) => (
                  <div
                    key={index}
                    className={`split__view__detail__left__item split_view_item ${
                      item.ma_kh === currentRecord ? "selected" : ""
                    }`}
                    onClick={(e) => {
                      handleSelectedCustomer(item.ma_kh);
                    }}
                  >
                    <span>{index}</span>
                    <span>{item.ten_kh.trim()}</span>
                    <span>{item.dien_thoai.trim()}</span>
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
              className="split__view__detail__primary relative"
            >
              {loadingDetail ? (
                <LoadingComponents
                  text={"Đang tải..."}
                  size={50}
                  loading={true}
                />
              ) : (
                <>
                  {/* Thông tin chính */}
                  <MasterInfoCustomer action={action} />
                  <div
                    className="split__view__detail__primary__items"
                    style={{ alignItems: "normal" }}
                  >
                    <Tabs
                      onTabClick={onTabChanges}
                      moreIcon={<span>...</span>}
                      style={{ minWidth: "0" }}
                    >
                      <TabPane tab="Chi tiết" key="detail">
                        {/* Thông tin chi tiết */}
                        <DetailInfoCustomer form={detailForm} action={action} />
                      </TabPane>
                      <TabPane tab="Lịch sử mua hàng" key="SOHistory">
                        <SOHistory />
                      </TabPane>
                      <TabPane tab="Lịch sử viếng thăm" key="CIHistory">
                        <CIHistory />
                      </TabPane>
                      <TabPane tab="Lịch sử phản hồi" key="TKHistory">
                        <TKHistory />
                      </TabPane>
                      <TabPane tab="Lịch sử quầy kệ" key="5">
                        third
                      </TabPane>
                      <TabPane tab="Khác" key="Other">
                        third
                      </TabPane>
                    </Tabs>
                  </div>

                  <Space className="justify-content-end pr-3">
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
                </>
              )}
            </Form>

            <CustomerCheckinHistory
              customer={currentRecord}
              loading={loadingDetail}
            />
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

export default DMSCustomerList;
