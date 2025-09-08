# WhatsApp Messaging Bot with SQL Server Scheduler

This is a robust Node.js application that automates sending and receiving WhatsApp messages, using a Microsoft SQL Server database to manage a schedule for outgoing messages.

It's designed for reliability and security, featuring parameterized queries, external configuration, structured logging, and graceful shutdown.

## Key Features

- **Scheduled Messaging**: Schedule messages to be sent at a specific date and time.
- **Business Hours**: Restrict message sending to specific hours of the day.
- **Automated Replies**: Automatically sends a configurable reply to any user who messages the bot.
- **Attachment Support**: Send various types of files (PDFs, images, etc.) as attachments.
- **Database Integration**: Uses a Microsoft SQL Server backend to store and manage the message schedule and log incoming messages.
- **Secure**: Protects against SQL injection and keeps credentials safe using environment variables.
- **Resilient**: Handles message processing errors individually without crashing.
- **Structured Logging**: Keeps detailed logs in `combined.log` and `error.log` for easy debugging.
- **Easy Configuration**: All key settings (database credentials, business hours, polling time) are managed in a `.env` file.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

## Installation & Setup

Follow these steps to get the application running.

### 1. Clone the Repository

```bash
git clone https://github.com/touhidalam69/whatsapp-sql-scheduler.git
cd whatsapp-sql-scheduler
```

### 2. Install Dependencies

Install the required npm packages.

```bash
npm install
```

### 3. Set up the Database

You need to create the necessary tables and indexes in your SQL Server database.

1.  Connect to your SQL Server instance using a tool like SQL Server Management Studio (SSMS) or Azure Data Studio.
2.  Create a new database or choose an existing one.
3.  Open the `database_schema.sql` file from this project.
4.  Execute the entire SQL script. This will create two tables (`WP_MessgeSchedule` and `WP_IncomingMessages`) and a performance-enhancing index.

### 4. Configure Environment Variables

The application uses a `.env` file to manage all configuration.

1.  Create a copy of the example file and name it `.env`.

    ```bash
    # On Windows
    copy .env.example .env

    # On macOS/Linux
    cp .env.example .env
    ```

2.  Open the `.env` file and fill in the values for your SQL Server instance and desired application settings.

## Running the Application

Once the setup is complete, you can start the application with:

```bash
npm start
```

### First Run: WhatsApp Authentication

1.  On the first run, a QR code will appear in your terminal.
2.  Open WhatsApp on your phone, go to **Settings > Linked Devices**, and scan the QR code.
3.  Once authenticated, the application will create a local session in the `.wwebjs_auth` folder so you don't have to scan the QR code on every run.
4.  The bot is now running and will start processing messages according to your schedule.

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
