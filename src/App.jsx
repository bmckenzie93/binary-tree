import { useEffect, useRef, useState } from 'react'
import './App.scss'
import Header from './components/Header/Header.jsx'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function App() {
  const [treeData, setTreeData] = useState([]);
  const [datasetKey, setDatasetKey] = useState('one');
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
      const isExpanded = expandedNodes[nodeKey] ?? false; // default closed

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
          className={`node-container${isTopRoot ? ' node-container--root' : ''} ${sideClass} ${item.children && item.children.length > 0 ? 'has-children' : ''}`}
          key={nodeKey}
        >
          <div
            ref={isTopRoot ? godNodeRef : null}
            className={`node node--${cardType} ${isTopRoot ? 'node--root' : ''} ${item.children && item.children.length > 0 ? 'has-children' : ''}`}
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

            {/* Expand/Collapse Indicator */}
            {item.children?.length > 0 && (
              <div className="toggle-icon">
                {isExpanded ? '▼' : '▶'}
              </div>
            )}
          </div>

          {/* Conditional children rendering */}
          {item.children?.length > 0 && (
            <ul className={isExpanded ? 'is-expanded' : 'is-collapsed'}>
              {renderTree(item.children, false)}
            </ul>
          )}
        </li>
      )
    });
  };

  useEffect(() => {
    const loadData = async () => {
      let dataModule;
      switch (datasetKey) {
        case 'two':
          dataModule = await import('./assets/data/treeData2');
          break;
        case 'three':
          dataModule = await import('./assets/data/treeData3');
          break;
        case 'one':
        default:
          dataModule = await import('./assets/data/treeData1');
      }
      setTreeData(dataModule.default);
    };

    loadData();
  }, [datasetKey]);

  useEffect(() => {
    if (controller && godNodeRef.current) {
      controller.zoomToElement(godNodeRef.current, 1, 2000);  // ✅ Adjust zoom level if needed
    }
  }, [controller]);

  return (
    <div className="container">
      {/* <Form /> */}

      <TransformWrapper
        minScale={0.1}
        maxScale={5}
        initialScale={.1}
        initialPositionY={-5000}
        initialPositionX={-5000}
        onInit={(controller) => setController(controller)}  // ✅ Capture the controller
      >
        <Header onSelectDataset={setDatasetKey} />
        <TransformComponent>
          <ul id="tree">
            {renderTree(treeData, true)}
          </ul>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default App;
