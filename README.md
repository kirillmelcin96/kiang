# Webllama
**Webllama** - is a selfhosted offline AI platform providing access to ollama models using API. Written in Vue.js

![Demo image](https://github.com/kirillmelcin96/webllama/blob/main/demo.png)

## Key features

- 🚀 **Instant setup without Docker:** Just clone the repository and run the app right in your browser. No complicated containers needed!
- ✈︎ **Works offline:** Fully standalone interaction with models that works even without an internet connection.
- 🧠 **Automatic model detection:** The app automatically finds and uses models already installed on your local Ollama system.
- 💬 **Chat history storage:** All your conversations are securely stored right in your browser (IndexedDB).
- 📄 **Rich output format:** Supports Markdown formatting, code, and complex LaTeX formulas for structured responses.
- 💡 **“Thinking Mode”:** Enable this mode for more detailed and thoughtful responses from the AI.

## Installation 

1. Clone the repository
``` bash
git clone https://github.com/kirillmelcin96/webllama.git
```

2. Install dependencies
``` bash
npm install

# or if you prefer pnpm
pnpm install
```

3. Run build command

``` bash
npm run build

# or
pnpm build
```
Files will be available from the `/dist` directory

4. Open `/dist/index.html` file using your browser and that's it!

## Features to be added

- Search in chats
- Mobile version of the chat history
- Text-to-speech button
- More themes
- System prompts and personal settings
- Temporary chats (incognito mode)

