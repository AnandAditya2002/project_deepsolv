import React from 'react';
import './TypeFilter.css';

function TypeFilter({ types, selectedTypes, onFilter }) {
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    let updatedTypes = [...selectedTypes];
    if (checked) {
      updatedTypes.push(value);
    } else {
      updatedTypes = updatedTypes.filter((type) => type !== value);
    }
    onFilter(updatedTypes);
  };

  return (
    <div className="type-filter">
      <label>Filter by Type:</label>
      <div className="types">
        {types.map((type) => (
          <div key={type.name} className="type-option">
            <input
              type="checkbox"
              id={type.name}
              value={type.name}
              checked={selectedTypes.includes(type.name)}
              onChange={handleTypeChange}
            />
            <label htmlFor={type.name}>{type.name.charAt(0).toUpperCase() + type.name.slice(1)}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TypeFilter; 