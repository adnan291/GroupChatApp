const token = localStorage.getItem('token');
const groupList = document.getElementById('group-list')
localStorage.removeItem('groupId');
localStorage.removeItem('isAdmin');
localStorage.removeItem('group_name');
localStorage.removeItem('messages');

async function createGroup(event) {
    event.preventDefault();

    const group_name = event.target.grpname.value;

    const grpname = {
        group_name,
    }

    try {

        const res = await axios.post(`http://localhost:3000/group/creategroup`,
        grpname,
            {
                headers: { Authorization: token }
            });

        // console.log(res);
        await addToGroup(res.data.message.userId, res.data.message.id, true);
        event.target.grpname.value = '';
        getGroups();
    }

    catch (err) {
        console.log(err);
    }
}

async function addToGroup(userId, groupId, isAdmin) {
    

    const addUser = {
        userId,
        groupId,
        isAdmin,
    }

    try {

        const res = await axios.post(`http://localhost:3000/group/addUser`,
        addUser,
            {
                headers: { Authorization: token }
            });

        // console.log(res);
    }

    catch (err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', getGroups);

async function getGroups(){
    try {
        const res = await axios.get(`http://localhost:3000/group/getgroups`,
        {
            headers: { Authorization: token }
        });
        console.log(res);
        
            groupList.innerHTML = '';
            for (let i = 0; i < res.data.message.length; i++) {
                // console.log("printed");
                const element = res.data.message[i];
                showGroupOnScreen(element);
            }
    } catch (err) {
        console.log(err);
    }
}

async function showGroupOnScreen(data) {
    const childHTML = `<div id="${data.groupId}"><button onclick="openGroupChat('${data.groupId}','${data.group.group_name}','${data.isAdmin}')">${data.group.group_name}</button></div>`; 
    groupList.innerHTML += childHTML;
  
}

async function openGroupChat(groupId, group ,isAdmin){
localStorage.setItem("groupId", groupId);
localStorage.setItem("group_name", group);
localStorage.setItem("isAdmin", isAdmin);
// localStorage.removeItem('messages');

(window.location.href="../chatapp/chatapp.html"); 
}