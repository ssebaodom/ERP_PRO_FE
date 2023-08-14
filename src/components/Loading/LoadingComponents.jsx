import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import PropTypes from "prop-types";
import React, { memo } from "react";
import "./Loading.css";

const LoadingComponents = ({ size, loading, text }) => {
  return (
    <div className="loading__component">
      {text ? <p>{text}</p> : <p>Không có dữ liệu</p>}
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: size ? size : 30,
            }}
            spin
          />
        }
      />
    </div>
  );
};

export default memo(LoadingComponents);

LoadingComponents.prototype = {
  size: PropTypes.number,
  loading: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
