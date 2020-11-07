import React from "react";

const DropDown = ({ label, name, dataList, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select {...rest} name={name} id={name} className="form-control">
        <option></option>
        {dataList.map((element) => (
          <option key={element}>{element}</option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default DropDown;
