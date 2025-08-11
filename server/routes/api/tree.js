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

export default router;
