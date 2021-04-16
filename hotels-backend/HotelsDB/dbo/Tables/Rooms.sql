CREATE TABLE [dbo].[Rooms] (
    [Id]         INT            IDENTITY (1, 1) NOT NULL,
    [RoomType]   NVARCHAR (50)  NOT NULL,
    [VacantBeds] INT            NOT NULL,
    [Cost]       DECIMAL (6, 2) NOT NULL,
    [Image]      NVARCHAR (100) NULL,
    [RoomNumber] NVARCHAR (20)  NOT NULL,
    [HotelId]    INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([HotelId]) REFERENCES [dbo].[Hotels] ([Id])
);



