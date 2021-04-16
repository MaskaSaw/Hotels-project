CREATE TABLE [dbo].[Reservations] (
    [Id]            INT      IDENTITY (1, 1) NOT NULL,
    [UserId]        INT      NOT NULL,
    [RoomId]        INT      NOT NULL,
    [StartDate]     DATE     NOT NULL,
    [EndDate]       DATE     NOT NULL,
    [Cost]          DECIMAL(6,2) NOT NULL,
    [ArrivalTime]   TIME (0) NULL,
    [DepartureTime] TIME (0) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms] ([Id]),
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);



