
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
    const messageArray = JSON.parse(localStorage.getItem("messages"));
    if(!messageArray){
    try {
        const response = await axios.get(`http://localhost:3000/message/getmessages`,
         {headers: {'Authorization': token}});

        const res= response.data.slice(response.data.length-10, response.data.length);
        const messages = JSON.stringify(res);
        console.log(messages);
        localStorage.setItem('messages',messages);

        for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i];
            showMsgOnScreen(element);
        }
        
    } catch (err) {
        console.log(err);
    }
} 
else {
    for (let i = 0; i < messageArray.length; i++) {
        const element = messageArray[i];
        showMsgOnScreen(element);
        
    }
}
}

async function allMsgs() {
    try {
      const oldMsgArray = JSON.parse(localStorage.getItem("messages"));
      console.log(oldMsgArray)
      const lastMsgId = oldMsgArray[oldMsgArray.length - 1].id  || 0;
  
      console.log(lastMsgId)
  
        const res = await axios.get(`${url}/message/getMessage?id=${lastMsgId}`, { headers: { Authorization: token } });
      console.log(res.data);
      const allMsgs = oldMsgArray.concat(res.data);
      console.log(allMsgs);
      if (allMsgs.length > 10) {
        const msgToSaveInLs = allMsgs.slice(allMsgs.length - 10, allMsgs.length);
        localStorage.setItem("messages", JSON.stringify(msgToSaveInLs));
      } else {
        localStorage.setItem("messages", JSON.stringify(allMsgs));
      }
  
      getMsg();
    } catch (err) {
      console.log(err);
    }
  }

// setInterval(()=> {
//     const parentNode = document.getElementById("chat-message");
//     parentNode.innerHTML = " ";
//    getMessages();
//  }, 3000);