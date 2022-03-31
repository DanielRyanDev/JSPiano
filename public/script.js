// const { map } = require("async")

//layout for keyboard; each letter corresponds to a certain note with 'a' being the lowest (F2) playable note.

const white_keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
const black_keys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']

const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
const saveButton = document.querySelector('.save-button')
const songLink = document.querySelector('.song-link')
const keys = document.querySelectorAll('.key')
const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')

const keyMap = [...keys].reduce((map, key) => {
    map[key.dataset.note] = key
    return map
}, {})

let recordingStartTime
let songNotes = currentSong && currentSong.notes


keys.forEach(key => {
    key.addEventListener('click', () => playNote(key))
})

//Adds record, save, and play button(s) functionality

if (recordButton) {
recordButton.addEventListener('click', toggleRecording)
}
if (saveButton) {
saveButton.addEventListener('click', saveSong)
}
playButton.addEventListener('click', playSong)

//Controls duration of note(s) when played and prevents repetition when note(s) held down

document.addEventListener('keydown', e => {
    if (e.repeat) return
    const key = e.key
    const whiteKeyIndex = white_keys.indexOf(key)
    const blackKeyIndex = black_keys.indexOf(key)

    if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex])
    if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex])
})

function toggleRecording() {
    recordButton.classList.toggle('active')
    if (isRecording()) {
        startRecording()
    } else {
        stopRecording()
    }
}

function isRecording() {
    return recordButton != null && recordButton.classList.contains('active')
}

// Records the notes played and their duration

function startRecording() {
    recordingStartTime = Date.now()
    songNotes = []
    playButton.classList.remove('show')
    saveButton.classList.remove('show')
}

// Adds play and save buttons after recording stopped

function stopRecording() {
    playSong()
    playButton.classList.add('show')
    saveButton.classList.add('show')
}

// Adds playback functionality

function playSong() {
    if (songNotes.length === 0) return
    songNotes.forEach(note => {
        setTimeout(() => {
            playNote(keyMap[note.key])
        }, note.startTime)
    })
}

function playNote(key) {
    if (isRecording()) recordNote(key.dataset.note)
    const noteAudio = document.getElementById(key.dataset.note)
    noteAudio.currentTime = 0;
    noteAudio.play()
    key.classList.add('active')
    noteAudio.addEventListener('ended', () => {
        key.classList.remove('active')
    })
}

// Adds recording functionality

function recordNote(note) {
    songNotes.push({
        key: note,
        startTime: Date.now() - recordingStartTime
    })
}

// Adds save functionality

function saveSong() {
    axios.post('/songs', { songNotes: songNotes }).then(res => {
        songLink.classList.add('show')
        songLink.href = `/songs/${res.data._id}`
        // console.log(res.data)
    })
}