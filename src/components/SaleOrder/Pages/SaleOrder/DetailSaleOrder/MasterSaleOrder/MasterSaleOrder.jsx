import { Col, Form, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formStatus } from "../../../../../../utils/constants";
import emitter from "../../../../../../utils/emitter";
import FormSelectDetailv2 from "../../../../../ReuseComponents/FormSelectDetailv2";
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
    return () => {};
  }, []);

  useEffect(() => {
    masterForm.resetFields();
  }, [JSON.stringify(initial)]);

  emitter.on("HANDLE_SALEORDER_SAVE", async () => {
    await setMasterSaleOrderInfo(await masterForm.getFieldValue());
  });

  return (
    <Form
      initialValues={initial}
      form={masterForm}
      className="relative flex flex-column gap-2"
    >
      <Row gutter={25}>
        <Col span={24} className="w-full min-w-0">
          <FormSelectDetailv2
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
    </Form>
  );
};

export default MasterSaleOrder;
