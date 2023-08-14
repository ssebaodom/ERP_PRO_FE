import React, { memo } from "react";
import { formStatus } from "../../../../../utils/constants";
import FormSelectDetail from "../../../../ReuseComponents/FormSelectDetail";

const DetailInfoCustomer = ({ form, action }) => {
  return (
    <div className="split__view__detail__group">
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Khu vực"
        keyCode="areaCode"
        keyName="areaName"
        controller="dmkhuvuc_lookup"
        form={form}
        placeHolderCode="Khu vực"
        placeHolderName="Tên khu vực"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Tỉnh"
        keyCode="provinceCode"
        keyName="provinceName"
        controller="dmtinh_lookup"
        form={form}
        placeHolderCode="Tỉnh"
        placeHolderName="Tên tỉnh"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Quận"
        keyCode="districtCode"
        keyName="districtName"
        controller="dmquan_lookup"
        form={form}
        placeHolderCode="Quận"
        placeHolderName="Tên quận"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Xã/phường"
        keyCode="wardsCode"
        keyName="wardsName"
        controller="dmphuong_lookup"
        form={form}
        placeHolderCode="Xã/phường"
        placeHolderName="Tên xã/phường"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Nguồn"
        keyCode="resourceCode"
        keyName="resourceName"
        controller="dmnguonkh_lookup"
        form={form}
        placeHolderCode="Nguồn"
        placeHolderName="Tên nguồn"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Đơn vị"
        keyCode="unitCode"
        keyName="unitName"
        controller="dmdvcs_lookup"
        form={form}
        placeHolderCode="Đơn vị"
        placeHolderName="Tên đơn vị"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Phân loại"
        keyCode="typeCode"
        keyName="typeName"
        controller="dmphanloai_lookup"
        form={form}
        placeHolderCode="Phân loại"
        placeHolderName="Tên phân loại"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Hình thức"
        keyCode="formCode"
        keyName="formName"
        controller="dmhinhthuc_lookup"
        form={form}
        placeHolderCode="Hình thức"
        placeHolderName="Tên hình thức"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Tuyến"
        keyCode="tourCode"
        keyName="tourName"
        controller="dmtuyen_lookup"
        form={form}
        placeHolderCode="Tuyến"
        placeHolderName="Tên tuyến"
      />
      <FormSelectDetail
        disable={action == formStatus.VIEW ? true : false}
        label="Nhân viên"
        keyCode="employeeCode"
        keyName="employeeName"
        controller="dmnvbh_lookup"
        form={form}
        placeHolderCode="Nhân viên"
        placeHolderName="Tên nhân viên"
      />
    </div>
  );
};

export default memo(DetailInfoCustomer);
