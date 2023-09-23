import { SyncOutlined } from "@ant-design/icons";
import { Button, Select, Tooltip } from "antd";
import React, { memo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import UploadFileModal from "./UploadFileModal";

const HeaderTableBar = ({
  name,
  totalResults,
  addEvent,
  refreshEvent,
  title,
  deleteItems,
  printEvent,
  changePaginations,
  advanceFilter,
  deleteEvent,
  uploadFunction,
  fileExample,
}) => {
  const [uploadState, setUploadState] = useState(false);

  const handleCancelUpload = () => {
    setUploadState(false);
  };

  const handleOpenUpload = () => {
    setUploadState(true);
  };

  const handleSuccessUpload = (data) => {
    handleCancelUpload();
    uploadFunction(data);
  };

  useHotkeys("ctrl+i", () => {
    addEvent();
  });

  return (
    <div className="list__header__bar w-full">
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
        {deleteEvent && (
          <Button className="default_button" danger onClick={deleteEvent}>
            <i className="pi pi-trash"></i>
          </Button>
        )}

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
          <Tooltip placement="topLeft" title="Thêm mới">
            <Button className="default_button" onClick={addEvent}>
              <i className="pi pi-plus sub_text_color"></i>
            </Button>
          </Tooltip>
        )}

        {refreshEvent && (
          <Tooltip placement="topLeft" title="Làm tươi">
            <Button className="default_button" onClick={refreshEvent}>
              <SyncOutlined
                style={{ fontSize: "20px", width: "20px", height: "20px" }}
                className="sub_text_color"
              />
            </Button>
          </Tooltip>
        )}

        {printEvent && (
          <Tooltip placement="topLeft" title="In">
            <Button className="default_button" onClick={() => printEvent}>
              <i className="pi pi-print sub_text_color"></i>
            </Button>
          </Tooltip>
        )}

        {changePaginations && (
          <Tooltip placement="topLeft" title="Số bản ghi trên trang">
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
          </Tooltip>
        )}

        {advanceFilter && (
          <Tooltip placement="topLeft" title="In">
            <Button className="default_button" onClick={advanceFilter}>
              <i
                className="pi pi-filter sub_text_color"
                style={{ fontWeight: "bold" }}
              ></i>
            </Button>
          </Tooltip>
        )}

        {uploadFunction && (
          <>
            <Tooltip placement="topLeft" title="Import dữ liệu">
              <Button className="default_button" onClick={handleOpenUpload}>
                <i
                  className="pi pi-download sub_text_color"
                  style={{ fontWeight: "bold" }}
                ></i>
              </Button>
            </Tooltip>

            <UploadFileModal
              onCancel={handleCancelUpload}
              onOk={handleSuccessUpload}
              openState={uploadState}
              fileExample={fileExample}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default memo(HeaderTableBar);
