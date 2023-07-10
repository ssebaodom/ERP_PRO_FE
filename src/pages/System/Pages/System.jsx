import React, { useState } from "react";
import { Tree } from "primereact/tree";

import "./System.css";
import { Toast } from "primereact/toast";
import { Outlet, useNavigate } from "react-router-dom";

const System = () => {
  const [selectedNodeKey, setSelectedNodeKey] = useState("");
  const [expandedKeys, setExpandedKeys] = useState({});
  const navigate = useNavigate();

  const data = [
    {
      key: "0",
      label: "Hệ thống",
      data: "Hệ thống",
      icon: "pi pi-fw pi-inbox",
      children: [
        {
          key: "0-0-0",
          label: "Phân quyền truy cập",
          icon: "pi pi-fw pi-file",
          data: "UsersPermissions",
 
        },
        {
          key: "0-0-1",
          label: "Resume.doc",
          icon: "pi pi-fw pi-file",
          data: "UsersPermissions",
 
        },
        {
          key: "0-1",
          label: "Home",
          data: "Home Folder",
          icon: "pi pi-fw pi-home",
          children: [
            {
              key: "0-1-0",
              label: "Invoices.txt",
              icon: "pi pi-fw pi-file",
              data: "UsersPermissions",
            },
          ],
        },
      ],
    },
    {
      key: "1",
      label: "Events",
      data: "Events Folder",
      icon: "pi pi-fw pi-calendar",
      children: [
        {
          key: "1-0",
          label: "Meeting",
          icon: "pi pi-fw pi-calendar-plus",
          data: "Meeting",
        },
        {
          key: "1-1",
          label: "Product Launch",
          icon: "pi pi-fw pi-calendar-plus",
          data: "Product Launch",
        },
        {
          key: "1-2",
          label: "Report Review",
          icon: "pi pi-fw pi-calendar-plus",
          data: "Report Review",
        },
      ],
    },
    {
      key: "2",
      label: "Movies",
      data: "Movies Folder",
      icon: "pi pi-fw pi-star-fill",
      children: [
        {
          key: "2-0",
          icon: "pi pi-fw pi-star-fill",
          label: "Al Pacino",
          data: "Pacino Movies",
          children: [
            {
              key: "2-0-0",
              label: "Scarface",
              icon: "pi pi-fw pi-video",
              data: "Scarface Movie",
            },
            {
              key: "2-0-1",
              label: "Serpico",
              icon: "pi pi-fw pi-video",
              data: "Serpico Movie",
            },
          ],
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
