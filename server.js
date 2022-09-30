const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const uniqueId = require('./helpers/uniqueId');
const {readFromFile, readAndAppend} = require("./helpers/fsUtil");
const { writeFile } = require('fs');

const PORT = process.env.PORT  || 3001;

const app = express();

app.use(clog);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then(data => res.json(JSON.parse(data)));
})

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uniqueId()
        };

        readAndAppend(newNote, './db/db.json');
        res.json('Note added successfully.')
    } else {
        res.error("Error");
    }    
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
        .then(data => JSON.parse(data))
        .then(response => {
            const newNoteList = response.filter(note => note.note_id !== noteId);
            writeFile('./db/db.json', JSON.stringify(newNoteList, null, 4), err => 
                err ? console.error(err) : console.log("Note successfully deleted"))
            res.json(newNoteList);
        })
})

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at ${PORT}`)
);