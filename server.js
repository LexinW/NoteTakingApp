const express = require('express');
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
let notes = require('./db/db.json');

// API routes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  let newNote = req.body;
  newNote.id = uuidv4();
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  notes = notes.filter(note => note.id !== noteId);
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
  res.json({ ok: true });
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
