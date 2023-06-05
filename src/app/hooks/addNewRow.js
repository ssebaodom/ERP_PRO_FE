import React from "react";
import dayjs from "dayjs";
import { datetimeFormat } from "../Options/DataFomater";
import { v4 as uuidv4 } from "uuid";

const addNewRow = (columns) => {
  var newRow = {};
  newRow.key = uuidv4();
  columns.map((item) => {
    switch (item.dataType) {
      case "Text":
        newRow[item.dataIndex] = "Thêm " + item.title;
        break;
      case "Numeric":
        newRow[item.dataIndex] = 0;
        break;
      case "Datetime":
        newRow[item.dataIndex] = dayjs();
        break;
      default:
        newRow[item.dataIndex] = "Thêm " + item.title;
        break;
    }
  });
  return newRow;
};

export default addNewRow;
