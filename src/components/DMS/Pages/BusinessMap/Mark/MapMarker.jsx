import { ShopOutlined } from "@ant-design/icons";
import React from "react";
import { setCustomerSelected } from "../../../Store/Sagas/BusinessMapActions";
import "./MapMarker.css";

const MapMarker = ({ id, title = "", children }) => {
  const handleMarkerClick = () => {
    setCustomerSelected(id);
  };

  return (
    <div className="cursor-pointer" onClick={handleMarkerClick}>
      {children ? (
        children
      ) : (
        <div className="map__marker">
          <ShopOutlined style={{ fontSize: "20px" }} />
        </div>
      )}
    </div>
  );
};

export default MapMarker;
