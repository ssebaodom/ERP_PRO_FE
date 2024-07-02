import { Button, Divider, Form, InputNumber, message, Modal } from "antd";
import _ from "lodash";
import React, { memo, useEffect, useState } from "react";
import { formatCurrency } from "../../../../app/hooks/dataFormatHelper";
import { num2words, quantityFormat } from "../../../../app/Options/DataFomater";
import "./AdvanceRetailPayment.css";

const paymentType = [
  {
    label: "Tiền mặt",
    value: "tien_mat",
  },
  {
    label: "Quẹt thẻ",
    value: "tien_the",
  },
  {
    label: "Chuyển khoản",
    value: "chuyen_khoan",
  },
];

const AdvanceRetailPayment = ({ onSave, isOpen, total, onClose }) => {
  const [paymentForm] = Form.useForm();

  const [paymentSelected, setPaymentSelectede] = useState([]);
  const [paymentChangeValue, setPaymentChangeValue] = useState({
    tien_mat: 0,
    tien_the: 0,
    chuyen_khoan: 0,
  });
  const [change, setChange] = useState(0);

  const handleSelectedPayment = async (item) => {
    const currentSelectedPayment = [...paymentSelected];
    const currentChangeValue = { ...paymentChangeValue };
    if (currentSelectedPayment.includes(item.value)) {
      _.remove(currentSelectedPayment, (slt) => {
        return slt === item.value;
      });
      currentChangeValue[`${item.value}`] = 0;
    } else {
      currentSelectedPayment.push(item.value);
    }

    await setPaymentSelectede(currentSelectedPayment);
    setPaymentChangeValue(currentChangeValue);
  };

  const handlePaymentChanged = (value, allValues) => {
    const key = _.first(Object.keys(value));
    const validValue = { ...value };

    if (value[`${key}`] === null) {
      paymentForm.setFieldValue(key, 0);
      validValue[`${key}`] = 0;
    }

    const allValuesChanged = Object.values(allValues);
    setPaymentChangeValue({ ...paymentChangeValue, ...validValue });
  };

  const handleSave = () => {
    if (paymentSelected.length === 0) {
      message.warning("Chọn hình thức thanh toán");
      return;
    }

    if (change < total) {
      message.warning("Không đủ tiền thanh toán");
      return;
    }

    onSave(paymentSelected.join(","), paymentChangeValue);
  };

  useEffect(() => {
    const allValuesChanged = Object.values(paymentChangeValue);
    const totalValues = allValuesChanged.reduce(
      (sum, x) => sum + (parseFloat(x) || 0)
    );

    setChange(totalValues);
    return () => {};
  }, [paymentChangeValue, total]);

  useEffect(() => {
    paymentForm.resetFields();
    return () => {};
  }, [paymentSelected]);

  return (
    <Modal
      forceRender
      centered
      title={"Nâng cao"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      footer={[
        <div key="submit">
          <Button onClick={onClose} className="mr-2">
            Huỷ
          </Button>
          <Button type="primary" htmlType="submit" onClick={handleSave}>
            Lưu
          </Button>
        </div>,
      ]}
    >
      <p className="primary_text_color text-lg line-height-4">
        Thông tin thanh toán
      </p>
      <div className="flex mb-2 justify-content-between align-items-center">
        <span>Tổng thanh toán</span>

        <span className="primary_bold_text text-lg">
          {formatCurrency(total)}
        </span>
      </div>

      <Divider style={{ marginTop: 10, marginBottom: 10 }} />

      <p className="primary_text_color text-lg line-height-4">
        Hình thức thanh toán
      </p>

      <div className="payment_type_container flex gap-3">
        {paymentType.map((item, index) => (
          <div
            onClick={() => {
              handleSelectedPayment(item);
            }}
            key={index}
            className={`payment_type ${
              paymentSelected.includes(item.value)
                ? "payment_type_selected"
                : ""
            }`}
          >
            {item.label}
            <i className="type_payment_check pi pi-check"></i>
            <div className="type_payment_triangle"></div>
          </div>
        ))}
      </div>

      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      <p className="primary_text_color text-lg line-height-4">Tuỳ chỉnh</p>

      <Form
        initialValues={paymentChangeValue}
        form={paymentForm}
        component={false}
        onValuesChange={handlePaymentChanged}
        preserve={false}
      >
        <div>
          {paymentSelected.map((item, index) => (
            <div
              key={index}
              className="w-full flex mb-2 justify-content-between align-items-center"
            >
              <span>
                {paymentType.find((pay) => pay.value === item)?.label ||
                  "Không xác định"}
              </span>
              <Form.Item name={item}>
                <InputNumber
                  style={{ width: 120 }}
                  controls={false}
                  min="0"
                  step={quantityFormat}
                />
              </Form.Item>
            </div>
          ))}
        </div>
      </Form>

      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      <div className="flex justify-content-between align-items-center">
        <p className="primary_text_color text-lg line-height-4">Trả lại</p>
        <p className="primary_bold_text text-lg">
          {formatCurrency(change - total < 0 ? 0 : change - total)}
        </p>
      </div>
      <div className="w-full text-right">
        <p>{num2words(change - total < 0 ? 0 : change - total)}</p>
      </div>
    </Modal>
  );
};

export default memo(AdvanceRetailPayment);
