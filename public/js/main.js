const socket = io()

const clientsTotal = document.getElementById('client-total')
const nameSection = document.getElementById('name-section');
const MessageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const chatFooter = document.getElementById('chat__footer')
const chatContent = document.getElementById('chat__content');
const usernameSaveBtn = document.getElementById('username-save');

/*
Sayfa yüklendiğinde kullanıcının oluşturduğu ismi nameinputun içerisine getiriyorum.
*/
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem("name") !== null)
    {
        nameInput.value = localStorage.getItem("name");
    }    
});

// Middleware olarak public klasörünü ekleyin

const chooseCommunity = document.getElementById('chat-choose')

if (chooseCommunity) {
    chooseCommunity.addEventListener('click', () => {
        const community = document.getElementById('community').value
        if (community === 'default') {
            alert('Please choose a community')
        } else {
            window.location.href = `http://localhost:4000/${community}`
        }
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

/* 
LocalStorage kaydettiğim isim boşsa eğer kullanıcıya isim oluşturmasını söylüyorum. Eğer kullanıcı daha önce bir isim oluşturduysa
mesaj gönderebilir.
*/

function sendMessage() {
    
    if(localStorage.getItem("name") === null)
    {
        alert("Please enter a name before sending a message.");
    }   
    else
    {
        if (messageInput.value === '') return
        const data = 
        {
            name: localStorage.getItem("name"),
            message: messageInput.value,
            dateTime: new Date()
        }
        socket.emit('message', data)
        addMessageToUI(true, data)
        messageInput.value = ''
    }

}

socket.on('chat-message', (data) => {
    // console.log(data);
    messageTone.play()
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = `
    <div class=${isOwnMessage ? "chat__message-right" : "chat__message-left"}>
        <div class="chat__message-box">
            
            <div class="chat__message-name">
                ${data.name}
            </div>

            <div class="chat__message-content">
                ${data.message}
            </div> 
            
            <div class="chat__message-date">
                ${moment(data.dateTime).fromNow()}
            </div>
        </div>
    </div>
    `
    MessageContainer.innerHTML += element;
    chatContent.scrollTop = chatContent.scrollHeight;
}

/* 
messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `${localStorage.getItem("name")} is typing a message`
    })
})
*/

socket.on('feedback', (data) => {
    clearFeedback()
    const element =
    `
    <div class="chat__message-feedback">
      <p id="feedback">${data.feedback}</p>
    </div>`
    chatFooter.innerHTML += element
 })

function clearFeedback(){
    document.querySelectorAll('.chat__message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    })
}

/* 
Kullanıcı isim kaydetmiş mi o kontrol ediliyor. Eğer isim varsa tekrar kaydedemiyor.  
*/

usernameSaveBtn.addEventListener('click', () => {

    if(nameInput.value === "") 
    {
        alert("Please Enter Your Name!");
    }
    else 
    {
        if (localStorage.getItem("name") !== null) 
        {
            alert("Name Already Added!");
        }
        else
        {
            alert("Your Name Has Been Added");
            localStorage.setItem("name", nameInput.value);
        }
    }

});

function goToPage(url) {
    window.location.href = url;
}