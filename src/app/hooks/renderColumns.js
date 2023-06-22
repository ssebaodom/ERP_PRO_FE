import React from "react";
import dayjs from "dayjs";
import { datetimeFormat } from "../Options/DataFomater";
import { Checkbox } from "antd";

const renderColumns = (columns) => {
  let layout = [];
  console.log(columns)
  columns.map((item, index) => {
    return layout.push({
      title: item.name,
      dataIndex: item.field,
      editable: true,
      dataType: item.type,
      render: (data) => {
        if (item.type === "Datetime") {
          return dayjs(data).format(datetimeFormat);
        }
        if (item.type === "Boolean") {
          console.log(item)
          return <Checkbox checked={data}></Checkbox>
        }
        return data;
      }
    });
  });
  return layout;
};

export default renderColumns;
