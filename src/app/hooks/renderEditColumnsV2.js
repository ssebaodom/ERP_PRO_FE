import dayjs from "dayjs";
import { formStatus } from "../../utils/constants";
import { datetimeFormat } from "../Options/DataFomater";

const renderEditColumnsV2 = (columns, action) => {
  let mergedColumns = [];
  mergedColumns = columns.map((item, index) => {
    if (!item.editable) {
      return item;
    }
    return {
      ...item,
      onCell: (record) => ({
        record,
        index,
        inputType: item.type,
        dataIndex: item.dataIndex,
        title: item.title,
        editing: action == formStatus.VIEW ? false : true,
        controller: item?.controller,
        reference: item?.reference,
        render: (data) => {
          if (item.type === "Datetime") {
            return dayjs(data).format(datetimeFormat);
          }
          return data;
        },
      }),
    };
  });
  return mergedColumns;
};

export default renderEditColumnsV2;
