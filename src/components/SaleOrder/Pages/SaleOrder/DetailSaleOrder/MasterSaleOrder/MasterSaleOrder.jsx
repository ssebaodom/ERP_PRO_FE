import { Col, Form, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formStatus } from "../../../../../../utils/constants";
import emitter from "../../../../../../utils/emitter";
import FormSelectDetail from "../../../../../ReuseComponents/FormSelectDetail";
import { setMasterSaleOrderInfo } from "../../../../Store/Sagas/SaleOrderActions";
import { getSaleOrderInfo } from "../../../../Store/Selector/Selector";

const MasterSaleOrder = () => {
  const [initial, setInitial] = useState({});
  const { action, masterInfo } = useSelector(getSaleOrderInfo);
  const [masterForm] = Form.useForm();

  const handleChange = (key, item) => {
    console.log("data", masterForm.getFieldValue());
    console.log("key", key);
    console.log("item", item);
  };

  useEffect(() => {
    setInitial(masterInfo);

    emitter.on("HANDLE_SALE_ORDER_SAVE", async () => {
      try {
        await masterForm.validateFields();
        console.log(masterForm.getFieldsValue());
        await setMasterSaleOrderInfo(await masterForm.getFieldValue());
      } catch (error) {
        return;
      }
    });
    return () => {};
  }, []);

  useEffect(() => {
    masterForm.resetFields();
  }, [JSON.stringify(initial)]);

  return (
    <Form
      initialValues={initial}
      form={masterForm}
      className="relative flex flex-column gap-2"
    >
      <Row gutter={25}>
        <Col span={24} className="w-full min-w-0">
          <FormSelectDetail
            disable={action == formStatus.VIEW ? true : false}
            label="Khách hàng"
            keyCode="ma_kh"
            keyName="ten_kh"
            controller="dmkh_lookup"
            form={masterForm}
            placeHolderCode="Mã khách"
            placeHolderName="Tên khách hàng"
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Row gutter={25}>
        <Col span={24} className="w-full min-w-0">
          <div className="default_modal_1_row_items">
            <span className="default_bold_label" style={{ width: "100px" }}>
              Ghi chú
            </span>
            <Form.Item
              className="flex-1"
              name="ghi_chu"
              rules={[{ required: false, message: "" }]}
            >
              <Input
                disabled={action === formStatus.VIEW ? true : false}
                placeholder="Nhập ghi chú"
              />
            </Form.Item>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default MasterSaleOrder;
