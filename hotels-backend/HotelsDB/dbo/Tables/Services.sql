CREATE TABLE [dbo].[Services] (
    [Id]      INT            IDENTITY (1, 1) NOT NULL,
    [Name]    NVARCHAR (20)  NOT NULL,
    [Cost]    DECIMAL (9, 2) NOT NULL,
    [HotelId] INT            NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    FOREIGN KEY ([HotelId]) REFERENCES [dbo].[Hotels] ([Id])
);

