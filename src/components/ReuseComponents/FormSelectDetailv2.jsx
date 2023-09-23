import { Form, Input, Select } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SelectItemCode from "../../Context/SelectItemCode";
import SelectNotFound from "../../Context/SelectNotFound";
import { ApiWebLookup } from "../DMS/API";

const FormSelectDetailv2 = ({
  disable,
  form,
  label,
  keyCode,
  NameData,
  placeHolderCode,
  placeHolderName,
  controller,
  width,
  codeWidth,
  required,
  onChange,
  direction,
}) => {
  const [selectLoading, setSelectLoading] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);
  const [detailValue, setDetailValue] = useState("");

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

  useEffect(() => {
    if (NameData) setDetailValue(NameData);
  }, [NameData]);

  return (
    <div className="split__view__detail__primary__items">
      <div
        className="split__view__detail__primary__item"
        style={{
          flexDirection: `${
            direction?.toUpperCase() == "COLUMN" ? "column" : "row"
          }`,
          alignItems: `${
            direction?.toUpperCase() == "COLUMN" ? "flex-start" : "center"
          }`,
        }}
      >
        <span
          className="default_bold_label"
          style={{ width: `${width ? width : 100}px` }}
        >
          {label}
        </span>

        <div className="flex w-full gap-2">
          <Form.Item
            style={{
              width: `${codeWidth ? String(codeWidth) + "px" : "150px"}`,
              flex: "none",
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
              optionLabelProp="value"
              dropdownStyle={{ minWidth: "20%" }}
              notFoundContent={SelectNotFound(selectLoading, selectOptions)}
              onSearch={(e) => {
                handleSelectionChange(controller, e);
              }}
              onSelect={(key, item) => {
                setDetailValue(item.label);
                setSelectOptions([]);
                if (onChange) {
                  onChange(key, item);
                }
              }}
            >
              {SelectItemCode(selectOptions)}
            </Select>
          </Form.Item>
          <Input
            value={detailValue}
            disabled={true}
            className="default_disable_input"
            placeholder={placeHolderName}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(FormSelectDetailv2);
