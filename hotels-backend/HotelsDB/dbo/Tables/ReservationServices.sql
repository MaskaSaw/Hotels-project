CREATE TABLE [dbo].[ReservationServices] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (20)  NOT NULL,
    [Cost]          DECIMAL (9, 2) NOT NULL,
    [ReservationId] INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([ReservationId]) REFERENCES [dbo].[Reservations] ([Id])
);

