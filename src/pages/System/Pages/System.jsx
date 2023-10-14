import { Tree } from "primereact/tree";
import React, { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import "./System.css";

const System = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState("");
  const [expandedKeys, setExpandedKeys] = useState({});
  const navigate = useNavigate();

  const datatest = [
    {
      key: "A",
      data: 1,
    },
    {
      key: "A.1",
      parent: "A",
      data: 1,
    },
    {
      key: "A.2",
      parent: "A",
      data: 1,
    },
    {
      key: "B",
      data: 1,
    },
    {
      key: "B.1",
      parent: "B",
      data: 1,
    },
    {
      key: "B.1.1",
      parent: "B.1",
      data: 1,
    },
    {
      key: "B.2",
      parent: "B",
      data: 1,
    },
  ];

  // const flatenTable = (item) => {
  //   var listItem = [];
  //   if (item?.children) {
  //     listItem.push({
  //       key: item.key,
  //       parent: item.parent,
  //     });
  //     item.children.map((child) => {
  //       return (listItem = [...listItem, ...flatenTable(child)]);
  //     });
  //   } else {
  //     listItem.push({
  //       key: item.key,
  //       parent: item.parent,
  //     });
  //   }
  //   return listItem;
  // };

  const data = [
    {
      key: "0",
      label: "Phân quyền",
      data: "Phân quyền",
      icon: "pi pi-unlock",
      children: [
        {
          key: "0-0-0",
          label: "Phân quyền truy cập",
          icon: "pi pi-user",
          data: "UsersPermissions",
        },
        {
          key: "0-0-1",
          label: "Phần quyền nhóm truy cập",
          icon: "pi pi-users",
          data: "GroupPermissions",
        },
        {
          key: "0-0-2",
          label: "Phần quyền đơn vị cơ sở",
          icon: "pi pi-sitemap",
          data: "UnitPermissions",
        },
      ],
    },
    {
      key: "1",
      label: "Tài khoản",
      data: "Events Folder",
      icon: "pi pi-id-card",
      children: [
        {
          key: "1-0",
          label: "Tạo tài khoản",
          icon: "pi pi-user-plus",
          data: "Accounts",
        },
      ],
    },
    {
      key: "2",
      label: "Chứng từ",
      data: "Movies Folder",
      icon: "pi pi-ticket",
      children: [
        {
          key: "2-0",
          icon: "pi pi-check-circle",
          label: "Duyệt chứng từ",
          data: "VoucherApprove",
        },
        {
          key: "2-1",
          label: "Robert De Niro",
          icon: "pi pi-fw pi-star-fill",
          data: "De Niro Movies",
          children: [
            {
              key: "2-1-0",
              label: "Goodfellas",
              icon: "pi pi-fw pi-video",
              data: "Goodfellas Movie",
            },
            {
              key: "2-1-1",
              label: "Untouchables",
              icon: "pi pi-fw pi-video",
              data: "Untouchables Movie",
            },
          ],
        },
      ],
    },
  ];

  const onSelect = (event) => {
    if (event.node.key in expandedKeys) {
      const { [event.node.key]: removedProperty, ...newExpandedKeys } =
        expandedKeys;
      setExpandedKeys({ ...newExpandedKeys });
    } else {
      setExpandedKeys({ ...expandedKeys, [event.node.key]: true });
    }

    const node = { ...event.node };
    if (!node.children) {
      console.log(node);
      setSelectedNodeKey(node.key);
      return node.data ? navigate(node.data) : "";
    } else {
      console.log(node);
      setSelectedNodeKey("");
    }
  };

  const onUnselect = (event) => {};

  return (
    <div className="page_2_side_default">
      <div className="page_2_side_default_left system__left__side">
        <Tree
          value={data}
          selectionMode="single"
          selectionKeys={selectedNodeKey}
          expandedKeys={expandedKeys}
          onSelect={onSelect}
          onToggle={(e) => {
            setExpandedKeys(e.value);
          }}
          onUnselect={onUnselect}
          filter
          filterMode="strict"
          filterPlaceholder="Tìm kiếm"
          className="system__left__navigation"
        />
      </div>
      <div className="page_2_side_default_right system__right__side">
        <Outlet />
      </div>
    </div>
  );
};

export default System;
