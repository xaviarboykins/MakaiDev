USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[SurveyQuestions_Update]    Script Date: 3/23/2023 10:11:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author: Xaviar Boykins
-- Create date: 07 MAR 23
-- Description: Update Survey Questions
-- Code Reviewer: Osein Solkin

-- MODIFIED BY:		
-- MODIFIED DATE:	
-- Code Reviewer:	
-- Note:				
-- =============================================

CREATE proc [dbo].[SurveyQuestions_Update]

					@UserId int --aka CreatedBy
					,@Question nvarchar(500)
					,@HelpText nvarchar(255)
					,@IsRequired bit
					,@IsMultipleAllowed bit
					,@QuestionTypeId int
					,@SurveyId int
					,@StatusId int
					,@SortOrder int
					,@Id int
		
as

/*  ---Test---


			Declare @Id int = 2

			Declare @UserId int = 12
					,@Question nvarchar(500) = 'Updated good question about an opinion?'
					,@HelpText nvarchar(255) = 'select one that best descibes your response'
					,@IsRequired bit = 1
					,@IsMultipleAllowed bit = 0
					,@QuestionTypeId int = 1
					,@SurveyId int = 1
					,@StatusId int = 1
					,@SortOrder int = 1
		
			Execute dbo.SurveyQuestions_Update
												@UserId
												,@Question
												,@HelpText
												,@IsRequired
												,@IsMultipleAllowed
												,@QuestionTypeId
												,@SurveyId
												,@StatusId
												,@SortOrder
												,@Id

			Select *
			From dbo.SurveyQuestions
			Where Id = @Id

			Select *
			From dbo.SurveyQuestions
*/

BEGIN

	Declare @Date datetime2(7) = GETUTCDATE();

	UPDATE [dbo].[SurveyQuestions]
		SET [UserId] = @UserId--aka createdBy
           ,[Question] = @Question
           ,[HelpText] = @HelpText
           ,[IsRequired] = @IsRequired
           ,[IsMultipleAllowed] = @IsMultipleAllowed
		   ,[QuestionTypeId] = @QuestionTypeId
		   ,[SurveyId] = @SurveyId
		   ,[StatusId] = @StatusId
		   ,[SortOrder] = @SortOrder
		   ,[DateModified] = @Date

		WHERE Id = @Id

END
GO
