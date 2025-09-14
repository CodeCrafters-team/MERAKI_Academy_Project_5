const pool = require('../models/db');

const getAllCategories = async (req, res) => {
try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.status(200).json({
    success: true,
    data: result.rows
    });
} catch (err) {
    console.error('Error getting categories:', err.message);
    res.status(500).json({
    success: false,
    error: 'Server error',
    message: err.message
    });
}
};

const getCategoryById = async (req, res) => {
try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);

    if (result.rows.length === 0) {
    return res.status(404).json({
        success: false,
        message: 'Category not found'
    });
    }

    res.status(200).json({
    success: true,
    data: result.rows[0]
    });
} catch (err) {
    console.error('Error getting category:', err.message);
    res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
    });
}
};

const createCategory = async (req, res) => {
try {
    const { name, description, query_m } = req.body;

    if (!name) {
    return res.status(400).json({
        success: false,
        message: 'Category name is required'
    });
    }

    const existing = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (existing.rows.length > 0) {
    return res.status(400).json({
        success: false,
        message: 'Category name already exists'
    });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, description, query_m) VALUES ($1, $2, $3) RETURNING *',
    [name, description || null, query_m || null]
    );

    res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: result.rows[0]
    });
} catch (err) {
    console.error('Error creating category:', err.message);
    res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
    });
}
};

const updateCategory = async (req, res) => {
try {
    const { id } = req.params;
    const { name, description, query_m } = req.body;

    const existing = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
    return res.status(404).json({
        success: false,
        message: 'Category not found'
    });
    }

    if (name && name !== existing.rows[0].name) {
      const checkName = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (checkName.rows.length > 0) {
        return res.status(400).json({
        success: false,
        message: 'Category name already exists'
        });
    }
    }

    const result = await pool.query(
      'UPDATE categories SET name=$1, description=$2, query_m=$3 WHERE id=$4 RETURNING *',
    [
        name || existing.rows[0].name,
        description || existing.rows[0].description,
        query_m || existing.rows[0].query_m,
        id
    ]
    );

    res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: result.rows[0]
    });
} catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
    });
}
};

const deleteCategory = async (req, res) => {
try {
    const { id } = req.params;

    const existing = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
    return res.status(404).json({
        success: false,
        message: 'Category not found'
    });
    }

    const result = await pool.query('DELETE FROM categories WHERE id=$1 RETURNING *', [id]);

    res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    data: result.rows[0]
    });
} catch (err) {
    console.error('Error deleting category:', err.message);
    res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
    });
}
};

const getCategoryStats = async (req, res) => {
try {
    const result = await pool.query('SELECT COUNT(*)::int AS total FROM categories');
    res.status(200).json({
    success: true,
    data: {
        total: result.rows[0].total
    }
    });
} catch (err) {
    console.error('Error getting category stats:', err.message);
    res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
    });
}
};

module.exports = {
getAllCategories,
getCategoryById,
createCategory,
updateCategory,
deleteCategory,
getCategoryStats
};
