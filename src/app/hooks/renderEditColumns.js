import React from "react";

const renderEditColumns = (columns, editingKey) => {
  const isEditing = (record) => {
    return record?.key === editingKey;
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputtype: col.dataType,
        dataindex: col.dataIndex,
        title: col.title,
        editing: isEditing(record) ? isEditing(record) : false,
      }),
    };
  });

  return mergedColumns;
};

export default renderEditColumns;
