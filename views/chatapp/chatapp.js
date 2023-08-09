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