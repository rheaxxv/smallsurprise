const gifStages = [
    "https://media.tenor.com/SFy5Za0DyMEAAAAj/erm-fingers.gif",                // 0 normal
    "https://media.tenor.com/OlpOTuNjd1wAAAAm/airallia-cat-chan.webp",          // 1 confused
    "https://media.tenor.com/IjkcwEaDOZMAAAAm/please-please-don%27t-go.webp",   // 2 pleading
    "https://media.tenor.com/g1_tS_VU14YAAAAM/tears-heartbreak.gif",            // 3 sad
    "https://media.tenor.com/I5bwJxpmFAsAAAAm/crying-sad.webp",                // 4 sadder
    "https://media1.tenor.com/m/99sQqbsDt1kAAAAd/sad.gif",                     // 5 devastated
    "https://media.tenor.com/RowKT44Zuf0AAAAj/ngoclan.gif",                   // 6 very devastated
    "https://media.tenor.com/U-xx4Pe0V1wAAAAj/budu.gif"                      // 7 crying runaway
]

const noMessages = [
    "Luh? 🤔",
    "Sige na please... 🥺",
    "If you say no, I'll be sad...",
    "Sakit namann... 😢",
    "Plisss??? 💔",
    "Grabeeee...",
    "Last chance naa! 😭",
    "Di ka titigil? 😜"
]

const yesTeasePokes = [
    "pahard to get ka naman.. 😏",
    "go on, hit no... once lang 👀",
    "type moko noh 😈",
    "click no, I dare youuu 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount - 1, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button (fun but safe)
    const currentSize = parseFloat(getComputedStyle(yesBtn).fontSize)
    const isMobile = window.matchMedia('(max-width: 420px)').matches
    
    // high limits so it still feels crazy
    const maxYesSize = isMobile ? 60 : 140
    const maxPadY = isMobile ? 40 : 80
    const maxPadX = isMobile ? 100 : 200
    
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.3, maxYesSize)}px`
    
    const padY = Math.min(18 + noClickCount * 5, maxPadY)
    const padX = Math.min(45 + noClickCount * 10, maxPadX)
    
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

  // Runaway starts ONLY after all messages have been shown
    if (noClickCount >= noMessages.length && !runawayEnabled) {
    enableRunaway()
    runawayEnabled = true
    }
    
    // Mobile: move AFTER tap once runaway is enabled
    if (runawayEnabled && window.matchMedia('(pointer: coarse)').matches) {
      setTimeout(runAway, 80)
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    runAway()
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
