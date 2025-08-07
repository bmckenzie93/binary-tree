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
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [badge, setBadge] = useState('');

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

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    lineage: selectedLineage,
    parent,
    name,
    description,
    image,
    link,
    badge,
  };

  try {
    const response = await fetch('http://localhost:3001/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Successfully submitted!');
      console.log(data);
    } else {
      alert(`Failed: ${data.error}`);
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Something went wrong.');
  }
};


  return (
    <div className="join-page">
      <header className="join-header">
        <img src={logo} alt="Mountain Rose Herbs Logo" />
        <div className="legend">
          <p>Welcome to Mountain Rose Herbs: Herbalism Family Tree!</p>
          <p>Fill out this form to be added as a leaf on our family tree.</p>
          <p><Link to="/">View the Tree</Link>.</p>
        </div>
      </header>

      <main className="join-main">
        <form onSubmit={handleSubmit} className="join-form">
          <h2>Join a Lineage</h2>

          <div className="form-group">
            <label htmlFor="lineage-select">Select a Lineage *</label>
            <select
              id="lineage-select"
              value={selectedLineage}
              onChange={(e) => {
                setSelectedLineage(e.target.value);
                setFormVisible(false); // reset while loading
              }}
              required
            >
              <option value="">-- Choose --</option>
              <option value="one">Lineage One</option>
              <option value="two">Lineage Two</option>
              <option value="three">Lineage Three</option>
            </select>
          </div>

          {formVisible && (
            <>
              <div className="form-group">
                <label htmlFor="parent">Parent Node *</label>
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

              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Short Description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="image">Upload Image (optional)</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="link">Link (optional)</label>
                <input
                  id="link"
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

                <div className="form-group">
                    <label htmlFor="badge">Badge</label>
                    <select
                        id="badge"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                    >
                        <option value="">-- Choose Badge --</option>
                        <option value="founder">Founder</option>
                        <option value="mentor">Mentor</option>
                        <option value="student">Student</option>
                    </select>
                </div>


              <button type="submit">Submit</button>
            </>
          )}
        </form>
      </main>
    </div>
  );
};

export default Join;
