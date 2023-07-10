import {
  Avatar,
  Button,
  Drawer,
  List,
  Pagination,
  Skeleton,
  Space,
  Tree,
} from "antd";
import React from "react";
import { useState } from "react";
import "./UserPermissions.css";

const treeData = [
  {
    title: "Hệ thống",
    key: "0-0",
    children: [
      {
        title: "Quản lý tài khoản",
        key: "0-0-0",
        children: [
          {
            title: "Phân quyền truy cập",
            key: "0-0-0-0",
          },
          {
            title: "Phân quyền truy cập theo đơn vị",
            key: "0-0-0-1",
          },
          {
            title: "Phận quyền nhóm tài khoản",
            key: "0-0-0-2",
          },
        ],
      },
      {
        title: "Quản lý a",
        key: "0-0-1",
        children: [
          {
            title: "Quản lý a1",
            key: "0-0-1-0",
          },
          {
            title: "Quản lý a2",
            key: "0-0-1-1",
          },
          {
            title: "Quản lý a3",
            key: "0-0-1-2",
          },
        ],
      },
      {
        title: "duyệt",
        key: "0-0-2",
        path: "1",
      },
    ],
  },

  {
    title: "Quản lý B",
    key: "0-1",
    children: [
      {
        title: "Quản lý B1",
        key: "0-1-0-0",
      },
      {
        title: "Quản lý B2",
        key: "0-1-0-1",
      },
      {
        title: "Quản lý B3",
        key: "0-1-0-2",
      },
    ],
  },
  {
    title: "Quản lý C",
    key: "0-2",
  },
];

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 4",
  },
];

const UserPermissions = () => {
  // initials
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([
    "0-0-0",
    "0-0-1",
    "0-0-1-0",
  ]);
  const [checkedKeys, setCheckedKeys] = useState(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [loading, setLoading] = useState(false);

  //Functions

  const showDrawer = (user) => {
    setOpen(true);
    setCurrentUser(user);
  };
  const onClose = () => {
    setOpen(false);
  };

  // Permission tree
  const onExpand = (expandedKeysValue) => {
    console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    console.log("onCheck", checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  const onSelect = (selectedKeysValue, info) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };


  //Effect
  return (
    <div
      className="w-full flex gap-2 flex-column min-h-0 h-full relative"
      style={{ paddingBottom: "21px" }}
    >
      <span className="default_header_label">
        Danh sách nhân viên (<span className="sub_text_color">{0}</span>)
      </span>
      <div className="w-full list__user__container hidden_scroll_bar mb-3">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              className="user__item"
              actions={[
                <Button
                  shape="circle"
                  type="primary"
                  onClick={(e) => {
                    showDrawer(item);
                  }}
                  style={{ background: "slateblue" }}
                >
                  <i className="pi pi-ellipsis-h"></i>
                </Button>,
              ]}
            >
              <Skeleton avatar title={false} loading={false} active>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                    />
                  }
                  title={item.title}
                  description={
                    <div>
                      <p>
                        Tên đầy đủ:{" "}
                        <span className="sub_text_color">Mạch Hải Hưng</span>
                      </p>
                      <p>
                        SDT: <span className="sub_text_color">0399209618</span>{" "}
                      </p>
                      <p>
                        Mã nhân viên:
                        <span className="sub_text_color">MHTEST1</span>{" "}
                      </p>
                    </div>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>

      <Pagination
        total={50}
        showSizeChanger={false}
        className="default_pagination_bar"
      ></Pagination>

      <Drawer
        width={500}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <div className="permission__drawer__conatainer">
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <div className="flex h-full min-h-0 flex-column">
                <p
                  className="site-description-item-profile-p"
                  style={{
                    marginBottom: 24,
                  }}
                >
                  Phân quyền nhân viên:{" "}
                  <span className="sub_text_color font-bold">
                    {currentUser.title}
                  </span>
                </p>
                <Tree
                  className="permission__tree__container"
                  checkable
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                  treeData={treeData}
                />
              </div>
              <div className="text-right">
                <Space align="center">
                  <Button
                    className="default_subsidiary_button"
                    onClick={onClose}
                  >
                    Huỷ
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="default_primary_button"
                  >
                    Lưu
                  </Button>
                </Space>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default UserPermissions;
