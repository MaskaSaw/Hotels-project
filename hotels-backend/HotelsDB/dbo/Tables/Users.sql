CREATE TABLE [dbo].[Users] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [Login]        NVARCHAR (50)  NOT NULL,
    [PasswordHash] NVARCHAR (200) NULL,
    [IsAdmin]      BIT            NOT NULL,
    [PasswordSalt] NVARCHAR (256) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);





