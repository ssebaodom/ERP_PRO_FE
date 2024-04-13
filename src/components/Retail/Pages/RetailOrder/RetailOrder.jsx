import React, { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { resetRetailOrder } from "../../Store/Actions/RetailOrderActions";
import { getRetailOrderState } from "../../Store/Selectors/RetailOrderSelectors";
import "./RetailOrder.css";
import RetailOrderInfo from "./RetailOrderInfo/RetailOrderInfo";

const RetailOrder = () => {
  const { listOrder, currentOrder } = useSelector(getRetailOrderState);

  useEffect(() => {
    return () => {
      resetRetailOrder();
    };
  }, []);

  return (
    <div className="p-2 h-full flex flex-column align-items-stretch">
      {listOrder.map((item) => (
        <div key={item} className={currentOrder !== item ? "hidden" : "h-full"}>
          <RetailOrderInfo orderKey={item} />
        </div>
      ))}

      {/* <div className="h-full min-h-0 flex gap-1 aaaaaaaaaaa">
        <div className="h-full min-h-0 w-full min-w-0 flex flex-column gap-1">
          <div className="h-full min-h-0 overflow-hidden">
            <Form form={itemForm} component={false} initialValues={{}}>
              <PerformanceTable selectable />
            </Form>
          </div>
          <div
            className="border-round-md flex gap-2 p-2 "
            style={{
              height: "3.15rem",
              flexShrink: 0,
              background: "aliceblue",
            }}
          >
            <Button className="default_button">
              <i
                className="pi pi-pencil warning_text_color"
                style={{ fontWeight: "bold" }}
              ></i>
            </Button>

            <Button className="default_button" danger>
              <i className="pi pi-trash" style={{ fontWeight: "bold" }}></i>
            </Button>

            <Button className="default_button">
              <i
                className="pi pi-print sub_text_color"
                style={{ fontWeight: "bold" }}
              ></i>
            </Button>

            <Button className="default_button">
              <i
                className="pi pi-angle-left sub_text_color"
                style={{ fontWeight: "bold" }}
              ></i>
            </Button>

            <Button className="default_button">
              <i
                className="pi pi-angle-right sub_text_color"
                style={{ fontWeight: "bold" }}
              ></i>
            </Button>
          </div>
        </div>
        <RetailPaidInfo />
      </div> */}
    </div>
  );
};

export default memo(RetailOrder);
