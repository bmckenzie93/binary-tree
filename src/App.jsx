import { useEffect, useRef, useState } from 'react'
import './App.scss'
import Header from './components/Header/Header.jsx'
import treeData from './assets/treeData.js'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function App() {
  const godNodeRef = useRef(null);
  const [controller, setController] = useState(null);

  const renderTree = (treeData, isRoot = false) => {
    const total = treeData.length;
    const middleIndex = Math.floor(total / 2);

    return treeData.map((item, index) => {
      const isTopRoot = isRoot && index === 0;

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
          className={`node-container${isTopRoot ? ' node-container--root' : ''} ${sideClass}`}
          key={item.node + index}
        >
          <div
            ref={isTopRoot ? godNodeRef : null}
            className={isTopRoot ? 'node node--root' : 'node'}
          >
            <h3>{item.node}</h3>
            <img src={`https://i.pravatar.cc/150?img=${index + 1}`} alt={item.node} />
            <p>{item.description}</p>
            {item.badge && <span>{item.badge}</span>}
          </div>

          {item.children?.length > 0 && (
            <ul>
              {renderTree(item.children, false)}
            </ul>
          )}
        </li>
      )
    });
  };

  useEffect(() => {
    if (controller && godNodeRef.current) {
      controller.zoomToElement(godNodeRef.current, 4, 3000);  // ✅ Adjust zoom level if needed
    }
  }, [controller]);

  return (
    <div className="container">
      <TransformWrapper
        minScale={0.5}
        maxScale={4}
        initialScale={.5}
        onInit={(controller) => setController(controller)}  // ✅ Capture the controller
      >
        <Header />
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
