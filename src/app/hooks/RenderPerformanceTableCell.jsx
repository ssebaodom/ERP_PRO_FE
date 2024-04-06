import { DatePicker, Form, Input, InputNumber } from "antd";
import React, { memo } from "react";
import { datetimeFormat, quantityFormat } from "../Options/DataFomater";

const RenderPerformanceTableCell = ({ rowKey, column, cellData }) => {
  const { type, editable, title, key, required, width } = column;

  let node;
  switch (type) {
    case "Numeric":
      node = (
        <InputNumber
          controls={false}
          min="0"
          style={{ width: "100%" }}
          step={quantityFormat}
        />
      );
      break;
    case "Text":
      node = (
        <Input style={{ width: "100%" }} className="default_input_detail" />
      );
      break;
    case "Datetime":
      node = <DatePicker format={datetimeFormat} />;
      break;
    // case "AutoComplete":
    //   node = (
    //     <Select
    //       popupMatchSelectWidth={false}
    //       showSearch
    //       placeholder={`${title} trống`}
    //       style={{
    //         width: 200,
    //       }}
    //       onKeyDown={handleKeypress}
    //       defaultActiveFirstOption={false}
    //       showArrow={false}
    //       notFoundContent={SelectNotFound(selectLoading, selectOptions)}
    //       filterOption={false}
    //       onSearch={(e) => {
    //         handleSelectionChange(cell.controller, e);
    //       }}
    //       optionLabelProp="value"
    //       onSelect={onChangeSelection}
    //     >
    //       {SelectItemCode(selectOptions)}
    //     </Select>
    //   );

    //   break;

    default:
      node = <Input className="default_input_detail" />;
      break;
  }
  return (
    <>
      {editable ? (
        <Form.Item
          initialValue={cellData || null}
          name={`${rowKey}_${key}`}
          style={{
            width: "100%",
            margin: 0,
          }}
          rules={[
            {
              required: required,
              message: `${title} trống !`,
            },
          ]}
        >
          {node}
        </Form.Item>
      ) : (
        <Form.Item
          initialValue={cellData || null}
          name={`${rowKey}_${key}`}
          style={{
            width: "100%",
            margin: 0,
          }}
          rules={[
            {
              required: required,
              message: `${title} trống !`,
            },
          ]}
        >
          <Input
            bordered={false}
            className="BaseTable__row-cell-text p-0 Performance_table_span"
            disabled={!editable}
          />
        </Form.Item>
      )}
    </>
  );
};

export default memo(RenderPerformanceTableCell);
