USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[SurveyQuestions_Insert]    Script Date: 3/23/2023 10:11:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author: Xaviar Boykins
-- Create date: 28 FEB 23
-- Description: Insert Survey Question
-- Code Reviewer: Osein Solkin

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[SurveyQuestions_Insert]


					@UserId int --aka CreatedBy
					,@Question nvarchar(500)
					,@HelpText nvarchar(255)
					,@IsRequired bit
					,@IsMultipleAllowed bit
					,@QuestionTypeId int
					,@SurveyId int
					,@StatusId int
					,@SortOrder int
					,@Id int OUTPUT
					
					


as
/*
			Declare @Id int = 0

			Declare @UserId int = 12
					,@Question nvarchar(500) = 'good question about an opinion?'
					,@HelpText nvarchar(255) = 'select one that best descibes your response'
					,@IsRequired bit = 1
					,@IsMultipleAllowed bit = 0
					,@QuestionTypeId int = 1
					,@SurveyId int = 1
					,@StatusId int = 1
					,@SortOrder int = 1
					

			Select*
			From dbo.SurveyQuestions

			Execute dbo.SurveyQuestions_Insert
												@UserId
												,@Question
												,@HelpText
												,@IsRequired
												,@IsMultipleAllowed
												,@QuestionTypeId
												,@SurveyId
												,@StatusId
												,@SortOrder
												,@Id OUTPUT
			
			
			Select *
			From dbo.SurveyQuestions
			Where Id = @Id

			Select *
			From dbo.SurveyQuestions
			


*/
BEGIN

Declare @Date datetime2(7) = GETUTCDATE()

INSERT INTO [dbo].[SurveyQuestions]
           ([UserId] --aka createdBy
           ,[Question]
           ,[HelpText]
           ,[IsRequired]
           ,[IsMultipleAllowed]
		   ,[QuestionTypeId]
		   ,[SurveyId]
		   ,[StatusId]
		   ,[SortOrder]
		   ,[DateCreated]
		   ,[DateModified])
     VALUES
           (@UserId
			,@Question
			,@HelpText
			,@IsRequired
			,@IsMultipleAllowed
			,@QuestionTypeId
			,@SurveyId
			,@StatusId
			,@SortOrder
            ,@Date
		    ,@Date)

     SET @Id = SCOPE_IDENTITY()

	 
END


GO
