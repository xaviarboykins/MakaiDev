USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[SurveyQuestions_SelectAll]    Script Date: 3/23/2023 10:11:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




-- =============================================
-- Author: Xaviar Boykins
-- Create date: 06 MAR 23
-- Description: Select All Questions
-- Code Reviewer: Osein Solkin

-- MODIFIED BY: Xaviar Boykins
-- MODIFIED DATE: 09 MAR 23
-- Code Reviewer: Dylan Mccallum
-- Note:
-- =============================================

CREATE proc [dbo].[SurveyQuestions_SelectAll]

					@PageIndex int
					,@PageSize int
					
					


as
/*
			
			Declare @PageIndex int = 0
					,@PageSize int = 10

			
			
			Execute dbo.SurveyQuestions_SelectAll 
															@PageIndex
															,@PageSize
			


*/
BEGIN

		Declare @OffSet int = @PageIndex * @PageSize

		Select s.Id
			   ,s.UserId
			   ,u.FirstName
			   ,u.LastName
			   ,u.Mi
			   ,u.AvatarUrl
			   ,s.Question
			   ,s.HelpText
			   ,s.IsRequired
			   ,s.IsMultipleAllowed
			   ,s.QuestionTypeId
			   ,q.[Name]
			   ,s.SurveyId
			   ,s.StatusId
			   ,st.[Name]
			   ,s.SortOrder
			   ,s.DateCreated
			   ,s.DateModified
			   ,TotalCount = COUNT(1) OVER()

		From dbo.SurveyQuestions as s inner join dbo.Users as u
		on s.UserId = u.Id
		inner join dbo.QuestionTypes as q
		on s.QuestionTypeId = q.Id
		inner join dbo.StatusTypes as st
		on s.StatusId = st.Id

		WHERE s.StatusId = 1

		ORDER BY s.Id

		
		OFFSET @OffSet ROWS
		Fetch Next @PageSize ROWS ONLY

	 
END


GO
