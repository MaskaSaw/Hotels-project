CREATE TABLE [dbo].[Hotels] (
    [Id]      INT            IDENTITY (1, 1) NOT NULL,
    [Name]    NVARCHAR (50)  NOT NULL,
    [Country] NVARCHAR (20)  NOT NULL,
    [City]    NVARCHAR (20)  NOT NULL,
    [Address] NVARCHAR (50)  NOT NULL,
    [Image]   NVARCHAR (100) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);



