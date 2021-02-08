﻿CREATE TABLE [dbo].[Reservations] (
    [Id]          INT      IDENTITY (1, 1) NOT NULL,
    [UserId]      INT      NOT NULL,
    [RoomId]      INT      NOT NULL,
    [StartDate]   DATE     NOT NULL,
    [EndDate]     DATE     NOT NULL,
    [ArrivalTime] TIME (7) NOT NULL,
    [Parking]     BIT      NOT NULL,
    [Massage]     BIT      NOT NULL,
    [ExtraTowels] BIT      NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Rooms] ([Id]),
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);