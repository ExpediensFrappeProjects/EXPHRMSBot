//**Function to Get or Generate the Sender_ID from a Cookie**//
function getOrGenerateSenderId() {
    const sender_idKey = 'sender_id';
    let sender_id = getCookie(sender_idKey);
  
    // If not stored, generate a new one
    if (!sender_id) {
      sender_id = uuidv4();
      // Store sender_id in a cookie for future use
      setCookie(sender_idKey, sender_id);
    }

    return sender_id;
  }
  

//**Function to Get the Value of a Cookie**//
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
  }


//**Function to Set a Cookie**//
function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
    }
  

const sender_id = getOrGenerateSenderId();
const flask_server_url = '/webhook';