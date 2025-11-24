# WhatsSend 📱

<div align="center">

![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A modern, responsive WhatsApp bulk messaging automation tool**

[Features](#features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 🌟 Features

- ✨ **Modern UI/UX** - WhatsApp-inspired design with responsive layout
- 🏳️ **Smart Country Selector** - 3D-styled dropdown that auto-appends country codes
- 📱 **Multi-Number Support** - Send to multiple contacts at once (comma-separated)
- 🔒 **Smart Validation** - Input field restricts typing to numbers and commas only
- 🔄 **Message Repetition** - Configure how many times to send each message
- ⏱️ **Smart Delays** - Customizable delays between messages to avoid spam detection
- 😊 **Emoji Support** - Built-in emoji picker for expressive messaging
- 🌐 **Network Access** - Access the app from any device on your local network
- 📊 **Real-time Status** - Get instant feedback on message delivery status

## 🚀 Quick Start

### Get Started in 3 Minutes

#### Step 1: Install Dependencies (2 minutes)

```bash
# Install Node.js dependencies
npm install

# Create and activate Python virtual environment
python -m venv .venv

# Windows:
.\.venv\Scripts\activate

# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

#### Step 2: Start the Application (30 seconds)

```bash
npm run dev
```

You'll see the local and network URLs in your terminal.

#### Step 3: Send Your First Message (30 seconds)

1. Open the local URL shown in your terminal
2. Fill in the form:
   - **Receiver Numbers**: Select country, then type numbers separated by commas
     - Example: `9876543210, 9988776655`
   - **Count**: `1`
   - **Delay**: `2`
   - **Message**: `Hello from WhatsSend! 👋`
3. Click **Send Now**
4. WhatsApp Web will open - log in if needed
5. Watch your message send automatically! 🎉

### 📱 Access from Mobile

1. Find the **Network URL** in your terminal
2. Open this URL on your phone (must be on same WiFi)
3. Use the app from anywhere in your home!

## 📖 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Google Chrome** (for WhatsApp Web automation)

### Step 1: Clone the Repository

```bash
git clone https://github.com/alias1506/WhatsSend.git
cd WhatsSend
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

### Step 3: Set Up Python Virtual Environment

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.\.venv\Scripts\activate

# On macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

## 🎯 Usage

### Starting the Application

Run both the frontend and backend simultaneously:

```bash
npm run dev
```

This will start both the frontend (Vite) and backend (Node.js) servers. Check your terminal for the URLs.

### Network Access

To access the app from other devices on your network:

1. After running `npm run dev`, look for the "Network" URL in the terminal
2. Use this URL on any device connected to the same network

### First-Time Setup

1. **Launch the app** using `npm run dev`
2. **Fill in the form**:
   - **Country**: Select your country from the dropdown (e.g., 🇮🇳 India +91).
   - **Receiver Numbers**: Enter one or more phone numbers separated by commas.
     - *Note: You don't need to type the country code again; the app adds it automatically!*
     - Valid input: `9876543210, 8877665544`
   - **Count**: Number of times to send the message
   - **Delay**: Seconds to wait between messages
   - **Message**: Your message text (with emoji support!)
3. **Click "Send Now"**
4. **WhatsApp Web will open** in your default browser
6. **Messages will be sent automatically**

### Pro Tips

- **Bulk Sending**: Separate multiple numbers with commas
- **Emoji Support**: Click the 😊 icon to add emojis
- **Network Access**: Use the Network URL to access from any device
- **Session Persistence**: You only need to log in once - sessions are saved

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **react-international-phone** - Smart phone input with country selector
- **emoji-picker-react** - Emoji picker component

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing

### Automation
- **Python** - Scripting language
- **Playwright** - Browser automation library

## 📁 Project Structure

```
WhatsSend/
├── src/                       # React frontend source
│   ├── App.jsx               # Main React component
│   ├── index.css             # Global styles
│   └── main.jsx              # React entry point
├── backend/                   # Backend services
│   ├── server/               # Node.js backend
│   │   └── server.js         # Express API server
│   ├── scripts/              # Python automation scripts
│   │   └── send_message.py   # WhatsApp message sender
│   └── requirements.txt      # Python dependencies
├── public/                    # Static assets
│   └── message-send.svg      # App icon
├── .venv/                    # Python virtual environment
├── chrome_data/              # WhatsApp Web session data (auto-generated)
├── package.json              # Node.js dependencies
├── vite.config.js            # Vite configuration
├── postcss.config.js         # PostCSS configuration
└── README.md                 # This file
```

## ⚙️ Configuration

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run client` | Start only the frontend (Vite) |
| `npm run server` | Start only the backend (Node.js) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

### Environment Variables

No environment variables are required for basic usage.

## 🔧 Troubleshooting

### Browser Not Opening
- Ensure Chrome is installed
- Check if WhatsApp Web is accessible in your browser
- Verify Python virtual environment is activated

### Messages Not Sending
- Confirm you're logged into WhatsApp Web
- Check phone number format (include country code with `+`)
- Ensure delay is set to at least 2 seconds to avoid rate limiting

### Network Access Issues
- Check firewall settings
- Ensure devices are on the same network
- Verify the network URL from terminal output

### "Network error" message?
- Ensure backend is running (`npm run dev` starts both)
- Check if the backend port is available

### Unicode/Emoji Display Issues
- The script automatically handles UTF-8 encoding on Windows
- Emojis are sent to WhatsApp correctly even if console display is limited

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational purposes only. Use responsibly and in accordance with WhatsApp's Terms of Service. The developers are not responsible for any misuse or violations.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) - Browser automation
- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

---

<div align="center">

Made with ❤️

⭐ Star this repo if you find it helpful!

</div>
