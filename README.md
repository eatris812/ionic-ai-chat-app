# 💬 AI Chat Application

**AI Chat Application** is a dynamic web-based chatbot developed with Ionic Framework and integrated with Google Generative AI. Have interactive conversations with AI models, manage multiple chat histories, and switch between different AI models.

## Requirements

- **Node.js 14+**
- **npm or yarn**

## 🚀 Installation

### 1. Clone or Download the Project
```bash
git clone https://github.com/eatris812/ionic-ai-chat-app.git
```
or download the project files to your computer.

### 2. Install Dependencies
```bash
npm install
```

## ▶️ Running the Application

### Development Mode
```bash
npm run dev
```

The application will open at `http://localhost:5173` (or another port specified by Vite).

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 💬 Usage

### Objective
Have meaningful conversations with AI models and build your chat history.

### Features

#### 💬 Chat Conversations
- Real-time messaging with AI models
- Support for multiple conversation threads
- Each chat session is separate and independent

#### 📁 Chat History
- Sidebar menu displays all your previous chats
- Organize conversations chronologically
- Delete individual chat sessions with one click

#### 🤖 Model Selection
- Choose between different AI models
- Switch models mid-conversation if needed
- Selected model preference is saved

#### 💾 Data Persistence
- All conversations are stored locally in your browser
- No data is lost between sessions
- Complete privacy - data never leaves your device

#### 🎨 Modern Interface
- Clean and intuitive design using Ionic components
- Responsive layout that works on desktop and mobile
- Smooth animations and transitions

## 📁 Project Structure

```
├── index.html          # Main HTML file with UI structure
├── main.js             # Main application logic and AI integration
├── style.css           # Application styling and animations
├── package.json        # Project configuration and dependencies
└── README.md           # This file
```

## ⚙️ Configuration

All key dependencies are defined in `package.json`:

- `@ionic/core` — UI components and styling framework
- `@google/generative-ai` — AI model integration SDK
- `vite` — Fast build tool for development and production

## 🎮 Getting Started

1. Start the development server with `npm run dev`
2. Open your browser and navigate to the provided URL
3. Type a message in the input field
4. Press Send to chat with the AI
5. Create new chats from the menu
6. Manage your chat history in the sidebar

## 📝 License

This project is licensed under the MIT License.

## 🤝 Author

Project developed as an educational example of Ionic Framework integration with AI APIs.

---

**Enjoy chatting with AI! 💭**

