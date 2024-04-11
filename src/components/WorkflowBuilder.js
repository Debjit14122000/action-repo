import React, { useState, useEffect } from 'react';
import ReactFlow, { Handle, addEdge, Controls } from 'react-flow-renderer';
import FilterDataNode from './nodes/FilterDataNode';
import WaitNode from './nodes/WaitNode';
import ConvertFormatNode from './nodes/ConvertFormatNode';
import SendPostRequestNode from './nodes/SendPostRequestNode';
import axios from 'axios';
axios.get('/api/users')
  .then(response => {
    // Handle successful response
    console.log(response.data);
  })
  .catch(error => {
    // Handle error
    console.error('Error fetching data:', error);
  });

const WorkflowBuilder = () => {
  const [elements, setElements] = useState([]); // State to store workflow elements
  const [error, setError] = useState(null); // State to store error information
  const [history, setHistory] = useState([]); // State to store history of workflow elements
  const [redoHistory, setRedoHistory] = useState([]); // State to store history of undone changes

  useEffect(() => {
    const savedWorkflow = JSON.parse(localStorage.getItem('workflow'));
    if (savedWorkflow) setElements(savedWorkflow);
  }, []);

  const saveWorkflow = () => {
    if (validateWorkflow()) {
      localStorage.setItem('workflow', JSON.stringify(elements));
      setError(null); // Reset error state if validation succeeds
    } else {
      setError('Workflow validation failed. Please make sure all nodes are connected.');
    }
  };

  const validateWorkflow = () => {
    // Check if each node has at least one incoming and outgoing connection
    const nodes = elements.filter(el => el.type !== 'input');
    return nodes.every(node => node.data && node.data.connections && node.data.connections.length > 0);
  };

  const onConnect = (params) => {
    setHistory([...history, elements]); // Save current state to history
    setElements((els) => addEdge(params, els));
    setRedoHistory([]); // Clear redo history when making a new change
  };

  const undo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoHistory([...redoHistory, elements]); // Save current state to redo history
      setElements(previousState);
      setHistory(history.slice(0, -1)); // Remove last state from history
      localStorage.setItem('workflow', JSON.stringify(previousState)); // Update local storage with previous state
    }
  };

  const redo = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];
      setHistory([...history, elements]); // Save current state to history
      setElements(nextState);
      setRedoHistory(redoHistory.slice(0, -1)); // Remove last state from redo history
      localStorage.setItem('workflow', JSON.stringify(nextState)); // Update local storage with next state
    }
  };

  const handleNodeColorChange = (id, color) => {
    setElements((els) =>
      els.map(el => {
        if (el.id === id) {
          return {
            ...el,
            style: {
              ...el.style,
              backgroundColor: color
            }
          };
        }
        return el;
      })
    );
  };

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={saveWorkflow}>Save Workflow</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <ReactFlow
        elements={elements}
        onConnect={onConnect}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Controls /> {/* Add Controls for zooming and panning */}
        <Handle type="target" position="left" style={{ background: '#555' }} />
        <div style={{ background: '#eee', padding: '10px' }}>Start</div>
        <Handle type="source" position="right" style={{ background: '#555' }} />
        <FilterDataNode id="filterDataNode" handleNodeColorChange={handleNodeColorChange} />
        <WaitNode id="waitNode" handleNodeColorChange={handleNodeColorChange} />
        <ConvertFormatNode id="convertFormatNode" handleNodeColorChange={handleNodeColorChange} />
        <SendPostRequestNode id="sendPostRequestNode" handleNodeColorChange={handleNodeColorChange} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowBuilder;





// // export default WorkflowBuilder;
// import React, { useState, useEffect } from 'react';
// import ReactFlow, { Handle, addEdge, Controls } from 'react-flow-renderer';
// import FilterDataNode from './nodes/FilterDataNode';
// import WaitNode from './nodes/WaitNode';
// import ConvertFormatNode from './nodes/ConvertFormatNode';
// import SendPostRequestNode from './nodes/SendPostRequestNode';

// const WorkflowBuilder = () => {
//   const [elements, setElements] = useState([]); // State to store workflow elements
//   const [error, setError] = useState(null); // State to store error information

//   useEffect(() => {
//     const savedWorkflow = JSON.parse(localStorage.getItem('workflow'));
//     if (savedWorkflow) setElements(savedWorkflow);
//   }, []);

//   const saveWorkflow = () => {
//     if (validateWorkflow()) {
//       localStorage.setItem('workflow', JSON.stringify(elements));
//       setError(null); // Reset error state if validation succeeds
//     } else {
//       setError('Workflow validation failed. Please make sure all nodes are connected.');
//     }
//   };

//   const validateWorkflow = () => {
//     // Check if each node has at least one incoming and outgoing connection
//     const nodes = elements.filter(el => el.type !== 'input');
//     return nodes.every(node => node.data && node.data.connections && node.data.connections.length > 0);
//   };

//   const onConnect = (params) => setElements((els) => addEdge(params, els));
//   const onElementsRemove = (elementsToRemove) =>
//     setElements((els) => els.filter((el) => !elementsToRemove.includes(el)));

//   const handleNodeColorChange = (id, color) => {
//     setElements((els) =>
//       els.map(el => {
//         if (el.id === id) {
//           return {
//             ...el,
//             style: {
//               ...el.style,
//               backgroundColor: color
//             }
//           };
//         }
//         return el;
//       })
//     );
//   };

//   return (
//     <div style={{ height: '80vh', width: '100%' }}>
//       {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message if error state is set */}
//       <button onClick={saveWorkflow}>Save Workflow</button>
//       <ReactFlow
//         elements={elements}
//         onConnect={onConnect}
//         onElementsRemove={onElementsRemove}
//         snapToGrid={true}
//         snapGrid={[15, 15]}
//       >
//         <Controls /> {/* Add Controls for zooming and panning */}
//         <Handle type="target" position="left" style={{ background: '#555' }} />
//         <div style={{ background: '#eee', padding: '10px' }}>Start</div>
//         <Handle type="source" position="right" style={{ background: '#555' }} />
//         <FilterDataNode id="filterDataNode" handleNodeColorChange={handleNodeColorChange} />
//         <WaitNode id="waitNode" handleNodeColorChange={handleNodeColorChange} />
//         <ConvertFormatNode id="convertFormatNode" handleNodeColorChange={handleNodeColorChange} />
//         <SendPostRequestNode id="sendPostRequestNode" handleNodeColorChange={handleNodeColorChange} />
//       </ReactFlow>
//     </div>
//   );
// };

// export default WorkflowBuilder;
