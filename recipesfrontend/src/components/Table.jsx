import React from "react";

const Table = ({ data, onIngredientSelect, isChecked }) => {
  
  return (
    <div className="overflow-x-auto py-2">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Category</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ingredient) => (
            <tr key={ingredient.id}>
              <th>{ingredient.id}</th>
              <td>{ingredient.name}</td>
              <td>{ingredient.category}</td>
              <td>
                <input
                  id={ingredient.name}
                  value={ingredient.name}
                  type="checkbox"
                  className="checkbox"
                  onChange={() => onIngredientSelect(ingredient.name)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
