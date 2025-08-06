import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/mrh-logo.webp';

const Join = () => {
  const [selectedLineage, setSelectedLineage] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [parent, setParent] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cardType, setCardType] = useState('primary');

  useEffect(() => {
    const loadData = async () => {
      if (!selectedLineage) return;

      let dataModule;
      switch (selectedLineage) {
        case 'one':
          dataModule = await import('../assets/data/treeData1.js');
          break;
        case 'two':
          dataModule = await import('../assets/data/treeData2.js');
          break;
        case 'three':
          dataModule = await import('../assets/data/treeData3.js');
          break;
        default:
          return;
      }

      setTreeData(flattenTree(dataModule.default));
      setFormVisible(true);
    };

    loadData();
  }, [selectedLineage]);

  const flattenTree = (nodes) => {
    let result = [];
    nodes.forEach((node) => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children));
      }
    });
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Node Data:', {
      lineage: selectedLineage,
      parent,
      name,
      description,
      cardType,
    });
    alert('Submission captured in console. Hook up to save logic as needed.');
  };

  return (
    <div className="join-page">
      <header>
        <img src={logo} alt="Mountain Rose Herbs Logo" />
        <div className="legend">
          <p>Welcome to Mountain Rose Herbs: Herbalism Family Tree!</p>
          <p>Fill out this form to be added as a leaf on our family tree.</p>
          <p><Link to="/">View the Tree</Link>.</p>
        </div>
      </header>

      <main>
        <label htmlFor="lineage-select">Select a lineage:</label>
        <select
          id="lineage-select"
          value={selectedLineage}
          onChange={(e) => {
            setSelectedLineage(e.target.value);
            setFormVisible(false); // Hide form while loading
          }}
        >
          <option value="">-- Choose --</option>
          <option value="one">Lineage One</option>
          <option value="two">Lineage Two</option>
          <option value="three">Lineage Three</option>
        </select>

        {formVisible && (
          <form onSubmit={handleSubmit} className="join-form">
            <div>
              <label htmlFor="parent">Parent Node:</label>
              <select
                id="parent"
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                required
              >
                <option value="">-- Select Parent --</option>
                {treeData.map((node, index) => (
                  <option key={index} value={node.node}>
                    {node.node}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="name">Your Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="description">Short Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label htmlFor="cardType">Card Type:</label>
              <select
                id="cardType"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
              </select>
            </div>

            <button type="submit">Submit</button>
          </form>
        )}
      </main>
    </div>
  );
};

export default Join;
