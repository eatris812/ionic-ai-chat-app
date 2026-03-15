let currentChatId = null;
let chats = loadChats();
let selectedModel = loadSelectedModel() || 'meta-llama/llama-3.1-8b-instruct';

const chatList = document.getElementById('chatList');
const chatHistoryList = document.getElementById('chatHistoryList');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const newChatBtn = document.getElementById('newChatBtn');
const emptyState = document.getElementById('emptyState');
const modelSelect = document.getElementById('modelSelect');

function loadChats() {
  const savedChats = localStorage.getItem('chats');
  let chats;
  if (savedChats) {
    chats = JSON.parse(savedChats);
  } else {
    chats = {};
  }
  return chats;

}

function loadSelectedModel() {
  return localStorage.getItem('selectedModel');
}

function saveSelectedModel(model) {
  localStorage.setItem('selectedModel', model);
}

function saveChats() {
  localStorage.setItem('chats', JSON.stringify(chats));
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
}

function deleteChat(chatId, event) {
  event.stopPropagation();
  if (confirm('Are you sure you want to delete this chat?')) {
    delete chats[chatId];
    saveChats();
    
    if (chatId === currentChatId) {
      currentChatId = null;
      chatList.innerHTML = '';
      emptyState.style.display = 'flex';
    }
    
    updateChatHistory();
  }
}

function updateChatHistory() {
  chatHistoryList.innerHTML = '';

  // sorted by last message
  const chatEntries = Object.entries(chats);

  const sortedChats = chatEntries.sort((entryA, entryB) => {
    const messagesA = entryA[1];
    const messagesB = entryB[1];

    let lastMessageA = null;
    if (messagesA.length > 0) {
      lastMessageA = messagesA[messagesA.length - 1];
    }

    let lastMessageB = null;
    if (messagesB.length > 0) {
      lastMessageB = messagesB[messagesB.length - 1];
    }

    let timeA = 0;
    if (lastMessageA && lastMessageA.timestamp) {
      timeA = lastMessageA.timestamp;
    }

    let timeB = 0;
    if (lastMessageB && lastMessageB.timestamp) {
      timeB = lastMessageB.timestamp;
    }

    return timeB - timeA;
  });


  sortedChats.forEach(([chatId, messages]) => {
    const isActive = chatId === currentChatId;
    const lastMessage = messages.at(-1) || {};
    const lastMessageText = lastMessage.text || 'New Chat';
    const formattedDate = formatDate(lastMessage.timestamp || Date.now());

    const chatItem = document.createElement('ion-item');
    chatItem.classList.add('chat-item');
    if (isActive) {
      chatItem.classList.add('active');
    }

    chatItem.innerHTML = `
      <ion-label>
        <h2>Chat ${formattedDate}</h2>
        <p class="chat-preview">${lastMessageText}</p>
      </ion-label>
      <ion-button class="delete-chat-btn" color="danger" fill="clear">
        <ion-icon name="trash-outline"></ion-icon>
      </ion-button>
    `;

    chatItem.addEventListener('click', () => {
      currentChatId = chatId;
      displayChat(chatId);
      updateChatHistory();
    });

    const deleteButton = chatItem.querySelector('.delete-chat-btn');
    deleteButton.addEventListener('click', (event) => {
      deleteChat(chatId, event);
    });

    chatHistoryList.appendChild(chatItem);
  });
}


function createNewChat() {
  const chatId = Date.now().toString();
  chats[chatId] = [];
  currentChatId = chatId;
  displayChat(chatId);
  updateChatHistory();
  saveChats();
}

function displayChat(chatId) {
  chatList.innerHTML = '';
  const messages = chats[chatId] || [];
  
  if (messages.length === 0) {
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
    
    let currentDate = '';
    messages.forEach(msg => {
      const messageDate = formatDate(msg.timestamp);
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        const dateDiv = document.createElement('div');
        dateDiv.className = 'chat-date-divider';
        dateDiv.textContent = currentDate;
        chatList.appendChild(dateDiv);
      }
      
      addMessageToUI(msg.text, msg.sender, msg.timestamp);
    });
  }
  
  scrollToBottom();
}

function addMessageToUI(text, sender, timestamp) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  if (sender === 'user') {
    messageElement.classList.add('user-message');
  } else {
    messageElement.classList.add('bot-message');
  }

  
  const time = new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  messageElement.innerHTML = `
    <div class="message-content">
      <div class="text">${text}</div>
      <div class="timestamp">${time}</div>
    </div>
  `;
  
  chatList.appendChild(messageElement);
  scrollToBottom();
}

function scrollToBottom() {
  chatList.scrollTop = chatList.scrollHeight;
}

function getChatHistory() {
  if (!currentChatId || !chats[currentChatId]) return [];
  
  return chats[currentChatId].map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  if (!currentChatId) {
    createNewChat();
  }

  const userMessage = {
    text,
    sender: 'user',
    timestamp: Date.now()
  };

  chats[currentChatId].push(userMessage);
  addMessageToUI(text, 'user', userMessage.timestamp);
  messageInput.value = '';

  try {
    const messages = getChatHistory();
    messages.push({ role: 'user', content: text });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer <OPENROUTER_API_KEY>',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost',
        'X-Title': 'MultiAI'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    const botMessage = {
      text: reply,
      sender: 'bot',
      timestamp: Date.now()
    };

    chats[currentChatId].push(botMessage);
    addMessageToUI(botMessage.text, 'bot', botMessage.timestamp);
    saveChats();
    updateChatHistory();
  } catch (error) {
    console.log("error")
  }
}

function initializeModelSelection() {
  modelSelect.value = selectedModel;
  modelSelect.addEventListener('ionChange', (e) => {
    selectedModel = e.detail.value;
    saveSelectedModel(selectedModel);
  });
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
newChatBtn.addEventListener('click', createNewChat);

initializeModelSelection();
updateChatHistory();
if (Object.keys(chats).length === 0) {
  emptyState.style.display = 'flex';
} else {
  currentChatId = Object.keys(chats)[0];
  displayChat(currentChatId);
}