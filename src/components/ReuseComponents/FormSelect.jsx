import { Form, Select } from "antd";
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
  codeWidth,
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
    <div
      className="split__view__detail__primary__item"
      style={{
        flexDirection: `${
          direction?.toUpperCase() == "COLUMN" ? "column" : "row"
        }`,
        alignItems: `${
          direction?.toUpperCase() == "COLUMN" ? "flex-start" : "center"
        }`,
        flex: `${codeWidth ? 0 : 1}`,
      }}
    >
      <div style={{ width: `${width ? width + "px" : "auto"}`, flexShrink: 0 }}>
        <span className="default_bold_label">{label}</span>
      </div>

      <Form.Item
        className="min-w-0"
        style={{
          width: `${codeWidth ? String(codeWidth) + "px" : "100%"}`,
          flex: `${codeWidth ? 0 : 1}`,
        }}
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
          className={disable ? "default_disable_select" : "default_select"}
          showSearch
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
    </div>
  );
};

export default FormSelect;
