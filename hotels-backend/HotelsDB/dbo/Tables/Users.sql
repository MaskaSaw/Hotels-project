CREATE TABLE [dbo].[Users] (
    [Id]           INT             IDENTITY (1, 1) NOT NULL,
    [Login]        NVARCHAR (50)   NOT NULL,
    [PasswordHash] VARBINARY (MAX) NULL,
    [PasswordSalt] VARBINARY (MAX) NULL,
    [Role]         NVARCHAR (50)   NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);







