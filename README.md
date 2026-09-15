![Preview image](https://github.com/kirillmelcin96/webllama/blob/main/preview.png)

**webllama** - is a selfhosted AI platform providing access to Ollama models using API. Written in Vue.js. Runs in your browser.

## Key features

- 🚀 **Instant setup:** Just clone the repository and run the app right in your browser.
- ✈︎ **Works offline:** Fully standalone interaction with local models.
- 🔒 **Private:** All conversations remain yours. Zero telemetry. Zero tracking.
- 🧠 **Automatic model detection:** The app automatically finds and uses models already installed with your local Ollama instance.
- 💬 **Chat history storage:** All your conversations are stored directly in your browser (IndexedDB).
- 🤫 **“Incognito Mode”:** This allows you to have private, temporary chats without saving your history.
- 📄 **Rich output format:** Supports Markdown formatting, code, and complex LaTeX formulas for structured responses.
- 💡 **“Thinking Mode”:** Enable this mode for more detailed and thoughtful responses from the AI.

## Before start

For **webllama** to work properly, you need to install and run **Ollama**. **Ollama** is a backend for downloading and interacting with local AI models.

If you already have **Ollama** installed, proceed to the [installation](https://github.com/kirillmelcin96/webllama#installation).

If you haven't installed it on your computer yet, follow these steps:

[Download Ollama](https://ollama.com/download) from the official website, then run:

```bash
ollama pull gemma4:e2b
```

This command downloads the `gemma4:e2b` model by Google. You can choose other models to install, such as: Qwen, Llama, Mistral, DeepSeek, etc. See the full list of available models [here](https://ollama.com/search).

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

## Features to be added soon

- Search in chats
- Folders (Projects)
- Hot keys
- Ability to unload models from memory
- Export/Import chat history
- Text-to-speech button
- Custome themes
- (WIP) System prompts and personal settings
- (DONE) ~~Temporary chats (incognito mode)~~

