import React, { useEffect, useState } from "react";
import BaseTable, { AutoResizer, Column } from "react-base-table";
import "react-base-table/styles.css";
import no_file from "../../../Icons/no_file.svg";
import "./PerformanceTable.css";
import SelectCell from "./SelectCell/SelectCell";
import SelectCellHeader from "./SelectCell/SelectCellHeader";

const PerformanceTable = ({
  selectable,
  columns,
  data,
  onSelectedRowKeyChange,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSelectionChange = ({ selected, rowKey, rowData, rowIndex }) => {
    const selectedRow = [...selectedRowKeys];

    if (selected) {
      if (!selectedRowKeys.includes(rowKey)) selectedRow.push(rowKey);
    } else {
      const index = selectedRowKeys.indexOf(rowKey);
      if (index > -1) {
        selectedRow.splice(index, 1);
      }
    }

    setSelectedRowKeys(selectedRow);
  };

  const handleSelectAll = ({ selected }) => {
    if (selected) {
      const allKeys = data.map((item) => item.id);
      setSelectedRowKeys(allKeys);
    } else setSelectedRowKeys([]);
  };

  const renderSelectedRowsClass = ({ rowData, rowIndex }) => {
    const checked = selectedRowKeys?.includes(rowData?.id);
    return checked ? "performance-row-selected" : "";
  };

  useEffect(() => {
    if (onSelectedRowKeyChange) {
      onSelectedRowKeyChange(selectedRowKeys);
    }
    return () => {};
  }, [selectedRowKeys]);

  const _columns = [
    {
      width: selectable ? 40 : 0,
      flexShrink: 0,
      resizable: false,
      headerRenderer: ({ column }) => <SelectCellHeader column={column} />,
      cellRenderer: ({ rowData, rowIndex, column }) => (
        <SelectCell rowData={rowData} rowIndex={rowIndex} column={column} />
      ),
      key: "__selection__",
      frozen: Column.FrozenDirection.LEFT,
      onChange: handleSelectionChange,
      onSelectAll: handleSelectAll,
      dataLength: data.length,
      selectedRowKeys,
    },
    {
      width: 40,
      flexShrink: 0,
      resizable: false,
      title: "STT",
      cellRenderer: ({ rowIndex, rowData }) => {
        const { id } = rowData;

        const newIndex = data.findIndex((item) => item.id === id);
        return newIndex + 1;
      },
      key: "__rowNumber__",
      frozen: Column.FrozenDirection.LEFT,
    },
    ...columns,
  ];

  return (
    <AutoResizer>
      {({ width, height }) => (
        <BaseTable
          overscanRowCount={30}
          emptyRenderer={
            <div className="abs_center">
              <img src={no_file} />
              <div className="text-center">
                <b className="sub_text_color">Không có dữ liệu</b>
              </div>
            </div>
          }
          headerClassName={"performance_table_header"}
          fixed
          width={width}
          height={height}
          columns={_columns}
          data={[...data].reverse()}
          rowClassName={renderSelectedRowsClass}
        />
      )}
    </AutoResizer>
  );
};

export default PerformanceTable;
