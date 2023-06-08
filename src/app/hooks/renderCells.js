import { Input, InputNumber, DatePicker, Form, Select } from "antd";
import React from "react";
import { quantityFormat, datetimeFormat } from "../Options/DataFomater";

const renderCells = (cell) => {
  let inputNode;
  switch (cell.inputType) {
    case "Numeric":
      inputNode = <InputNumber step={quantityFormat} />;
      break;
    case "Text":
      inputNode = <Input className="default_input_detail" />;
      break;
    case "Datetime":
      inputNode = <DatePicker format={datetimeFormat} />;
      break;
    case "AutoComplete":
      inputNode = (
        <Select
          showSearch
          placeholder={`Vui lòng nhập ${cell.title}`}
          style={{
            width: 200,
          }}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={cell.searchItem}
          onChange={cell.handleChange}
          options={(cell.lookupData|| []).map((d) => ({
            value: d.value,
            label: d.text,
          }))}
        />
      );

      break;

    default:
      inputNode = <Input className="default_input_detail" />;
      break;
  }
  return (
    <td>
      {cell.editing ? (
        <Form.Item
          name={`${cell.record.key}_${cell.dataIndex}`}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${cell.title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        cell.children
      )}
    </td>
  );
};

export default renderCells;