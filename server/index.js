const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Example: Submit new node to a lineage
app.post('/api/submit', (req, res) => {
const { lineage, parent, name, description, image, link, badge } = req.body;
const cardType = image ? 'primary' : 'secondary';

const newNode = {
    node: name,
    parent: parent,
    description,
    cardType,
    image,
    link,
    badge,
    children: []
};

const filePath = path.join(__dirname, 'data', `treeData${lineage}.json`);

try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Attach to parent
    const addToParent = (nodes) => {
    for (let node of nodes) {
        if (node.node === parent) {
        node.children.push(newNode);
        return true;
        } else if (node.children.length) {
        if (addToParent(node.children)) return true;
        }
    }
    return false;
    };

    const updated = addToParent(data);

    if (!updated) return res.status(404).json({ error: 'Parent not found' });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'Node added successfully' });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update tree data' });
}
});

app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
