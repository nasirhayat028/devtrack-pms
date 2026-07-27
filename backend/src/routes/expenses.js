const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// List expenses (optional query filters: month, category, type)
router.get('/', async (req, res) => {
  try {
    const { month, category, type } = req.query;
    const filter = { user: req.userId };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (month) {
      const [year, m] = month.split('-').map(Number);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, note, date } = req.body;
    if (!title || amount === undefined) {
      return res.status(400).json({ message: 'Title and amount are required' });
    }
    const expense = await Expense.create({
      user: req.userId,
      title,
      amount,
      type: type || 'expense',
      category: category || 'Other',
      note: note || '',
      date: date || Date.now(),
    });
    res.status(201).json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create expense', error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update expense', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete expense', error: err.message });
  }
});

// Summary: totals by category + income vs expense, for a given month
router.get('/summary/:month', async (req, res) => {
  try {
    const [year, m] = req.params.month.split('-').map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 1);

    const items = await Expense.find({ user: req.userId, date: { $gte: start, $lt: end } });

    const totalIncome = items.filter((i) => i.type === 'income').reduce((s, i) => s + i.amount, 0);
    const totalExpense = items.filter((i) => i.type === 'expense').reduce((s, i) => s + i.amount, 0);

    const byCategory = {};
    items
      .filter((i) => i.type === 'expense')
      .forEach((i) => {
        byCategory[i.category] = (byCategory[i.category] || 0) + i.amount;
      });

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      byCategory,
      count: items.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to build summary', error: err.message });
  }
});

module.exports = router;
