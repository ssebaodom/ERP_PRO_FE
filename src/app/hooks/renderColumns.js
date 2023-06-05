import React from "react";
import dayjs from "dayjs";
import { datetimeFormat } from "../Options/DataFomater";

const renderColumns = (columns) => {
  let layout = [];
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
        return data;
      }
    });
  });
  return layout;
};

export default renderColumns;
