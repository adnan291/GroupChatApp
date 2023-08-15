const socket = io('http://localhost:3000');
const token = localStorage.getItem('token');
const groupId = localStorage.getItem('groupId');
const group_name = localStorage.getItem('group_name');
const Id = localStorage.getItem('userId');
const Admin = JSON.parse(localStorage.getItem('isAdmin'));
const addUser = document.getElementById('addUser');
const removeUser = document.getElementById('removeUser');
const parentNode = document.getElementById("chat-message");
localStorage.removeItem('messages');

socket.on('new-message', (message) => {
    showMsgOnScreen(message);
});

if (Admin) {

    document.getElementById('addbtn').style.display = 'block';
    document.getElementById('removebtn').style.display = 'block';
}

document.getElementById('group-name').innerHTML = group_name;

async function sendMessage(event) {
    event.preventDefault();

    const message = event.target.message.value;

    const msg = {
        message,
        groupId
    }

    try {

        const res = await axios.post(`http://localhost:3000/message/postmessage`,
            msg,
            {
                headers: { Authorization: token }
            });

        // console.log(res);
        event.target.message.value = '';
        allMsgs(groupId);
    }

    catch (err) {
        console.log(err);
    }
}

async function addToGroup(event) {
    event.preventDefault();
    const userId = event.target.userId.value;
    const isAdmin = event.target.isAdmin.value;

    const userCreds = {
        userId,
        groupId,
        isAdmin,
    }

    try {

        const res = await axios.post(`http://localhost:3000/group/addUser`,
        userCreds,
            {
                headers: { Authorization: token }
            });

        if( res.status === 201){
            alert('User added successfully');
        } 
      
    }

    catch (err) {
        if( err.response.status === 409){
            alert('User is already in the group.');
        } else {
            alert('User not registered');
        }
    }
}
async function removeFromGroup(event) {
    event.preventDefault();
    const userId = event.target.rmuser.value;

    const userCreds = {
        userId,
        groupId,
    }

    try {

        const res = await axios.post(`http://localhost:3000/group/removeUser`,
        userCreds,
            {
                headers: { Authorization: token }
            });
            
            if (res.status === 201) {
                alert('User removed successfully');
            }

            
        }
        
        catch (err) {
        if (err.response.status === 401) {
            alert('User does not exist')
        } else{
            alert('Something went wrong')
        }
        
    }
}
// window.onload = function() {
//     document.getElementById("message").focus();
// };

window.addEventListener('DOMContentLoaded', () => {
    getMessages(groupId);
});



async function showMsgOnScreen(data) {

    let childHTML;
    if (data.userId == Id) {
        childHTML = `<div class="chat-message me"> <p class="user-name">${data.user.name}:</p> <p class="message-text">${data.message}</p></div>`; 
    } else {
        childHTML = `<div class="chat-message other"> <p class="user-name">${data.user.name}:</p> <p class="message-text">${data.message}</p></div>`; 

    }
    parentNode.innerHTML += childHTML;
  
}

async function getMessages(groupId) {
        parentNode.innerHTML = "";
    const messageArray = JSON.parse(localStorage.getItem("messages"));
    if (!messageArray) {
        try {
            const response = await axios.get(`http://localhost:3000/message/getmessages?groupid=${groupId}`,
                { headers: { 'Authorization': token } });

            const res = response.data.slice(response.data.length - 10, response.data.length);
            const messages = JSON.stringify(res);
            // console.log(messages);
            localStorage.setItem('messages', messages);

            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                showMsgOnScreen(element);
            }

        } catch (err) {
            console.log(err);
        }
    }
    else {
        // console.log(messageArray);
        for (let i = 0; i < messageArray.length; i++) {
            const element = messageArray[i];
            showMsgOnScreen(element);

        }
    }
}

async function allMsgs(groupId) {
    try {
        const oldMsgArray = JSON.parse(localStorage.getItem("messages"));
        // console.log(oldMsgArray)
        let lastMsgId;
        if(oldMsgArray.length > 0){

            lastMsgId = oldMsgArray[oldMsgArray.length - 1].id;
        } else {
            lastMsgId = 0;
        }

        // console.log(lastMsgId)

        const res = await axios.get(`http://localhost:3000/message/getmessages?groupid=${groupId}&id=${lastMsgId}`, { headers: { Authorization: token } });
        // console.log(res.data);
        const allMsgs = oldMsgArray.concat(res.data);
        // console.log(allMsgs);
        if (allMsgs.length > 10) {
            const msgToSaveInLs = allMsgs.slice(allMsgs.length - 10, allMsgs.length);
            localStorage.setItem("messages", JSON.stringify(msgToSaveInLs));
        } else {
            localStorage.setItem("messages", JSON.stringify(allMsgs));
        }

        getMessages(groupId);
    } catch (err) {
        console.log(err);
    }
}


document.getElementById('addbtn').addEventListener('click', () => {
    removeUser.style.display = 'none';
    addUser.style.display = addUser.style.display === 'none' ? 'block' : 'none';
});
document.getElementById('removebtn').addEventListener('click', () => {
    addUser.style.display = 'none';
    removeUser.style.display = removeUser.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('gobackbtn').addEventListener('click', () => {
   
    (window.location.href="../group/group.html"); 
});

