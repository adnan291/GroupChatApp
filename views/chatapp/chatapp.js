const token = localStorage.getItem('token');

async function sendMessage(event) {
    event.preventDefault();
   
    const message = event.target.message.value;

    const msg = {
        message,
    }
    
try {

    const res = await axios.post(`http://localhost:3000/message/postmessage`,
     msg,
     {headers: {Authorization: token}
    });

    console.log(res);
    event.target.message.value = '';
}

catch(err){
    console.log(err);
}
}

window.addEventListener('DOMContentLoaded', getMessages);

async function showMsgOnScreen(data) {
    const parentNode = document.getElementById("chat-message");
    const childHTML = `<div class="chat-message me"> <p class="message-text">${data.message}</p></div>`; // if u are using above for loop then use i insted of data.message
    parentNode.innerHTML += childHTML;
}

async function getMessages() {
    try {
        const response = await axios.get(`http://localhost:3000/message/getmessages`,
         {headers: {'Authorization': token}});

        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            showMsgOnScreen(element);
        }
    } catch (err) {
        console.log(err);
    }
}

setInterval(()=> {
    const parentNode = document.getElementById("chat-message");
    parentNode.innerHTML = " ";
   getMessages();
 }, 3000)