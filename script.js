const plusNoteButton = document.getElementById('addbtn');
const closePopupButton = document.getElementById('close-popup');
const addNoteButton = document.getElementById('addNote');

// popup open/close
addEventListener('DOMContentLoaded', () => {
    plusNoteButton.addEventListener('click', popup);
    closePopupButton.addEventListener('click', closePopup);

    loadNotes(); // Load notes from localStorage when page loads

    function popup() {
        const popup = document.querySelector('.popup-container');
        popup.classList.toggle('active');
    }

    function closePopup() {
        const popup = document.querySelector('.popup-container');
        popup.classList.remove('active');
    }
});

// Add a new note
addNoteButton.addEventListener('click', () => {
    let description = document.getElementById('description').value.trim();

    if (description === '') {
        alert('Please write something before adding!');
        return;
    }

    addNoteToPage(description); // add to UI
    saveNoteToLocalStorage(description); // save to localStorage

    document.getElementById('description').value = '';
});

// Event delegation for delete and edit buttons
document.getElementById('note-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('noteDeleteButton')) {
        const card = event.target.closest('.outer-card-container');
        const noteText = card.querySelector('.card-container').textContent;

        const confirmDelete = confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
            deleteNoteFromLocalStorage(noteText);
            card.remove();
        }
    }

    if (event.target.classList.contains('noteEditButton')) {
        const card = event.target.closest('.outer-card-container');
        const noteText = card.querySelector('.card-container');
        const oldText = noteText.textContent;

        const newDescription = prompt("Edit your note:", oldText);
        if (newDescription !== null && newDescription.trim() !== '') {
            noteText.textContent = newDescription.trim();
            updateNoteInLocalStorage(oldText, newDescription.trim());
        }
    }
});

// Functions for working with notes

function addNoteToPage(description) {
    let outerCard = document.createElement('div');
    outerCard.className = 'outer-card-container fade-in';

    let noteText = document.createElement('div');
    noteText.className = 'card-container';
    noteText.textContent = description;

    let buttonBox = document.createElement('div');
    buttonBox.className = 'card-buttons';

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'noteDeleteButton';
    deleteBtn.textContent = 'x';

    let editBtn = document.createElement('button');
    editBtn.className = 'noteEditButton';
    editBtn.textContent = 'edit';

    buttonBox.appendChild(editBtn);
    buttonBox.appendChild(deleteBtn);

    outerCard.appendChild(noteText);
    outerCard.appendChild(buttonBox);

    document.getElementById('note-container').appendChild(outerCard);
}

function saveNoteToLocalStorage(note) {
    const notes = getNotesFromLocalStorage();
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notes')) || [];
}

function deleteNoteFromLocalStorage(noteToDelete) {
    let notes = getNotesFromLocalStorage();
    notes = notes.filter(note => note !== noteToDelete);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNoteInLocalStorage(oldNote, newNote) {
    let notes = getNotesFromLocalStorage();
    const index = notes.indexOf(oldNote);
    if (index !== -1) {
        notes[index] = newNote;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function loadNotes() {
    const notes = getNotesFromLocalStorage();
    notes.forEach(note => addNoteToPage(note));
}
