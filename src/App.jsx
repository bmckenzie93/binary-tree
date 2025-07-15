import './App.css'
import Header from './components/Header/Header.jsx'
import treeData from './assets/treeData.js'


function App() {
  const renderTree = (treeData, isRoot = false) => {
    return (
      <ul id='tree'>
        {
          treeData.map((item, index) => {
            const isTopRoot = isRoot && index === 0;

            return (
              <li className="node-container" key={item.node + index}>
                <div className={isTopRoot ? 'node node--root' : 'node'}>
                  <h3>{item.node}</h3>
                  <img src={item.image} alt={item.node} />
                  <p>{item.description}</p>
                  {item.badge && <span>{item.badge}</span>}
                </div>

                {
                  item.children && item.children.length ?
                  renderTree(item.children) :
                  ''
                }
              </li>
            )
          })
        }
      </ul>
    )
  }

  return (
    <>
      <Header />

      <div className="container">
        {renderTree(treeData, true)} 
      </div>
    </>
  )
}

export default App
