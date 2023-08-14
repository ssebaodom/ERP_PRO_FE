import { Button } from "antd";
import PropTypes from "prop-types";
import React from "react";

const OperationColumn = ({ record, editFunction, deleteFunction }) => {
  return (
    <div className="operation_column_container">
      <Button
        onClick={(e) => {
          editFunction(record);
        }}
      >
        <i className="pi pi-pencil"></i>
      </Button>

      <Button
        onClick={(e) => {
          deleteFunction(record);
        }}
        danger
      >
        <i className="pi pi-trash"></i>
      </Button>
    </div>
  );
};

export default OperationColumn;

OperationColumn.prototype = {
  record: PropTypes.object.isRequired,
  editFunction: PropTypes.func,
  deleteFunction: PropTypes.func,
};
