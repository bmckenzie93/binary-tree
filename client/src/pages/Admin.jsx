import { useState, useEffect } from 'react';

export default function Admin() {
  const [datasetKey, setDatasetKey] = useState('1');
  const [treeData, setTreeData] = useState([]);

  // Flatten tree helper
  const flattenTree = (node) => {
    let result = [{ ...node, children: [] }]; // strip children
    if (node.children?.length) {
      node.children.forEach(child => {
        result = result.concat(flattenTree(child));
      });
    }
    return result;
  };

  // Fetch tree data whenever datasetKey changes
  useEffect(() => {
    fetch(`http://localhost:3001/api/tree/${datasetKey}`)
      .then(res => res.json())
      .then(data => {
        const flatData = Array.isArray(data)
          ? data.flatMap(flattenTree)
          : flattenTree(data);
        setTreeData(flatData);
      })
      .catch(err => console.error(err));
  }, [datasetKey]);

  const handleDelete = async (nodeName) => {
    if (!window.confirm(`Are you sure you want to delete "${nodeName}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/tree/node`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineage: datasetKey, nodeName })
      });

      if (res.ok) {
        setTreeData(prev => prev.filter(node => node.node !== nodeName));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = async (nodeName, updates) => {
    try {
      const res = await fetch(`http://localhost:3001/api/tree/node`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineage: datasetKey, nodeName, updates })
      });

      if (res.ok) {
        setTreeData(prev =>
          prev.map(node => (node.node === nodeName ? { ...node, ...updates } : node))
        );
      }
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <div className="dataset-selector">
        <label>Select Dataset:</label>
        <select value={datasetKey} onChange={e => setDatasetKey(e.target.value)}>
          <option value="1">Tree 1</option>
          <option value="2">Tree 2</option>
          <option value="3">Tree 3</option>
        </select>
      </div>

      <div className="cards-grid">
        {treeData.map(node => (
          <div className="card" key={node.node}>
            <h3>{node.node}</h3>
            <img src={node.image || 'https://via.placeholder.com/100'} alt={node.node} />
            <p>{node.description}</p>
            {node.link && (
              <a href={node.link} target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            )}
            {node.badge && <span className={`badge badge--${node.badge.toLowerCase()}`}>{node.badge}</span>}

            <div className="actions">
              <button onClick={() => handleDelete(node.node)}>Delete</button>
              <button onClick={() => {
                const newDesc = prompt('Enter new description:', node.description);
                if (newDesc !== null) handleEdit(node.node, { description: newDesc });
              }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
