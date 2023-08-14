import { Checkbox, Image } from "antd";
import dayjs from "dayjs";
import React from "react";
import { datetimeFormat } from "../Options/DataFomater";

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
          if (dayjs(data).isValid()) {
            return dayjs(data).format(datetimeFormat);
          }
          return "Không có dữ liệu";
        }
        if (item.type === "Boolean") {
          return <Checkbox checked={data}></Checkbox>;
        }
        if (item.type === "Image") {
          return <Image src={data} alt={"SSE"} />;
        }
        return data;
      },
    });
  });
  return layout;
};

export default renderColumns;
