import { Form, Select, Space } from "antd";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SelectItemCode from "../../Context/SelectItemCode";
import SelectNotFound from "../../Context/SelectNotFound";
import { ApiWebLookup } from "../DMS/API";

const FormSelect = ({
  disable,
  form,
  label,
  keyCode,
  placeHolderCode,
  controller,
  width,
  required,
  onChange,
  direction,
}) => {
  const [selectLoading, setSelectLoading] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);

  const lookupData = (item) => {
    setSelectLoading(true);
    ApiWebLookup({
      userId: "1",
      controller: item.controller,
      pageIndex: 1,
      FilterValueCode: item.value.trim(),
    }).then((res) => {
      const resOptions = res.data.map((item) => {
        return {
          value: item.code.trim(),
          label: item.name.trim(),
        };
      });
      setSelectLoading(false);
      setSelectOptions([...resOptions]);
    });
  };

  const handleSelectionChange = useDebouncedCallback((actions, value) => {
    lookupData({ controller: actions, value: value });
  }, 600);

  return (
    <Space
      className="min-h-0"
      direction={direction ? direction : "vertical"}
      style={{
        flex: `${width ? "none" : "1"}`,
        width: `${width ? String(width) + "px" : "100%"}`,
      }}
    >
      <span className="default_bold_label">{label}</span>
      <Form.Item
        name={keyCode}
        rules={[
          {
            required: required ? true : false,
            message: `Điền ${label}`,
          },
        ]}
      >
        <Select
          disabled={disable}
          className={disable ? "default_disable_select" : ""}
          showSearch
          style={{ width: `${width ? String(width) + "px" : "100%"}` }}
          placeholder={placeHolderCode}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          optionLabelProp="label"
          dropdownStyle={{ minWidth: "20%" }}
          notFoundContent={SelectNotFound(selectLoading, selectOptions)}
          onSearch={(e) => {
            handleSelectionChange(controller, e);
          }}
          onSelect={(key, item) => {
            if (onChange) {
              onChange(key, item);
            }
          }}
        >
          {SelectItemCode(selectOptions)}
        </Select>
      </Form.Item>
    </Space>
  );
};

export default FormSelect;
