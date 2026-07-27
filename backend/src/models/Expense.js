const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    category: {
      type: String,
      enum: ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Salary', 'Other'],
      default: 'Other',
    },
    note: { type: String, trim: true, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
