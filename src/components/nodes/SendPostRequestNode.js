// SendPostRequestNode.js

import React from 'react';
import { Handle } from 'react-flow-renderer';

const SendPostRequestNode = () => {
  return (
    <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '120px' }}>
      <Handle type="source" position="right" style={{ background: '#555' }} />
      <div>Send POST Request</div>
      <Handle type="target" position="left" style={{ background: '#555' }} />
    </div>
  );
};

export default SendPostRequestNode;
