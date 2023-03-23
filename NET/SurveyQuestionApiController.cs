using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Domain.ShareStory;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Domain.SurveyQuestions;
using Sabio.Models.Requests;
using Sabio.Models.Requests.SurveyQuestions;
using Sabio.Models;
using Sabio.Models.Requests.ShareStory;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/surveyquestions")]
    [ApiController]
    public class SurveyQuestionApiController : BaseApiController
    {
        private ISurveyQuestionService _service;
        private IAuthenticationService<int> _authService;
        public SurveyQuestionApiController(ISurveyQuestionService surveyQuestionService, ILogger<SurveyQuestionApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = surveyQuestionService;
            _authService = authService;
        }
        #region <---Question endpoints---|
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(SurveyQuestionAddRequest model)
        {

            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;

        }
        
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<SurveyQuestion>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                SurveyQuestion question = _service.Get(id);

                if (question == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<SurveyQuestion> { Item = question };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpGet("user")]
        public ActionResult<ItemResponse<Paged<SurveyQuestion>>> GetAllByCurrentUser(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<SurveyQuestion> page = _service.GetAllUserQuestions(pageIndex, pageSize, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SurveyQuestion>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);

        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<SurveyQuestion>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<SurveyQuestion> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SurveyQuestion>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);

        }

        [HttpPut]
        public ActionResult<SuccessResponse> Update(SurveyQuestionUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }
        #endregion

        #region <---Answer endpoints---|
        [HttpPost("answers")]
        public ActionResult<ItemResponse<int>> CreateAnswer(SurveyQuestionAnswerAddRequest model)
        {

            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddAnswer(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;

        }

        [HttpGet("answers/{id:int}")]
        public ActionResult<ItemResponse<SurveyQuestionAnswerOptions>> GetAnswer(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                SurveyQuestionAnswerOptions answerOption = _service.GetAnswer(id);

                if (answerOption == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<SurveyQuestionAnswerOptions> { Item = answerOption };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpGet("answers/user")]
        public ActionResult<ItemResponse<Paged<SurveyQuestionAnswerOptions>>> GetAllAnswersByCurrentUser(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<SurveyQuestionAnswerOptions> page = _service.GetAllUserAnswers(pageIndex, pageSize, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SurveyQuestionAnswerOptions>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);

        }

        [HttpGet("answers")]
        public ActionResult<ItemResponse<Paged<SurveyQuestionAnswerOptions>>> GetAllAnswers(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<SurveyQuestionAnswerOptions> page = _service.GetAllAnswers(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SurveyQuestionAnswerOptions>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);

        }

        [HttpPut("answers/{id:int}")]
        public ActionResult<SuccessResponse> UpdateAnswer(SurveyQuestionAnswerUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateAnswer(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("answers/{id:int}")]
        public ActionResult<SuccessResponse> DeleteAnswer(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteAnswer(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }
        #endregion
    }
}
