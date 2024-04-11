// FilterDataNode.js

import React from 'react';
import { Handle } from 'react-flow-renderer';

const FilterDataNode = () => {
  return (
    <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '120px' }}>
      <Handle type="source" position="right" style={{ background: '#555' }} />
      <div>Filter Data</div>
      <Handle type="target" position="left" style={{ background: '#555' }} />
    </div>
  );
};

export default FilterDataNode;
