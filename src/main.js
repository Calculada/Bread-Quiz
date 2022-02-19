import {qst} from './modules/questions.js'

const start = document.getElementById('start')
const info = document.getElementById('info')
const settings = document.getElementById('settings')
const infotab = document.getElementById('infotab')
const settingstab = document.getElementById('settingstab')
const exitinfo = document.getElementById('exitinfo')
const exitsettings = document.getElementById('exitsettings')
const intro = document.getElementById('intro')
const quiz = document.getElementById('quiz')
const dif = document.getElementById('dif')
const title = document.getElementById('title')
const sig = document.getElementById('sig')
const timer = document.getElementById('timer')
const question = document.getElementById('question')
const answers = document.getElementsByClassName('answer')
const gameOver = document.getElementById('gameover')
const difInfo = document.getElementById('difficulty')
const score = document.getElementById('score')
const healthbar = document.getElementById('healthbar')
const restart = document.getElementById('restart')
const nick = document.getElementById('nick')
const save = document.getElementById('save')
const container = document.getElementById('input-container')
const highscore = document.getElementById('highscore')
const highscoretab = document.getElementById('highscore-tab')
const exithighscore = document.getElementById('exithighscore')
const scores = document.getElementById('scores')
const clear = document.getElementById('clear')
const showScore = document.getElementById('realtime-score')
const volumeControl = document.getElementById('volume-control')
const showVolume = document.getElementById('show-volume')
let gameSong = new Audio('./src/audio/Hall_of_the_Mountain_King.mp3')

let difficulty
let game
let countdown
let rest = []
let rule = {
    time: {
        "Easy peasy": 120,
        "Easy": 60,
        "Normal": 30,
        "Hard": 15,
        "Don't even try": 10
    },
    lives: {
        "Easy peasy": 5,
        "Easy": 4,
        "Normal": 3,
        "Hard": 2,
        "Don't even try": 1
    },
    difficulties: ["Easy peasy", "Easy", "Normal", "Hard", "Don't even try"]
}

function create() {
    return {
        time: rule.time[difficulty],
        lives: rule.lives[difficulty],
        score: 0,
        streak: 0
    }
}

// Info Button Function

info.addEventListener('click', () => {
    infotab.style.visibility = 'visible'
})

// Start Button Function

start.addEventListener('click', () => {
    if(dif.value !== 'Select Difficulty') {
        intro.style.visibility = 'hidden'
        quiz.style.visibility = 'visible'
        title.style.visibility = 'hidden'
        sig.style.visibility = 'hidden'
        difficulty = dif.value
        dif.value = 'Select Difficulty'
        rest = []
        check()
        game = create()
        gQ()
        song()
    }
})
// Settings Button Function

settings.addEventListener('click', () => {
    settingstab.style.visibility = 'visible'
})

// Exit Tab Button Function

exitinfo.addEventListener('click', () => {
    infotab.style.visibility = 'hidden'
})

exitsettings.addEventListener('click', () => {
    settingstab.style.visibility = 'hidden'
})

restart.addEventListener('click', () => {
    gameOver.style.visibility = 'hidden'
    intro.style.visibility = 'visible'
    title.style.visibility = 'visible'
    sig.style.visibility = 'visible'
    save.style.pointerEvents = 'all'
    nick.removeAttribute('disabled')
})

function Timer() {
    
    countdown = setInterval(() => {
        if(Number((game.time).toFixed(1)) !== 0) {
            game.time -= .1
        } else {
            clearInterval(countdown)
        }
        timer.innerHTML = game.time < 10 ? (Number((game.time).toFixed(1)) === 0 ? 0 : (game.time).toFixed(1)) : (game.time).toFixed(0)
        if(game.time < 10 && Number((game.time).toFixed(1)) !== 0) {
            timer.setAttribute('data-blinking', '')
        } else {
            timer.removeAttribute('data-blinking', '')
        }
        if(Number((game.time).toFixed(1)) === 0) {
            lose()
        }
    }, 100)
}

// Question Generator Function

function gQ() {
    if(rest.length === 0) {
        finish()
        return
    }
    let n = Math.trunc(Math.random() * rest.length)
    let q = qst(difficulty)[rest[n]]
    let freebtns = ['1', '2', '3', '4']
    let alp = ['a', 'b', 'c', 'd']
    game.quest = q
    question.innerHTML = q.question
    for(let i = 0; i <= 3; i++) {
        let selbtn = Math.trunc(Math.random() * freebtns.length)
        answers[i].innerHTML = q[alp[freebtns[selbtn] - 1]]
        answers[i].setAttribute('data-alp', alp[freebtns[selbtn] - 1])
        freebtns.splice(selbtn, 1)
    }
    rest.splice(n, 1)
    clearInterval(countdown)
    game.time = create().time
    Timer()
    health()
    showScore.innerHTML = `Score: ${game.score}`
}

addEventListener('click', (e) => {
    if(e.target.className === 'answer') {
        if(e.target.getAttribute('data-alp') === game.quest.r) {
            game.streak++
            game.score += 1000 + 50 * (game.streak >= 2 ? game.streak - 1 : 0)
            gQ()
        } else {
            game.streak = create().streak
            lose()
        }
    }
})

function lose() {
    game.lives--
    gQ()
    if(game.lives === 0) {
        finish()
    }
}

function finish() {
    quiz.style.visibility = 'hidden'
    gameOver.style.visibility = 'visible'
    difInfo.innerHTML = `Difficulty: <strong>${difficulty}</strong>`
    score.innerHTML = `Score: <strong>${game.score}</strong>`
    gameSong.loop = false
    gameSong.pause()
}

function check() {
    for(let i = 0; i < qst(difficulty).length; i++) {
        rest.push(i)
    }
}


function health() {
    healthbar.innerHTML = ''
    for(let i = 0; i < Math.trunc(game.lives/2); i++) {
        let heart = new Image()
        heart.src = './src/images/Full_HP.png'
        healthbar.appendChild(heart)
    }
    if(game.lives % 2 === 1) {
        let heart = new Image()
        heart.src = './src/images/Half_HP.png'
        healthbar.appendChild(heart)
    }
}

function song() {
    if (typeof gameSong.loop === 'boolean') {
        gameSong.loop = true
    } else {
        gameSong.addEventListener('ended', function() {
            this.currentTime = 0
            this.play()
        }, false)
    }
    gameSong.play()
}

save.addEventListener('click', () => {
    if(nickValidation(nick.value).length >= 3) {
        localStorage[difficulty] = addObj(difficulty, nickValidation(nick.value), game.score,localStorage)
        highest(difficulty)
        save.style.pointerEvents = 'none'
        nick.value = ''
        nick.setAttribute('disabled', '')
    } else {
        container.setAttribute('data-error', 'It must contain at least 3 characters!')
    }
})

function nickValidation(str) {
    if(str.charAt(str.length - 1) === ' ') {
        return nickValidation(str.substr(0, str.length - 1))
    } else {
        return str
    }
}

nick.addEventListener('keydown', () => {
    container.removeAttribute('data-error')
})

highscore.addEventListener('click', () => {
    highscoretab.style.visibility = 'visible'
    leaderboard()
})

exithighscore.addEventListener('click', () => {
    highscoretab.style.visibility = 'hidden'
})

clear.addEventListener('click', () => {
    localStorage.clear()
    leaderboard()
})

function leaderboard() {
    for(let i = 1; i < scores.querySelectorAll('tr').length; i++) {
        for(let j = 1; j < scores.querySelectorAll('tr')[i].querySelectorAll('td').length; j++) {
            let block = scores.querySelectorAll('tr')[i].querySelectorAll('td')[j]
            if(storageFind(rule.difficulties[j - 1], i) !== undefined) {
                block.innerHTML = `${storageFind(rule.difficulties[j - 1], i).name} - ${storageFind(rule.difficulties[j - 1], i).score}`
            } else {
                block.innerHTML = ''
            }
        }
    }
}

function addObj(name, pro, val, arr) {
    if(arr[name] === undefined) return JSON.stringify([{name: pro, score: val}])
    let conc = JSON.parse(arr[name])
    conc.push({name: pro, score: val})
    return JSON.stringify(conc)
}

function highest(d) {
    let allScores = JSON.parse(localStorage[d])
    allScores.sort((a, b) => b.score - a.score)
    localStorage[d] = JSON.stringify(allScores.splice(0, 5))
}

function storageFind(di, p) {
    return localStorage[di] === undefined ? undefined : JSON.parse(localStorage[di])[p - 1]
}

volumeControl.addEventListener('mousemove', () => {
    gameSong.volume = volumeControl.value / 100
    showVolume.innerHTML = `${volumeControl.value}%`
    console.log(volumeControl.value)
})

/*

Big shoutout to the creator of this music

Hall of the Mountain King by Kevin MacLeod http://incompetech.com
Creative Commons — Attribution 4.0 International — CC BY 4.0
Free Download / Stream: https://bit.ly/hall-of-the-mountain-king
Music promoted by Audio Library https://youtu.be/2RDX5sVEfs4

*/

/*
function storageFind(d, p) {
    let ds = storageSort(d)
    let ss = []
    for(let i = 0; i < ds.length; i++) {
        ss.push(Number(JSON.parse(localStorage.getItem(localStorage.key(i))).score))
    }
    if(findPos(ss, p) === 'none') return 'none'
    return ds[ss.indexOf(findPos(ss, p), p - 1)]
}

function storageSort(d) {
    let arr = []
    for(let i = 0; i < localStorage.length; i++) {
        if(JSON.parse(localStorage.getItem(localStorage.key(i))).difficulty === d) {
            arr.push(localStorage.key(i))
        }
    }
    return arr
}

function findPos(arr, pos) {
    let array = sortArray(arr)
    console.log(array.length + ' length')
    if(array.length >= pos) return array[pos - 1]
    return 'none'
}

function sortArray(array) {
    var temp = 0;
    for (var i = 0; i < array.length; i++) {
        for (var j = i; j < array.length; j++) {
            if (array[j] > array[i]) {
                temp = array[j];
                array[j] = array[i];
                array[i] = temp;
            }
        }
    }
    return array;
}
*/

/*
function storageFind(d, p) {
    let ds = JSON.parse(localStorage[d] === undefined ? "{}" : localStorage[d])
    let ss = []
    for(let i in ds) {
        ss.push(ds[i])
    }
    console.log(findPos(sortArray(ss), 1))
    console.log(sortArray(ss).indexOf(findPos(sortArray(ss), 1)))
    console.log(ss)
    return findPos(sortArray(ss), p) === undefined ? undefined : Object.keys(ds)[sortArray(ss).indexOf(findPos(sortArray(ss), p))]
    
}

function findPos(arr, pos) {
    let array = sortArray(arr)
    return array[pos - 1]
}

function sortArray(array) {
    var temp = 0;
    for (var i = 0; i < array.length; i++) {
        for (var j = i; j < array.length; j++) {
            if (array[j] > array[i]) {
                temp = array[j];
                array[j] = array[i];
                array[i] = temp;
            }
        }
    }
    return array;
}
*/