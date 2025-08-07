import { useState } from 'react';

const Form = () => {
    const [parentNode, setParentNode] = useState('')
    const [nodeName, setNodeName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [badge, setBadge] = useState('')

    const handleSubmit = e => {
        e.preventDefault()

        const newNode = {
            node: nodeName,
            description,
            image,
            badge,
            children: []
        }

        onAddNode(parentNode, newNode)

        setParentNode('')
        setNodeName('')
        setDescription('')
        setImage('')
        setBadge('')
    }

    return (
        <form onSubmit={handleSubmit}>
            {/*  */}
            <label>Parent Node</label>
            <select>
                <option value="">Option</option>
                <option value="">Option</option>
                <option value="">Option</option>
            </select>
        </form>
    )
}

export default Form