import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import React, { memo } from "react";

const HeaderTableBar = ({
  name,
  totalResults,
  addEvent,
  refreshEvent,
  title,
  deleteItems,
  printEvent,
  changePaginations,
}) => {
  return (
    <div className="list__header__bar">
      {title && (
        <span className="default_header_label">
          {title}{" "}
          {totalResults && (
            <>
              (<span className="sub_text_color">{totalResults}</span>)
            </>
          )}
        </span>
      )}

      <div className="list__header__tools">
        {deleteItems && deleteItems.count > 0 && (
          <Button
            className="default_button"
            danger
            onClick={deleteItems.delete}
            icon={<i className="pi pi-trash"></i>}
          >
            <span
              style={{ fontWeight: "bold" }}
            >{`Xoá ${deleteItems.count} ${name}`}</span>
          </Button>
        )}

        {addEvent && (
          <Button
            className="default_button"
            onClick={addEvent}
            icon={<PlusOutlined className="sub_text_color" />}
          >
            <span style={{ fontWeight: "bold" }}>Thêm mới</span>
          </Button>
        )}

        {refreshEvent && (
          <Button className="default_button" onClick={refreshEvent}>
            <SyncOutlined
              style={{ fontSize: "20px", width: "20px", height: "20px" }}
              className="sub_text_color"
            />
          </Button>
        )}

        {printEvent && (
          <Button
            className="default_button"
            onClick={() => printEvent}
            icon={<i className="pi pi-print"></i>}
          >
            <span style={{ fontWeight: "bold" }}>In</span>
          </Button>
        )}

        {changePaginations && (
          <Select
            className="w-fit default_pagination_select"
            defaultValue={10}
            suffixIcon={
              <i
                className="pi pi-table sub_text_color"
                style={{ fontSize: "16px" }}
              ></i>
            }
            onSelect={changePaginations}
            options={[
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
              { value: 200, label: "200" },
              { value: 500, label: "500" },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default memo(HeaderTableBar);
