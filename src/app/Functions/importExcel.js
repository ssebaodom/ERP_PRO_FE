import { notification } from "antd";
import * as xlsx from "xlsx";

export const handleImportExcel = (event, setData) => {
  const reader = new FileReader();
  reader.readAsBinaryString(event.target.files[0]);
  reader.onload = async (e) => {
    const data = e.target.result;
    const workbook = xlsx.read(data, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const parsedData = await xlsx.utils.sheet_to_json(sheet);
    setData(parsedData);
  };
};
