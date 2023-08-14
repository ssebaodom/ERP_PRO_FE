import { Button, Drawer, Form, Input, Select, Space } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SelectItemCode from "../../../../../Context/SelectItemCode";
import SelectNotFound from "../../../../../Context/SelectNotFound";
import send_icon from "../../../../../Icons/send_icon.svg";
import { ApiWebLookup } from "../../../API";
const Filter = (props) => {
  const [filterForm] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [openState, setOpenState] = useState(false);

  const closeAdvanceFilter = () => {
    props.setIsOpenAdvanceFilter(false);
    filterForm.resetFields();
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

  const onSubmitForm = () => {
    const a = { ...filterForm.getFieldsValue() };

    props.onFilter(a);
  };

  const onSubmitFormFail = () => {};

  useEffect(() => {
    if (props.isOpenAdvanceFilter) {
      filterForm.getFieldInstance("customerCode").focus();
    }
  }, [JSON.stringify(props.isOpenAdvanceFilter)]);

  return (
    <Drawer
      title={`Tìm kiếm`}
      placement="right"
      size={250}
      open={props.isOpenAdvanceFilter}
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
                      filterForm.setFieldValue("customerTypeName", item.label);
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
                      filterForm.setFieldValue("customerFormName", item.label);
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
  );
};

export default memo(Filter);
