# WhatsApp Messaging Bot with SQL Server Scheduler

This is a robust Node.js application that automates sending and receiving WhatsApp messages, using a Microsoft SQL Server database to manage a schedule for outgoing messages.

It's designed for reliability and security, featuring parameterized queries, external configuration, structured logging, and graceful shutdown. It also includes a production-ready build process with webpack and process management with PM2.

## Key Features

- **Scheduled Messaging**: Schedule messages to be sent at a specific date and time.
- **Business Hours**: Restrict message sending to specific hours of the day.
- **Automated Replies**: Automatically sends a configurable reply to any user who messages the bot.
- **Attachment Support**: Send various types of files (PDFs, images, etc.) as attachments.
- **Database Integration**: Uses a Microsoft SQL Server backend to store and manage the message schedule and log incoming messages.
- **Secure**: Protects against SQL injection and keeps credentials safe using environment variables.
- **Resilient**: Handles message processing errors individually without crashing.
- **Structured Logging**: Keeps detailed logs in `combined.log` and `error.log` for easy debugging.
- **Production Ready**: Includes a webpack build process to bundle the application and PM2 for process management in production.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

## Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/touhidalam69/whatsapp-sql-scheduler.git
    cd whatsapp-sql-scheduler
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Set up the Database**:
    -   Connect to your SQL Server instance.
    -   Create a new database or choose an existing one.
    -   Execute the SQL script in `src/db/database_schema.sql` to create the necessary tables.

4.  **Configure Environment Variables**:
    -   Create a `.env` file by copying the `.env.example` file.
    -   Fill in the values for your SQL Server instance and desired application settings.

## Development

For development, you can run the application directly with:

```bash
npm start
```

This will start the application in development mode. Any changes you make to the source code will require a restart.

### WhatsApp Authentication

On the first run, a QR code will appear in your terminal. Scan this with WhatsApp on your phone to authenticate. A session will be saved in the `.wwebjs_auth` folder for subsequent runs.

## Production Build

For production, you should create a bundled version of the application. This project uses webpack to bundle all the JavaScript code into a single file.

To create the production build, run:

```bash
npm run build
```

This will create a `dist` directory with a `bundle.js` file inside. This is the file you will run in production.

## Running in Production

For running the application in a production environment, we recommend using [PM2](https://pm2.keymetrics.io/), a process manager for Node.js.

This project includes an `ecosystem.config.js` file to configure PM2.

### First Run and WhatsApp Authentication

The very first time you run the application in a production environment, you need to scan the QR code to authenticate. This is an interactive process that needs to be done in the foreground.

1.  **Run the bundled application directly with Node.js**:
    ```bash
    node dist/bundle.js
    ```

2.  **Scan the QR code**: A QR code will appear in your terminal. Scan it with WhatsApp on your phone.

3.  **Stop the application**: Once you are authenticated, you can stop the application by pressing `Ctrl+C`. A session file will be saved in the `.wwebjs_auth` folder.

### Starting the Application with PM2

After the initial authentication, you can run the application with PM2 for long-term, stable operation.

1.  **Start the application with PM2**:
    ```bash
    npm run start:prod
    ```
    This will start the bundled application (`dist/bundle.js`) with PM2 in production mode. It will use the saved session and will not require a QR code scan.

2.  **Manage the application with PM2**:
    -   **View logs**: `pm2 logs whatsapp-bot`
    -   **Monitor**: `pm2 monit`
    -   **Stop**: `npm run stop:prod`
    -   **Restart**: `pm2 restart whatsapp-bot`

## How It Works

- **Outgoing Messages**: The application polls the `WP_MessgeSchedule` table every few seconds (defined by `POLLING_INTERVAL_MS`). If it finds a pending message within the allowed `WORK_HOUR` window, it sends it.
- **Incoming Messages**: When a user sends a message to the bot, it automatically replies with the `DEFAULT_REPLY_MESSAGE` and logs the user's original message in the `WP_IncomingMessages` table.

## Logging

All application events are logged to files in the project root:

- `combined.log`: Contains all logs (info, warnings, errors).
- `error.log`: Contains only error logs.

In a development environment, logs are also printed to the console.

---

**Disclaimer**: This project relies on `whatsapp-web.js`, which is an unofficial library. It works by automating a real instance of WhatsApp Web in the background, and it may break if WhatsApp makes changes to their web interface.