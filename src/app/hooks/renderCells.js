import { Input, InputNumber, DatePicker, Form } from "antd";
import React from "react";
import { quantityFormat, datetimeFormat } from "../Options/DataFomater";


const renderCells = (columns, editing) => {
  let inputNode;
  switch (columns.inputType) {
    case "number":
      inputNode = <InputNumber step={quantityFormat}/>;
      break;
    case "text":
      inputNode = <Input />;
      break;
    case "datetime":
      inputNode = <DatePicker format={datetimeFormat} />;
      break;
    default:
      inputNode = <Input />;
      break;
  }
  return (
    <td>
      {editing ? (
        <Form.Item
          name={columns.dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${columns.title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        columns.children
      )}
    </td>
  );
};

export default renderCells;

