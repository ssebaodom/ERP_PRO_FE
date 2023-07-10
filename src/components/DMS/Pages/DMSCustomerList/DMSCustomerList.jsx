import React from "react";
import "./DMSCustomerList.css";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tabs,
  TimePicker,
} from "antd";
import { PlusOutlined, SyncOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ModalAddTask from "../../Modals/ModalAddTask/ModalAddTask";
import { ApiGetTourList, ApiWebLookup } from "../../API";
import edit__icon from "../../../../Icons/edit__icon.svg";
import delete__icon from "../../../../Icons/delete__icon.svg";
import ConfirmDialog from "../../../../Context/ConfirmDialog";
import ModalAddCustomerResource from "../../Modals/ModalAddCustomerResource/ModalAddCustomerResource";
import TabPane from "antd/es/tabs/TabPane";
import send_icon from "../../../../Icons/send_icon.svg";
import SelectNotFound from "../../../../Context/SelectNotFound";
import SelectItemCode from "../../../../Context/SelectItemCode";
import { useDebouncedCallback } from "use-debounce";

const DMSCustomerList = () => {
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
  const [isOpenAdvanceFilter, setIsOpenAdvanceFilter] = useState(false);
  const [filterForm] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);

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
    console.log("Gọi API delete ở đây", currentItemSelected);
    handleCloseDeleteDialog();
    refreshData();
  };

  const handleCloseDeleteDialog = () => {
    setIsOpenModalDeleteTask(false);
    setCurrentItemSelected({});
  };

  const getdata = () => {
    ApiGetTourList({ ...tableParams, ...pagination }).then((res) => {});
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

  const handleChangePagintion = (currentPage, pageSize) => {
    console.log(currentPage);
  };

  const openAdvanceFilter = () => {
    setIsOpenAdvanceFilter(true);
  };

  const closeAdvanceFilter = () => {
    setIsOpenAdvanceFilter(false);
    filterForm.resetFields();
  };

  const onSubmitFormFail = () => {};

  const onSubmitForm = () => {
    const a = { ...filterForm.getFieldsValue() };
    console.log(a);
  };

  const lookupData = (item) => {
    setSelectLoading(true);
    ApiWebLookup({
      userId: "1",
      controller: item.controller,
      pageIndex: 1,
      FilterValueCode: item.value.trim(),
    }).then((res) => {
      const resOptions = res.data.map((item) => {
        return {
          value: item.code.trim(),
          label: item.name.trim(),
        };
      });
      setSelectLoading(false);
      setSelectOptions([...resOptions]);
    });
  };

  const handleSelectionChange = useDebouncedCallback((actions, value) => {
    switch (actions) {
      case "sale_employee":
        lookupData({ controller: "dmnvbh_lookup", value: value });
        break;
      case "customer":
        lookupData({ controller: "dmkh_lookup", value: value });
        break;
      case "unit":
        lookupData({ controller: "dmdvcs_lookup", value: value });
        break;
      case "ticket_type":
        lookupData({ controller: "dmloaitk_lookup", value: value });
        break;
      case "dmhinhthuc_lookup":
        lookupData({ controller: "dmhinhthuc_lookup", value: value });
        break;
      case "dmphanloai_lookup":
        lookupData({ controller: "dmphanloai_lookup", value: value });
        break;
      default:
        break;
    }
  }, 600);

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

  return (
    <div className="default_list_layout page_default">
      <div className="list__header__bar">
        <span className="default_header_label">
          Danh sách khách hàng DMS (
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
          <Button
            className="default_button"
            onClick={openModalAddTask}
            icon={<PlusOutlined className="sub_text_color" />}
          >
            <span style={{ fontWeight: "bold" }}>Nhập dữ liệu</span>
          </Button>
          <Button
            className="default_button"
            onClick={openModalAddTask}
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
                width: "210px",
                height: "30px",
              }}
              size="middle"
              className="default_input"
              placeholder="Tìm kiếm..."
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
            <div className="split__view__detail__left__item__container">
              <div className="split__view__detail__left__item split_view_item selected">
                <span>1</span>
                <span>Tên khách</span>
                <span>039920961888888888 8888888</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 2</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
              <div className="split__view__detail__left__item split_view_item">
                <span>2</span>
                <span>Mạch Hưng 3</span>
                <span>0399209666</span>
              </div>
            </div>

            <div className="split__view__pagination">
              <Pagination
                simple
                defaultCurrent={1}
                total={500}
                onChange={handleChangePagintion}
              />
            </div>
          </div>
          <div className="split__view__detail__right">
            <div className="split__view__detail__primary">
              <div className="split__view__detail__group">
                <div className="split__view__detail__primary__items">
                  <div className="split__view__detail__primary__item">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                  <div className="default_modal_1_row_items">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                </div>
                <div className="split__view__detail__primary__items">
                  <div className="split__view__detail__primary__item">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                  <div className="default_modal_1_row_items">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                </div>
                <div className="split__view__detail__primary__items">
                  <div className="split__view__detail__primary__item">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                  <div className="default_modal_1_row_items">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                </div>
                <div className="split__view__detail__primary__items">
                  <div className="split__view__detail__primary__item">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                  <div className="default_modal_1_row_items">
                    <span
                      className="default_bold_label"
                      style={{ width: "100px" }}
                    >
                      Tên loại ticket
                    </span>

                    <Input placeholder="Nhập tên loại" />
                  </div>
                </div>
              </div>
              <div
                className="split__view__detail__primary__items"
                style={{ alignItems: "normal" }}
              >
                <Tabs moreIcon={<span>...</span>} style={{ minWidth: "0" }}>
                  <TabPane tab="Chi tiết" key="1">
                    <div className="split__view__detail__group">
                      <div className="split__view__detail__primary__items">
                        <div className="split__view__detail__primary__item">
                          <span
                            className="default_bold_label"
                            style={{ width: "100px" }}
                          >
                            Tên loại ticket
                          </span>

                          <Input placeholder="Nhập tên loại" />
                        </div>
                        <div className="default_modal_1_row_items">
                          <span
                            className="default_bold_label"
                            style={{ width: "100px" }}
                          >
                            Tên loại ticket
                          </span>

                          <Input placeholder="Nhập tên loại" />
                        </div>
                      </div>
                      <div className="split__view__detail__primary__items">
                        <div className="split__view__detail__primary__item">
                          <span
                            className="default_bold_label"
                            style={{ width: "100px" }}
                          >
                            Tên loại ticket
                          </span>

                          <Input placeholder="Nhập tên loại" />
                        </div>
                        <div className="default_modal_1_row_items">
                          <span
                            className="default_bold_label"
                            style={{ width: "100px" }}
                          >
                            Tên loại ticket
                          </span>

                          <Input placeholder="Nhập tên loại" />
                        </div>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="Lịch sử mua hàng" key="2">
                    second
                  </TabPane>
                  <TabPane tab="Lịch sử viếng thăm" key="3">
                    third
                  </TabPane>
                  <TabPane tab="Lịch sử phản hồi" key="4">
                    third
                  </TabPane>
                  <TabPane tab="Lịch sử quầy kệ" key="5">
                    third
                  </TabPane>
                  <TabPane tab="Khác" key="6">
                    third
                  </TabPane>
                </Tabs>
              </div>

              <Space style={{ justifyContent: "center", alignItems: "center" }}>
                <Button className="default_subsidiary_button">Huỷ</Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="default_primary_button"
                >
                  Lưu
                </Button>
              </Space>
            </div>

            <div className="split__view__detail__substation">
              <span className="default_header_label">Chăm sóc khách hàng</span>
              <Space>
                <Button
                  style={{
                    height: "30px",
                    background: "var(--success)",
                    color: "#fff",
                  }}
                  className="default_button"
                  onClick={openModalAddTask}
                >
                  Gọi điện
                </Button>
                <Button
                  style={{
                    height: "30px",
                    background: "var(--info)",
                    color: "#fff",
                  }}
                  className="default_button"
                  onClick={openModalAddTask}
                >
                  Mail
                </Button>
                <Button
                  style={{
                    height: "30px",
                    background: "var(--warnning)",
                    color: "#fff",
                  }}
                  className="default_button"
                  onClick={openModalAddTask}
                >
                  Tạo lịch
                </Button>
              </Space>

              <div className="default_rectangle" style={{ gap: "10px" }}>
                <Space
                  direction="horizontal"
                  style={{ background: "#E2E4EE" }}
                  className="default_container_rectangle full_width_space"
                >
                  <Space direction="vertical" className="full_width_space">
                    <span>Từ khoá</span>
                    <Input
                      className="default_input full_width_input"
                      placeholder="Từ khoá..."
                    ></Input>
                  </Space>

                  <Space direction="vertical" className="full_width_space">
                    <span>Tag</span>
                    <Select
                      className="default_select full_width_select"
                      defaultValue={1}
                      options={[
                        { value: 1, label: "Đã xử lý" },
                        { value: 0, label: "Chưa xử lý" },
                      ]}
                    />
                  </Space>

                  <Space direction="vertical">
                    <span>Thời gian</span>
                    <Space>
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        style={{ width: "100%", fontSize: "11px" }}
                        placeholder="Chọn ngày"
                        className="default_time_picker"
                      />
                      <span>-</span>
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        style={{ width: "100%" }}
                        placeholder="Chọn ngày"
                        className="default_time_picker"
                      />
                    </Space>
                  </Space>
                  <Button
                    className="default_primary_button"
                    icon={<SearchOutlined style={{ fontSize: "16px" }} />}
                  >
                    Tìm kiếm
                  </Button>
                </Space>
              </div>

              <div className="customer__history">
                <div
                  className="default_rectangle"
                  style={{ gap: "10px", boxShadow: "none" }}
                >
                  <span
                    className="default_header_rectangle"
                    style={{ borderRadius: "4px" }}
                  >
                    Tháng 4/2023
                  </span>
                  <Space
                    direction="horizontal"
                    className="default_container_rectangle full_width_space"
                    style={{ padding: "10px 0px" }}
                  >
                    <div className="group__item_3__columns">
                      <span className="group__item__tag call">Gọi điện</span>
                      <ul>
                        <li>Đòi nợ</li>
                        <li>Bởi: Mạch Hưng</li>
                      </ul>
                      <span>23/11/2001</span>
                    </div>
                    <div className="group__item_3__columns">
                      <span className="group__item__tag mail">Mail</span>
                      <ul>
                        <li>Đòi nợ</li>
                        <li>Bởi: Mạch Hưng</li>
                      </ul>
                      <span>23/11/2001</span>
                    </div>
                  </Space>
                </div>
                <div
                  className="default_rectangle"
                  style={{ gap: "10px", boxShadow: "none" }}
                >
                  <span
                    className="default_header_rectangle"
                    style={{ borderRadius: "4px" }}
                  >
                    Tháng 5/2023
                  </span>
                  <Space
                    direction="horizontal"
                    className="default_container_rectangle full_width_space"
                    style={{ padding: "10px 0px" }}
                  >
                    <div className="group__item_3__columns">
                      <span className="group__item__tag call">Gọi điện</span>
                      <ul>
                        <li>Đòi nợ</li>
                        <li>Bởi: Mạch Hưng</li>
                      </ul>
                      <span>23/11/2001</span>
                    </div>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        title={`Tìm kiếm`}
        placement="right"
        size={250}
        open={isOpenAdvanceFilter}
        onClose={closeAdvanceFilter}
      >
        <Form
          form={filterForm}
          onFinishFailed={onSubmitFormFail}
          scrollToFirstError={true}
          onFinish={onSubmitForm}
          className="default_filter_form"
        >
          <div className="default_modal_container" style={{ padding: "0" }}>
            <div className="default_modal_group_items">
              <Space direction="vertical">
                <span className="default_bold_label">Mã khách hàng</span>
                <div className="default_modal_group_items">
                  <Form.Item
                    style={{
                      width: "100px",
                      flex: "none",
                    }}
                    name="customerCode"
                    initialValue={""}
                  >
                    <Select
                      showSearch
                      placeholder={`Khách hàng`}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      dropdownStyle={{ minWidth: "20%" }}
                      notFoundContent={SelectNotFound(
                        selectLoading,
                        selectOptions
                      )}
                      onSearch={(e) => {
                        handleSelectionChange("customer", e);
                      }}
                      onSelect={(key, item) => {
                        filterForm.setFieldValue("customerName", item.label);
                        setSelectOptions([]);
                      }}
                    >
                      {SelectItemCode(selectOptions)}
                    </Select>
                  </Form.Item>
                  <Form.Item name="customerName" initialValue={""}>
                    <Input placeholder="Tên khách hàng" />
                  </Form.Item>
                </div>
              </Space>
            </div>

            <div className="default_modal_group_items">
              <Space direction="vertical">
                <span className="default_bold_label">Địa chỉ</span>
                <div className="default_modal_group_items">
                  <Form.Item name="address" initialValue={""}>
                    <Input placeholder="Địa chỉ" />
                  </Form.Item>
                </div>
              </Space>
            </div>

            <div className="default_modal_group_items">
              <Space direction="vertical">
                <span className="default_bold_label">Điện thoại</span>
                <div className="default_modal_group_items">
                  <Form.Item name="phoneNumber" initialValue={""}>
                    <Input placeholder="Điện thoại" />
                  </Form.Item>
                </div>
              </Space>
            </div>

            <div className="default_modal_group_items">
              <Space direction="vertical">
                <span className="default_bold_label">Phân loại</span>
                <div className="default_modal_group_items">
                  <Form.Item
                    style={{
                      width: "100px",
                      flex: "none",
                    }}
                    name="customerType"
                    initialValue={""}
                  >
                    <Select
                      showSearch
                      placeholder={`Phân loại`}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      notFoundContent={SelectNotFound(
                        selectLoading,
                        selectOptions
                      )}
                      onSearch={(e) => {
                        handleSelectionChange("dmphanloai_lookup", e);
                      }}
                      onSelect={(key, item) => {
                        filterForm.setFieldValue(
                          "customerTypeName",
                          item.label
                        );
                        setSelectOptions([]);
                      }}
                    >
                      {SelectItemCode(selectOptions)}
                    </Select>
                  </Form.Item>
                  <Form.Item name="customerTypeName" initialValue={""}>
                    <Input
                      disabled={true}
                      className="default_disable_input"
                      placeholder="Tên loại"
                    />
                  </Form.Item>
                </div>
              </Space>
            </div>

            <div className="default_modal_group_items">
              <Space direction="vertical">
                <span className="default_bold_label">Hình thức</span>
                <div className="default_modal_group_items">
                  <Form.Item
                    style={{
                      width: "100px",
                      flex: "none",
                    }}
                    name="customerForm"
                    initialValue={""}
                  >
                    <Select
                      showSearch
                      placeholder={`Hình thức`}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      notFoundContent={SelectNotFound(
                        selectLoading,
                        selectOptions
                      )}
                      onSearch={(e) => {
                        handleSelectionChange("dmhinhthuc_lookup", e);
                      }}
                      onSelect={(key, item) => {
                        filterForm.setFieldValue(
                          "customerFormName",
                          item.label
                        );
                        setSelectOptions([]);
                      }}
                    >
                      {SelectItemCode(selectOptions)}
                    </Select>
                  </Form.Item>
                  <Form.Item name="customerFormName" initialValue={""}>
                    <Input
                      disabled={true}
                      className="default_disable_input"
                      placeholder="Tên hình thức"
                    />
                  </Form.Item>
                </div>
              </Space>
            </div>
          </div>

          <Space
            align="center"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Button
              className="default_subsidiary_button"
              onClick={closeAdvanceFilter}
            >
              Huỷ
            </Button>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="default_primary_button"
                icon={<img src={send_icon} alt="" />}
              >
                Tìm kiếm
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Drawer>
    </div>
  );
};

export default DMSCustomerList;
