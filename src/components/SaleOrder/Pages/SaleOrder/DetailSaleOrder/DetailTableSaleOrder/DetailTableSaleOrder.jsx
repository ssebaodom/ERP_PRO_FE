import { Form } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import {
  getAllRowKeys,
  getAllValueByRow,
} from "../../../../../../app/Functions/getTableValue";
import emitter from "../../../../../../utils/emitter";
import EditableTable from "../../../../../ReuseComponents/EditableTable/EditableTable";
import { setDetailSaleOrderInfo } from "../../../../Store/Sagas/SaleOrderActions";
import { getSaleOrderInfo } from "../../../../Store/Selector/Selector";

const DetailTableSaleOrder = () => {
  const [detailForm] = Form.useForm();
  const { action } = useSelector(getSaleOrderInfo);
  const colData = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      editable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      editable: true,
    },
  ];
  const rowData = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const handleChangedValues = (changedData) => {
    console.log(detailData);
  };

  emitter.on("HANDLE_SALEORDER_SAVE", async () => {
    const detailData = [];
    getAllRowKeys(detailForm.getFieldsValue()).map((item) => {
      return detailData.push(
        getAllValueByRow(item, detailForm.getFieldsValue(true))
      );
    });

    await setDetailSaleOrderInfo(detailData);
  });

  return (
    <Form
      form={detailForm}
      component={false}
      onValuesChange={handleChangedValues}
    >
      <EditableTable
        form={detailForm}
        action={action}
        colData={colData}
        rowData={rowData}
      />
    </Form>
  );
};

export default DetailTableSaleOrder;
