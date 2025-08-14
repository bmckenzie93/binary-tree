import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/mrh-logo.webp';

const Join = () => {
  const [selectedLineage, setSelectedLineage] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [parent, setParent] = useState('');
  const [node, setNode] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [badge, setBadge] = useState('');

  // Flatten nested tree structure to single array of nodes
  const flattenTree = (node) => {
    if (!node) return [];
    let nodes = [node];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        nodes = nodes.concat(flattenTree(child));
      });
    }
    return nodes;
  };

  // Fetch lineage data from backend when lineage changes
  useEffect(() => {
    if (!selectedLineage) return;

    const fetchTreeData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/tree/${selectedLineage}`);
        if (!res.ok) {
          console.error(`Failed to load lineage ${selectedLineage}`);
          return;
        }
        const data = await res.json();
        setTreeData(flattenTree(data));
      } catch (err) {
        console.error('Error fetching tree data:', err);
      }
    };

    fetchTreeData();
  }, [selectedLineage]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      lineage: selectedLineage,
      parent,
      node,
      description,
      image,
      link,
      badge,
    };

    try {
      const res = await fetch('http://localhost:3001/api/tree/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Node added successfully!');
        setParent('');
        setNode('');
        setDescription('');
        setImage('');
        setLink('');
        setBadge('');
      } else {
        console.error('Failed to add node: ', await res.text());
        console.log('Current form state:', {
        selectedLineage,
        parent,
        node,
        description,
        image,
        link,
        badge,
      });
      }
    } catch (err) {
      console.error('Error submitting node:', err);
    }
  };

return (
  <div className="join-page">
    <header>
      <img src={logo} alt="Mountain Rose Herbs Logo" />
      <div className="legend">
        <p>Add yourself to the tree with the form on this page.</p>
        <p>
          <Link to="/">Back to tree</Link>.
        </p>
      </div> 
    </header>


    <main className="join-main">
      <form className="join-form" onSubmit={handleSubmit}>
        <h2>Join a Lineage</h2>

        <div className="form-group">
          <label>Select Lineage:</label>
          <select
            value={selectedLineage}
            onChange={(e) => setSelectedLineage(e.target.value)}
          >
            <option value="">--Select--</option>
            <option value="1">Lineage 1</option>
            <option value="2">Lineage 2</option>
            <option value="3">Lineage 3</option>
          </select>
        </div>

        <div className="form-group">
          <label>Select Parent:</label>
          <select
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            disabled={!treeData.length}
          >
            <option value="">--Select--</option>
            {treeData.map((node, index) => (
              <option key={`${node.node}-${index}`} value={node.node}>
                {node.node}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input value={node} onChange={(e) => setNode(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Link:</label>
          <input value={link} onChange={(e) => setLink(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Badge:</label>
          <input value={badge} onChange={(e) => setBadge(e.target.value)} />
        </div>

        <button type="submit" disabled={!selectedLineage || !parent}>
          Add Node
        </button>
      </form>
    </main>
  </div>
);

};

export default Join;
