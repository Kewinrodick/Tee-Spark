
import express from 'express';
import Design from '../models/Design';

const router = express.Router();

// Get all designs
router.get('/', async (req, res) => {
  try {
    const designs = await Design.find();
    res.json(designs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single design
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (design == null) {
      return res.status(404).json({ message: 'Cannot find design' });
    }
    res.json(design);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new design
router.post('/', async (req, res) => {
  const design = new Design({
    designerId: req.body.designerId,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    tags: req.body.tags,
  });

  try {
    const newDesign = await design.save();
    res.status(201).json(newDesign);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
