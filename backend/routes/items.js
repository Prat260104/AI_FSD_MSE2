const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

// POST /api/items - Add new item (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;

    // Validate input
    if (!itemName || !description || !type || !location || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new item
    const item = new Item({
      itemName,
      description,
      type,
      location,
      date: date || Date.now(),
      contactInfo,
      userId: req.userId
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      item
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item',
      error: error.message
    });
  }
});

// GET /api/items - Get all items (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching items',
      error: error.message
    });
  }
});

// GET /api/items/:id - Get item by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('userId', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching item',
      error: error.message
    });
  }
});

// PUT /api/items/:id - Update item (protected, own items only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own items'
      });
    }

    // Update fields
    const { itemName, description, type, location, date, contactInfo } = req.body;
    
    if (itemName) item.itemName = itemName;
    if (description) item.description = description;
    if (type) item.type = type;
    if (location) item.location = location;
    if (date) item.date = date;
    if (contactInfo) item.contactInfo = contactInfo;

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating item',
      error: error.message
    });
  }
});

// DELETE /api/items/:id - Delete item (protected, own items only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own items'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting item',
      error: error.message
    });
  }
});

// GET /api/items/search - Search items by name (protected)
router.get('/search/query', authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
    }

    const items = await Item.find({
      $or: [
        { itemName: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } }
      ]
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching items',
      error: error.message
    });
  }
});

module.exports = router;
