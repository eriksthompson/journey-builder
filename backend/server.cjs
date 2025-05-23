// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors()); // Allow cross-origin requests from your frontend
app.use(express.json()); // Parse JSON request bodies

// In-memory store for saved forms (for demo only)
const savedForms = {};

// POST /api/save-form/:id
app.post('/api/save-form/:id', (req, res) => {
  const formId = req.params.id;
  const formData = req.body;

  console.log(`Saving form ${formId}:`, formData);

  // Save to in-memory store (replace with DB in real app)
  savedForms[formId] = formData;

  res.json({ status: 'success', formId, savedData: formData });
});

// Optional: GET endpoint to fetch saved form data
app.get('/api/get-form/:id', (req, res) => {
  const formId = req.params.id;
  const data = savedForms[formId] || null;
  res.json({ formId, savedData: data });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});