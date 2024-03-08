import { Button, Col, Divider, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingComponents from "../../../../Loading/LoadingComponents";
import { setSaleOrderCurrentStep } from "../../../Store/Sagas/SaleOrderActions";
import { getSaleOrderInfo } from "../../../Store/Selector/Selector";
import DetailTableSaleOrder from "./DetailTableSaleOrder/DetailTableSaleOrder";
import MasterSaleOrder from "./MasterSaleOrder/MasterSaleOrder";
import ShippingAndPayment from "./ShippingAndPayment/ShippingAndPayment";

const stepItems = [
  {
    key: 0,
    title: "Thông tin đơn hàng",
  },
  {
    key: 1,
    title: "Thanh toán và vận chuyển",
  },
];

const DetailSaleOrder = () => {
  const { loading, currentStep } = useSelector(getSaleOrderInfo);

  const [stepButtonDisable, setStepButtonDisable] = useState({
    nextDisabled: true,
    prevDisabled: false,
  });

  const onStepChange = (value) => {
    setSaleOrderCurrentStep(value);
  };

  useEffect(() => {
    setStepButtonDisable({
      nextDisabled: currentStep == stepItems.length - 1 ? true : false,
      prevDisabled: currentStep == 0 ? true : false,
    });
    return () => {
      setStepButtonDisable({ nextDisabled: true, prevDisabled: false });
    };
  }, [currentStep]);

  return (
    <Col span={14} className="flex flex-column h-full min-h-0 gap-3">
      <div
        className="w-full h-full min-h-0 p-2 border-round-lg flex flex-column gap-2 relative"
        style={{ background: "white" }}
      >
        {loading ? (
          <LoadingComponents size={50} loading={loading} text={"Đang tải"} />
        ) : (
          <>
            <div className="flex gap-2 align-items-center gap-5">
              <Button
                className="default_button"
                disabled={stepButtonDisable.prevDisabled}
                onClick={() => {
                  onStepChange(currentStep - 1);
                }}
              >
                <i
                  className="pi pi-angle-left sub_text_color"
                  style={{ fontWeight: "bold" }}
                ></i>
              </Button>

              <Steps
                onChange={onStepChange}
                size="small"
                current={currentStep}
                items={stepItems}
              />

              <Button
                className="default_button"
                disabled={stepButtonDisable.nextDisabled}
                onClick={() => {
                  onStepChange(currentStep + 1);
                }}
              >
                <i
                  className="pi pi-angle-right sub_text_color"
                  style={{ fontWeight: "bold" }}
                ></i>
              </Button>
            </div>

            <div className="h-full min-h-0">
              <div
                style={{
                  display: `${
                    stepItems[currentStep].key == 0 ? "flex" : "none"
                  }`,
                }}
                className="h-full min-h-0 flex-column"
              >
                <MasterSaleOrder />
                <Divider />
                <DetailTableSaleOrder />
              </div>
              <div
                className="h-full min-h-0"
                style={{
                  display: `${
                    stepItems[currentStep].key == 1 ? "block" : "none"
                  }`,
                }}
              >
                <ShippingAndPayment />
              </div>
            </div>
          </>
        )}
      </div>
    </Col>
  );
};

export default DetailSaleOrder;
