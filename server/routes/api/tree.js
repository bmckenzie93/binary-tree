import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/:lineage', (req, res) => {
const lineage = req.params.lineage;
const filePath = path.join(__dirname, '../../data', `treeData${lineage}.json`);

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
    console.error('Failed to load tree data:', err);
    return res.status(500).json({ error: 'Could not load tree data' });
    }

    try {
    const json = JSON.parse(data);
    res.json(json);
    } catch (parseErr) {
    console.error('Invalid JSON:', parseErr);
    res.status(500).json({ error: 'Invalid JSON format' });
    }
});
});

router.post('/submit', (req, res) => {
const { lineage, parent, node, description, image, link, badge } = req.body;
const cardType = image ? 'primary' : 'secondary';

const newNode = {
    node,
    description,
    cardType,
    image,
    link,
    badge,
    children: []
};

const filePath = path.join(__dirname, '../../data', `treeData${lineage}.json`);

try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const addToParent = (nodes) => {
    for (let nodeItem of nodes) {
        if (nodeItem.node === parent) {
        nodeItem.children.push(newNode);
        return true;
        } else if (nodeItem.children.length) {
        if (addToParent(nodeItem.children)) return true;
        }
    }
    return false;
    };

    const updated = addToParent([data]);

    if (!updated) return res.status(404).json({ error: 'Parent not found' });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: 'Node added successfully' });
} catch (err) {
    console.error('Error updating tree data:', err);
    console.error('Incoming request body:', req.body);

    try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.error('Current tree data content:', fileContent);
    } catch (readErr) {
    console.error('Failed to read tree data file during error logging:', readErr);
    }

    res.status(500).json({ error: 'Failed to update tree data' });
}
});

router.put('/node', (req, res) => {
const { lineage, nodeName, updates } = req.body;
const filePath = path.join(__dirname, '../../data', `treeData${lineage}.json`);

try {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const updateNode = (nodes) => {
    for (let n of nodes) {
        if (n.node === nodeName) {
        Object.assign(n, updates);
        return true;
        }
        if (updateNode(n.children)) return true;
    }
    return false;
    };

    if (!updateNode([data])) {
    return res.status(404).json({ error: 'Node not found' });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ message: `Node "${nodeName}" updated` });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update node' });
}
});

router.delete('/node', (req, res) => {
  const { lineage, nodeName } = req.body;
  const filePath = path.join(__dirname, '../../data', `treeData${lineage}.json`);

  try {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const deleteNode = (nodes) => {
      let result = [];
      for (let n of nodes) {
        if (n.node === nodeName) {
          // Promote children to parent
          if (n.children && n.children.length) {
            result.push(...n.children);
          }
        } else {
          if (n.children && n.children.length) {
            n.children = deleteNode(n.children);
          }
          result.push(n);
        }
      }
      return result;
    };

    // Handle root being an object instead of array
    let updatedData = Array.isArray(data) ? deleteNode(data) : deleteNode([data]);
    // If root was a single object and after deletion we have only one node, save as object
    if (!Array.isArray(data) && updatedData.length === 1) updatedData = updatedData[0];

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

    res.json({ message: `Node "${nodeName}" deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete node' });
  }
});



export default router;
