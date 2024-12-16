# Ollama Chat Interface

This project provides a local chat interface for interacting with the Ollama API. Built with React and Material-UI, it features session management, real-time message streaming, and a responsive design. Below are the key components and features of the project, along with steps to set it up locally.

---

## Features

- **Session Management**: Create, save, delete, and retrieve chat sessions.
- **Message Streaming**: Real-time response streaming for a smooth user experience.
- **Dynamic Sidebar**: A collapsible sidebar to switch between sessions.
- **User-Friendly Interface**: Intuitive UI with Material-UI components.
- **Context-Aware Inputs**: Adjustments for model temperature and other settings dynamically.

---


## Prerequisites

- Node.js (v16 or later)
- npm or yarn package manager
- Local instance of Ollama API running at `http://localhost:11434`

---

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/ollama-chat-interface.git
   cd ollama-chat-interface
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```
   The app will be accessible at `http://localhost:3000`.

4. **Set Up the Ollama API**
   Ensure the Ollama API is running locally on `http://localhost:11434`. This project fetches chat responses from this endpoint.



---

## Deployment

To build the project for production:
```bash
npm run build
# or
yarn build
# or
pnpm run build
```
The output will be in the `build` directory, ready to be deployed.



## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [UUID](https://www.npmjs.com/package/uuid)

---

Thank you for using the Ollama Chat Interface! We hope it enhances your interaction experience with the Ollama API.

