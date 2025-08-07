import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

function Tree({ treeData, renderTree, godNodeRef, setController, headerComponent }) {
  return (
    <div className="container">
      <TransformWrapper
        minScale={0.1}
        maxScale={5}
        initialPositionY={-5000}
        initialPositionX={-5000}
        onInit={(controller) => setController(controller)}
      >
        {headerComponent}
        <TransformComponent>
          <ul id="tree">
            {renderTree(treeData, true)}
          </ul>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default Tree;
