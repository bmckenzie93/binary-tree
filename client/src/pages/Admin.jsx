import { useState, useEffect } from 'react';

export default function Admin() {
  const [datasetKey, setDatasetKey] = useState('1');
  const [treeData, setTreeData] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editedNode, setEditedNode] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3001/api/tree/${datasetKey}`)
      .then(res => res.json())
      .then(data => {
        setTreeData(Array.isArray(data) ? data[0] : data);
      })
      .catch(err => console.error(err));
  }, [datasetKey]);

  const flattenTree = (node) => {
    if (!node) return [];
    let nodes = [{ ...node }];
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        nodes = nodes.concat(flattenTree(child));
      });
    }
    return nodes;
  };

  const deleteNodeRecursively = (node, nodeName) => {
    if (!node || !node.children) return;
    node.children = node.children.filter(child => child.node !== nodeName);
    node.children.forEach(child => deleteNodeRecursively(child, nodeName));
  };

  const handleDelete = async (nodeName) => {
    if (!window.confirm(`Are you sure you want to delete "${nodeName}"?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/tree/node`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineage: datasetKey, nodeName })
      });

      if (res.ok) {
        if (treeData.node === nodeName) {
          setTreeData(null);
        } else {
          setTreeData(prev => {
            const newTree = { ...prev };
            deleteNodeRecursively(newTree, nodeName);
            return newTree;
          });
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEditStart = (node) => {
    setEditingNode(node.node);
    setEditedNode({ ...node });
  };

  const handleEditCancel = () => {
    setEditingNode(null);
    setEditedNode({});
  };

  const handleEditSave = async (originalNodeName) => {
    try {
      const res = await fetch(`http://localhost:3001/api/tree/node`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineage: datasetKey, nodeName: originalNodeName, updates: editedNode })
      });

      if (res.ok) {
        setTreeData(prev => {
          const updateNodeRecursively = (node) => {
            if (node.node === originalNodeName) return { ...node, ...editedNode };
            if (node.children && node.children.length > 0) {
              node.children = node.children.map(updateNodeRecursively);
            }
            return node;
          };
          return updateNodeRecursively(prev);
        });

        setEditingNode(null);
        setEditedNode({});
      }
    } catch (err) {
      console.error('Edit failed:', err);
    }
  };

  const renderNode = (node) => {
    const isEditing = editingNode === node.node;

    return (
      <div className={`card card--${node.cardType}`} key={node.node}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedNode.node}
              onChange={e => setEditedNode(prev => ({ ...prev, node: e.target.value }))}
              placeholder="Node name"
            />
            <input
              type="text"
              value={editedNode.description}
              onChange={e => setEditedNode(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
            />
            <input
              type="text"
              value={editedNode.image || ''}
              onChange={e => setEditedNode(prev => ({ ...prev, image: e.target.value }))}
              placeholder="Image URL"
            />
            <input
              type="text"
              value={editedNode.link || ''}
              onChange={e => setEditedNode(prev => ({ ...prev, link: e.target.value }))}
              placeholder="Link URL"
            />
            <input
              type="text"
              value={editedNode.badge || ''}
              onChange={e => setEditedNode(prev => ({ ...prev, badge: e.target.value }))}
              placeholder="Badge"
            />
          </>
        ) : (
          <>
            <h3>{node.node}</h3>
            <img src={node.image || 'https://via.placeholder.com/100'} alt={node.node} />
            <p>{node.description}</p>
            {node.link && <a href={node.link} target="_blank" rel="noopener noreferrer">Learn more</a>}
            {node.badge && <span className={`badge badge--${node.badge.toLowerCase()}`}>{node.badge}</span>}
          </>
        )}

        <div className="actions">
          {isEditing ? (
            <>
              <button className="btn btn-primary" onClick={() => handleEditSave(node.node)}>Save</button>
              <button className="btn btn-secondary" onClick={handleEditCancel}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => handleDelete(node.node)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => handleEditStart(node)}>Edit</button>
            </>
          )}
        </div>
      </div>
    );
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

      <div className="cards-container">
        {treeData && flattenTree(treeData).map(node => renderNode(node))}
      </div>
    </div>
  );
}
