import { Routes, Route } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Tree from './pages/Tree.jsx';
import Join from './pages/Join.jsx';
import './App.scss';
import Header from './components/Header/Header.jsx';

function App() {
  const [treeData, setTreeData] = useState([]);
  const [datasetKey, setDatasetKey] = useState('1');
  const godNodeRef = useRef(null);
  const [controller, setController] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});

  const toggleNode = (key) => {
    setExpandedNodes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderTree = (treeData, isRoot = false) => {
    const total = treeData.length;
    const middleIndex = Math.floor(total / 2);

    return treeData.map((item, index) => {
      const isTopRoot = isRoot && index === 0;
      const cardType = item.cardType || 'primary';
      const nodeKey = item.node + index;
      const isExpanded = expandedNodes[nodeKey] ?? false;

      let sideClass = '';
      if (total === 1) {
        sideClass = 'side-center';
      } else if (total % 2 === 0) {
        sideClass = index < total / 2 ? 'side-left' : 'side-right';
      } else {
        if (index < middleIndex) {
          sideClass = 'side-left';
        } else if (index > middleIndex) {
          sideClass = 'side-right';
        } else {
          sideClass = 'side-center';
        }
      }

      return (
        <li
          className={`node-container${isTopRoot ? ' node-container--root' : ''} ${sideClass} ${item.children?.length ? 'has-children' : ''}`}
          key={nodeKey}
        >
          <div
            ref={isTopRoot ? godNodeRef : null}
            className={`node node--${cardType} ${isTopRoot ? 'node--root' : ''} ${item.children?.length ? 'has-children' : ''}`}
            onClick={() => item.children?.length && toggleNode(nodeKey)}
          >
            <h3>{item.node}</h3>

            {cardType === 'primary' && (
              <>
                <img src={`https://i.pravatar.cc/150?img=${index + 1}`} alt={item.node} />
                <p>
                  {item.description}
                  {item.link && (
                    <>
                      <br />
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="learn-more"
                      >
                        Learn more
                      </a>
                    </>
                  )}
                </p>
              </>
            )}

            {cardType === 'secondary' && (
              <p>
                {item.description}
                {item.link && (
                  <>
                    <br />
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="learn-more"
                    >
                      Learn more
                    </a>
                  </>
                )}
              </p>
            )}

            {item.badge && <span>{item.badge}</span>}

            {item.children?.length > 0 && (
              <div className="toggle-icon">
                {isExpanded ? '▼' : '▶'}
              </div>
            )}
          </div>

          {item.children?.length > 0 && (
            <ul className={isExpanded ? 'is-expanded' : 'is-collapsed'}>
              {renderTree(item.children, false)}
            </ul>
          )}
        </li>
      );
    });
  };

  // FETCH DATA FROM CLIENT FILES
  // useEffect(() => {
  //   const loadData = async () => {
  //     let dataModule;
  //     switch (datasetKey) {
  //       case 'two':
  //         dataModule = await import('./assets/data/treeData2.js');
  //         break;
  //       case 'three':
  //         dataModule = await import('./assets/data/treeData3.js');
  //         break;
  //       case 'one':
  //       default:
  //         dataModule = await import('./assets/data/treeData1.js');
  //     }
  //     setTreeData(dataModule.default);
  //   };

  //   loadData();
  // }, [datasetKey]);

  // FETCH DATA FROM SERVER
  useEffect(() => {
  const fetchTreeData = async () => {
    if (!datasetKey) return;

    try {
      const response = await fetch(`http://localhost:3001/api/tree/${datasetKey}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTreeData(data);
    } catch (error) {
      console.error('Failed to fetch tree data:', error);
      setTreeData([]); // Optional: clear on error
    }
  };

  fetchTreeData();
}, [datasetKey]);


  useEffect(() => {
    if (controller && godNodeRef.current) {
      requestAnimationFrame(() => {
        controller.zoomToElement(godNodeRef.current, 1, 0);
      });
    }
  }, [treeData, controller]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Tree
            treeData={[treeData]}
            renderTree={renderTree}
            godNodeRef={godNodeRef}
            setController={setController}
            headerComponent={<Header onSelectDataset={setDatasetKey} />}
          />
        }
      />
      <Route path="/join" element={<Join />} />
    </Routes>
  );
}

export default App;
