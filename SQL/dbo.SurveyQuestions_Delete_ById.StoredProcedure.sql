USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[SurveyQuestions_Delete_ById]    Script Date: 3/23/2023 10:11:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



-- =============================================
-- Author: Xaviar Boykins
-- Create date: 07 MAR 23
-- Description: Updates Question status to in Active
-- Code Reviewer: Osein Solkin

-- MODIFIED BY: Xaviar Boykins
-- MODIFIED DATE: 09 MAR 23
-- Code Reviewer: Dylan Mccallum
-- Note:
-- =============================================

CREATE proc [dbo].[SurveyQuestions_Delete_ById]

					@Id int 



as

/*-----Test Code-----

		Declare @Id int = 2

		Select *
		From dbo.SurveyQuestions

		Execute dbo.SurveyQuestions_Delete_ById @Id

		Select *
		From dbo.SurveyQuestions
		Where Id = @Id

		Select *
		From dbo.SurveyQuestions

*/

BEGIN


	    Declare @Date datetime2(7) = GETUTCDATE();
		Declare @Deleted int = 2

		UPDATE [dbo].[SurveyQuestions]
		SET [StatusId] = @Deleted
		   ,[DateModified] = @Date

		WHERE Id = @Id


END


GO
