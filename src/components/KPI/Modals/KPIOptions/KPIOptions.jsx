import React from "react";
import { Menu } from "antd";
import { navbarObject } from "../../../../router/routes";
import './KPIOption.css'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const KPIOptions = (props) => {
  let menuItems = navbarObject.find((item) => item.path == "KPI").children;
  const navigate = useNavigate()
  
  const handleChangePage=(item)=>{
    navigate(`/${item.key}`)
  }


  return (
    <div className="page_2_side_default_left">
      <p className="function_bar_title">Chức năng</p>
      <Menu
        mode="vertical"
        style={{background:'transparent'}}
        items={menuItems}
        selectedKeys={props.selectedKey}
        onSelect={handleChangePage}
      />
    </div>
  );
};

export default KPIOptions;
