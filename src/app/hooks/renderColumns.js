import React from "react";
import dayjs from "dayjs";
import { datetimeFormat } from "../Options/DataFomater";
import { Checkbox } from "antd";

const renderColumns = (columns) => {
  let layout = [];
  const getAlignment = (item) => {
    if (item.type === "Datetime") {
      return "Center";
    }
    if (item.type === "Numeric") {
      return "Right";
    }
    if (item.type === "Boolean") {
      return "Center";
    }
    if (item.type === "Operation") {
      console.log(1)
      return "Center";
    }
    return "Left";
  };

  columns.map((item, index) => {
    return layout.push({
      title: item.name,
      dataIndex: item.field,
      editable: true,
      dataType: item.type,
      align: getAlignment(item),
      render: (data) => {
        if (item.type === "Datetime") {
          return dayjs(data).format(datetimeFormat);
        }
        if (item.type === "Boolean") {
          return <Checkbox checked={data}></Checkbox>;
        }
        return data;
      },
    });
  });
  return layout;
};

export default renderColumns;
