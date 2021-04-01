CREATE TABLE [dbo].[RoomBlocks] (
    [Id]       INT           IDENTITY (1, 1) NOT NULL,
    [End]      SMALLDATETIME NOT NULL,
    [CheckIn]  DATE          NOT NULL,
    [CheckOut] DATE          NOT NULL,
    [RoomId]   INT           NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms] ([Id])
);

