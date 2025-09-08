-- This file contains the necessary database schema for the project.

-- =====================================================================================
-- OUTGOING MESSAGES: Table for storing and scheduling messages to be sent by the bot.
-- =====================================================================================
CREATE TABLE [dbo].[WP_MessgeSchedule](
	[ScheduleId] [INT] IDENTITY(10000000,1) NOT NULL,
	[ScheduleDate] [DATETIME] NOT NULL,
	[WhatsappNo] [NVARCHAR](50) NULL,
	[MessageText] [NVARCHAR](MAX) NULL,
	[FileName] [NVARCHAR](500) NULL,
	[Attachment] [NVARCHAR](MAX) NULL,
	[ScheduleBy] [NVARCHAR](50) NOT NULL,
	[EntryDate] [DATETIME] NOT NULL,
	[DeliveryStatus] [TINYINT] NOT NULL, -- 0=Pending, 1=Success, 2=Failed/Not Registered
	[DeliveryDate] [DATETIME] NULL,
	[Status] [NVARCHAR](1000) NULL,
 CONSTRAINT [PK__WP_Messg__9C8A5B493C1089C4] PRIMARY KEY CLUSTERED 
(
	[ScheduleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[WP_MessgeSchedule] ADD  CONSTRAINT [DF_WP_MessgeSchedule_FileName]  DEFAULT (N'testfile.pdf') FOR [FileName]
GO

-- Index to improve performance when querying for pending messages.
CREATE NONCLUSTERED INDEX IX_WP_MessgeSchedule_ForSending
ON [dbo].[WP_MessgeSchedule] ([DeliveryStatus], [ScheduleDate]);
GO


-- =====================================================================================
-- INCOMING MESSAGES: Table for logging all messages received by the bot.
-- =====================================================================================
CREATE TABLE [dbo].[WP_IncomingMessages](
    [IncomingId] [INT] IDENTITY(1,1) NOT NULL,
    [ReceivedAt] [DATETIME] NOT NULL DEFAULT GETDATE(),
    [WhatsappNo] [NVARCHAR](50) NOT NULL,
    [MessageBody] [NVARCHAR](MAX) NULL,
 CONSTRAINT [PK_WP_IncomingMessages] PRIMARY KEY CLUSTERED 
(
	[IncomingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO