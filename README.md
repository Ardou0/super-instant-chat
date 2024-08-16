# SIC (super-instant-chat) Chat Application

## Overview

The SIC Chat Application is a retro-styled, WebSocket-based chat platform designed with a focus on simplicity, security, and user interactivity. The application provides a responsive user interface, where users can exchange messages in real-time, including the ability to send emojis and connect to various servers. The application also includes a filtering mechanism to prevent inappropriate content and a mechanism for automatically reconnecting users in case of connection issues.

A unique feature of the SIC Chat Application is its visual indicator system, where the main cursor blinks green or red to signal the status of the connection. If the cursor blinks green, the connection is stable, but if it blinks red, there is an issue that needs attention.

For the first connection through the client, the user must manually enter the initial server address; otherwise, they will not be able to interact with the application. This initial setup is crucial, as without connecting to a server, the user cannot send or receive messages.

Moreover, beyond cloning the entire project repository, users who wish to run their own server can do so easily by launching the server ([see here](https://github.com/Ardou0/super-instant-chat?tab=readme-ov-file#start-the-server-only)) and connecting to it via any SIC Chat client from any URL. This flexibility allows users to set up their own chat environments quickly and connect through various instances of the client.

## Features

- **Real-Time Communication**: Utilizes WebSocket for instant messaging between users.
- **Retro UI Design**: The interface has a nostalgic, old-school aesthetic with pixelated fonts and neon colors.
- **Emoji Support**: Users can send and receive emojis seamlessly.
- **Censorship**: The application includes a configurable word filter to prevent the sending of banned words.
- **Server Selection**: Users can select different servers to connect to from a list stored in local storage.
- **Notifications**: The application includes a responsive notification system to alert users of incoming messages and errors.
- **Error Handling**: If the WebSocket connection fails, the application attempts to reconnect automatically.
- **Dockerized**: The application runs within Docker containers, making deployment and management simple and consistent.

## Prerequisites

To run the SIC Chat Application, ensure that the following dependencies are installed on your system:

- **Docker & Docker-Compose**: For container management and orchestration.
- **Node.js & npm**: The latest versions for running the server and managing dependencies.
- **Screen**: To manage multiple terminal sessions easily.

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ardou0/super-instant-chat.git
   cd super-instant-chat
   ```

2. **Install NPM, Node.js Dependencies**:
   ```bash
   curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
   nvm install --lts
   apt install npm
   ```

3. **Setup Docker Environment**:
   Ensure Docker and Docker Compose are installed and properly configured on your system.

4. **Configure the Application**:
   Update the `config.json` file to customize settings such as banned words, server ports, etc.

## Usage

### Starting the Application

To start the application, use the following command:

```bash
bash start.bash
```

This command will:

- Launch the WebSocket server inside a Docker container.
- Start all necessary services using Docker Compose.
- Initialize a `screen` session to keep the process running in the background.

### Stopping the Application

To gracefully stop the application, use:

```bash
bash stop.bash
```

This command will:

- Terminate the WebSocket server.
- Stop all services managed by Docker Compose.
- Close the associated `screen` session.

### Start the server ONLY

In case if you only want to run the server, use :

```bash
cd server/
npm start
```

### Managing Servers

The application allows users to manage server connections:

- **Adding Servers**: Users can add new servers to the list by entering the server address in the input field and submitting it. The server list is stored in the browser's local storage.
- **Choosing Servers**: The interface provides an option to select from the list of servers to connect to.

## Code Overview

### WebSocket Server (`server.js`)

- **Connection Handling**: Manages new connections, assigns unique IDs to clients, and handles incoming messages.
- **Message and Ip Filtering**: Uses the `checkValidity()` function to filter out banned words and client.
- **Error Handling**: Sends error messages to clients if they attempt to send prohibited content.

### Client-Side JavaScript

- **Socket Connection**: Handles the WebSocket connection, sending, and receiving messages, and reconnecting on failures.
- **UI Updates**: Dynamically updates the chat interface based on incoming messages and user interactions.
- **Server Management**: Allows adding, selecting, and storing servers using local storage.

### Configuration (`config.json`)

This file contains application settings including:

- Banned words list.
- Censorship settings.
- Port numbers for WebSocket and HTTP servers.

## Development and Contribution

To contribute to the project:

1. **Fork the repository** and create a new branch for your feature or bugfix.
2. **Commit your changes** with clear and concise messages.
3. **Push to your branch** and create a pull request.

## License

The SIC Chat Application is licensed under the  Apache-2.0 License. See `LICENSE` for more information.

---

Feel free to modify the `README.md` as the project evolves and new features are added.