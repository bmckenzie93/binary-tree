import React from 'react'

const Tree = ({children}) => {
  return (
    <div className='tree' id='tree'>
        <div className="node-container">
            <div className="node node--root">

            </div>
        </div>

        <div className="node-container">
            <div className="node"></div>
        </div>
    </div>
  )
}

export default Tree