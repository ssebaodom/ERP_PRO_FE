import { Form } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllRowKeys,
  getAllValueByRow,
} from "../../../../../../app/Functions/getTableValue";
import emitter from "../../../../../../utils/emitter";
import EditableTable from "../../../../../ReuseComponents/EditableTable/EditableTable";
import { getSaleOrderInfo } from "../../../../Store/Selector/Selector";

const DetailTableSaleOrder = () => {
  const [detailForm] = Form.useForm();
  const { action, detailInfo } = useSelector(getSaleOrderInfo);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  const handleChangedValues = (changedData) => {
    console.log(changedData);
  };

  const handleSave = async () => {
    await detailForm.validateFields();
    const detailData = [];
    getAllRowKeys(detailForm.getFieldsValue()).map((item) => {
      return detailData.push(
        getAllValueByRow(item, detailForm.getFieldsValue(true))
      );
    });
    console.log(detailData);
    // await setDetailSaleOrderInfo(detailData);
  };

  useEffect(() => {
    if (detailInfo?.columns?.length > 0) {
      setColumns(detailInfo?.columns || []);
      setDataSource(detailInfo?.data || []);
    }

    emitter.on("HANDLE_SALE_ORDER_SAVE", async () => {
      handleSave();
    });
    return () => {};
  }, [detailInfo]);

  return (
    <Form
      form={detailForm}
      component={false}
      onValuesChange={handleChangedValues}
    >
      <EditableTable
        form={detailForm}
        action={action}
        colData={columns}
        rowData={dataSource}
      />
    </Form>
  );
};

export default DetailTableSaleOrder;
