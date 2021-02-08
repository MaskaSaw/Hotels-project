CREATE TABLE [dbo].[Users] (
    [Id]       INT           IDENTITY (1, 1) NOT NULL,
    [Login]    NVARCHAR (50) NOT NULL,
    [PasswordHash] NVARCHAR (100) NOT NULL,
    [IsAdmin]  BIT           NOT NULL,
    [PasswordSalt] NVARCHAR(100) NOT NULL, 
    PRIMARY KEY CLUSTERED ([Id] ASC)
);