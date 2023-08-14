import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Dropdown, Input, Select, Space } from "antd";
import React, { memo, useState } from "react";
import LoadingComponents from "../../../../Loading/LoadingComponents";
import "../DMSCustomerList.css";

const CustomerCheckinHistory = ({ loading }) => {
  const openModalAddTask = () => {};
  const [open, setOpen] = useState(false);

  const handleOpenChange = (flag) => {
    setOpen(flag);
  };

  const handleSearch = () => {
    setOpen(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <div className="default_rectangle" style={{ gap: "10px" }}>
          <Space
            direction="horizontal"
            style={{ background: "#E2E4EE" }}
            className="default_container_rectangle full_width_space"
          >
            <Space direction="vertical" className="full_width_space">
              <span>Từ khoá</span>
              <Input
                className="default_input full_width_input"
                placeholder="Từ khoá..."
              ></Input>
            </Space>

            <Space direction="vertical" className="full_width_space">
              <span>Tag</span>
              <Select
                className="default_select full_width_select"
                defaultValue={1}
                options={[
                  { value: 1, label: "Đã xử lý" },
                  { value: 0, label: "Chưa xử lý" },
                ]}
              />
            </Space>

            <Space direction="vertical">
              <span>Thời gian</span>
              <Space>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  placeholder="Chọn ngày"
                  className="default_time_picker"
                />
                <span>-</span>
                <DatePicker
                  format={"DD/MM/YYYY"}
                  placeholder="Chọn ngày"
                  className="default_time_picker"
                />
              </Space>
            </Space>
            <Button
              className="default_primary_button"
              icon={<SearchOutlined style={{ fontSize: "16px" }} />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div className="split__view__detail__substation">
      <Space style={{ justifyContent: "space-between" }}>
        <Space>
          <Button
            style={{
              height: "30px",
              background: "var(--success)",
              color: "#fff",
            }}
            className="default_button"
            onClick={openModalAddTask}
          >
            <i className="pi pi-phone" style={{ fontSize: "1 rem" }}></i>
          </Button>
          <Button
            style={{
              height: "30px",
              background: "var(--info)",
              color: "#fff",
            }}
            className="default_button"
            onClick={openModalAddTask}
          >
            <i className="pi pi-envelope" style={{ fontSize: "1 rem" }}></i>
          </Button>
          <Button
            style={{
              height: "30px",
            }}
            className="default_warning_button"
            onClick={openModalAddTask}
          >
            <i
              className="pi pi-calendar-plus"
              style={{ fontSize: "1 rem" }}
            ></i>
          </Button>
        </Space>

        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
          onOpenChange={handleOpenChange}
          overlayClassName="filter__dropdown"
          open={open}
        >
          <Button
            style={{
              height: "30px",
              background: "var(--info)",
              color: "#fff",
              width: "fit-content",
            }}
            className="default_button"
          >
            <i className="pi pi-search" style={{ fontSize: "1 rem" }}></i>
          </Button>
        </Dropdown>
      </Space>

      <div className="customer__history relative h-full">
        {loading ? (
          <LoadingComponents size={30} text="Đang tải..." />
        ) : (
          <>
            <div
              className="default_rectangle"
              style={{ gap: "10px", boxShadow: "none" }}
            >
              <span
                className="default_header_rectangle"
                style={{ borderRadius: "4px" }}
              >
                Tháng 4/2023
              </span>
              <Space
                direction="horizontal"
                className="default_container_rectangle full_width_space"
                style={{ padding: "10px 0px" }}
              >
                <div className="group__item_3__columns">
                  <span className="group__item__tag call">Gọi điện</span>
                  <ul>
                    <li>Đòi nợ</li>
                    <li>Bởi: Mạch Hưng</li>
                  </ul>
                  <span>23/11/2001</span>
                </div>
                <div className="group__item_3__columns">
                  <span className="group__item__tag mail">Mail</span>
                  <ul>
                    <li>Đòi nợ</li>
                    <li>Bởi: Mạch Hưng</li>
                  </ul>
                  <span>23/11/2001</span>
                </div>
              </Space>
            </div>
            <div
              className="default_rectangle"
              style={{ gap: "10px", boxShadow: "none" }}
            >
              <span
                className="default_header_rectangle"
                style={{ borderRadius: "4px" }}
              >
                Tháng 5/2023
              </span>
              <Space
                direction="horizontal"
                className="default_container_rectangle full_width_space"
                style={{ padding: "10px 0px" }}
              >
                <div className="group__item_3__columns">
                  <span className="group__item__tag call">Gọi điện</span>
                  <ul>
                    <li>Đòi nợ</li>
                    <li>Bởi: Mạch Hưng</li>
                  </ul>
                  <span>23/11/2001</span>
                </div>
              </Space>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(CustomerCheckinHistory);
