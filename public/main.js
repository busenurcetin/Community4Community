const socket = io()

const clientsTotal = document.getElementById('client-total')
const nameSection = document.getElementById('name-section');
const MessageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
let isNameSet = false;



// Middleware olarak public klasörünü ekleyin

const chooseCommunity = document.getElementById('chat-choose')

if (chooseCommunity) {
    chooseCommunity.addEventListener('click', () => {
        const community = document.getElementById('community').value
        if (community === 'default') {
            alert('Please choose a community')
        } else {
            window.location.href = `localhost:4000/${community}`
        }
    })
}

if (nameInput) {
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isNameSet) {
            setName()
        }
    })
}

if (nameSection) {
    nameSection.addEventListener('click', () => {
        nameInput.disabled = false
    })
}



const messageTone = new Audio('./messageSent.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
});

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Users ${data}`
})

function sendMessage() {
    if (messageInput.value === '') return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message', (data) => {
    // console.log(data);
    messageTone.play()
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = `
    <li class=${isOwnMessage ? "message-right" : "message-left"}>
        <p class="message">
            ${data.message}
        <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>
    `
    MessageContainer.innerHTML += element
    scrollToBottom()
}

function scrollToBottom() {
    MessageContainer.scrollTo(0, MessageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element =
    `
    <li class="message-feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>`
     MessageContainer.innerHTML += element
 })

 // Buraya Yeniden Bak

function setName() {
    if (nameInput.value === '') return
    socket.emit('name', nameInput.value)
    nameInput.value = ''
}

function clearFeedback(){
    document.querySelectorAll('.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}










// Kullanıcı adını değiştirmeyi engelle

function goToPage(url) {
    window.location.href = url;
}