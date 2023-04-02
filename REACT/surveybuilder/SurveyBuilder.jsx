import React, { useEffect, useState } from "react";
import Section from "components/common/Section";
import "./surveybuilderform.css";
import { Button, Card, Container, Nav, Navbar, Row } from "react-bootstrap";
import SurveyQuestionForm from "./SurveyQuestionForm";
import SurveyCard from "./SurveyCard";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import surveyBuilderService from "services/surveyBuilderService";
import debug from "sabio-debug";

const _logger = debug.extend("SurveyQ");

function SurveyBuilder() {
     //#region State Objs
     const [showForm, setShowForm] = useState(false);
     const [surveyData, setSurveyData] = useState({ name: "", surveyQuestions: [], questionCount: 0 });
     //#endregion
     const surveyId = useParams();

     useEffect(() => {
          surveyBuilderService
               .getSurveyDetails(surveyId.id)
               .then(onGetSurveyDetailsSuccess)
               .catch(onGetSurveyDetailsError);
     }, [surveyData.name, surveyData.questionCount]);

     const navigate = useNavigate();

     const handleFormToggle = () => {
          setShowForm((prevState) => !prevState);
     };

     const goToSurveyManager = () => {
          navigate(`/surveys/new`);
     };

     //#region success and error handlers
     const onCreateQuestionSuccess = (response, resetForm, values) => {
          const questionId = response.item;
          const answerOptions = values.answerOptions;
          const questionType = values.questionTypeId;

          const mappedAnswer = answerOptions.map((answer) => {
               let answerPayload = {
                    questionId: questionId,
                    text: answer,
                    value: null,
                    additionalInfo: null,
               };
               return answerPayload;
          });

          if (questionType === "1") {
               const yesNoIdkArray = ["Yes", "No", "I don't know"];
               const yesNoIdkAnwsers = yesNoIdkArray.map((answer) => {
                    let answerPayload = {
                         questionId: questionId,
                         text: answer,
                         value: null,
                         additionalInfo: null,
                    };
                    return answerPayload;
               });

               for (let index = 0; index < yesNoIdkAnwsers.length; index++) {
                    const answer = yesNoIdkAnwsers[index];

                    surveyBuilderService.addAnswer(answer).then(onAddAnswerOptionSuccess).catch(onAddAnswerOptionError);
               }
          } else if (questionType === "8") {
               for (let index = 0; index < mappedAnswer.length; index++) {
                    const answer = mappedAnswer[index];

                    surveyBuilderService.addAnswer(answer).then(onAddAnswerOptionSuccess).catch(onAddAnswerOptionError);
               }
          } else {
          }

          toast.success("Question created and added to survey.");
          resetForm();
          setSurveyData((prevState) => {
               const newQCount = { ...prevState };
               newQCount.questionCount = surveyData.questionCount + 1;
               return newQCount;
          });
     };
     const onCreateQuestionError = (err) => {
          _logger({ error: err }, mappedAnswer, "load");
          toast.error("Question creation was unsuccessful.");
     };
     const onGetSurveyDetailsSuccess = (response) => {
          let surveyName = response.item.name;
          let questionArray = response.item.questions;
          const activeQuestions = questionArray.filter(filterActiveQuestions);
          setSurveyData((prevState) => {
               const surveyInfo = { ...prevState };
               surveyInfo.name = surveyName;
               surveyInfo.questionCount = response.item.questions?.length;
               const mappedQuestions = activeQuestions?.map(mapQuestions);
               surveyInfo.surveyQuestions = [mappedQuestions];
               return surveyInfo;
          });
     };
     const onGetSurveyDetailsError = (err) => {
          _logger({ error: err });
     };

     const onAddAnswerOptionSuccess = (response) => {
          _logger(response);
          toast.success("Answer Options added.");
     };
     const onAddAnswerOptionError = (err) => {
          _logger({ error: err });
          toast.error("Answer Options add was unsuccessful.");
     };

     const onQuestionDeleteSuccess = (response) => {
          _logger(response);
          toast.success("Question Deleted.");
          setSurveyData((prevState) => {
               const newQCount = { ...prevState };
               newQCount.questionCount = surveyData.questionCount - 1;
               return newQCount;
          });
     };

     const onQuestionDeleteError = (err) => {
          _logger({ error: err });
          toast.error("Delete unsuccessful.");
     };
     //#endregion

     const mapQuestions = (aQuestion) => {
          return (
               <SurveyCard
                    question={aQuestion}
                    key={"questionListA" + aQuestion.id}
                    deleteSuccess={onQuestionDeleteSuccess}
                    deleteError={onQuestionDeleteError}
               />
          );
     };

     const filterActiveQuestions = (question) => {
          let active = false;
          if (question.statusId === 1) {
               active = true;
          }
          return active;
     };

     return (
          <React.Fragment>
               <Section className="py-0 overflow-hidden light" position="center bottom" overlay>
                    <Row>
                         <Navbar bg="light" expand="lg">
                              <Nav className="me-auto my-2 my-lg-0">
                                   <Button type="button" className="btn btn-dark" onClick={goToSurveyManager}>
                                        {"<"} Surveys
                                   </Button>
                              </Nav>
                         </Navbar>
                    </Row>
                    <Container className="d-flex flex-column">
                         <Row>
                              {showForm !== false && (
                                   <Container className="col-sm-6">
                                        <Card className="m-4 ms-2 mb-3 me-1 rounded-0 animated slideInUp">
                                             <Card.Body>
                                                  <div>
                                                       <h1 className="text-center">Survey Question</h1>
                                                  </div>

                                                  {showForm !== false && (
                                                       <SurveyQuestionForm
                                                            formToggler={handleFormToggle}
                                                            success={onCreateQuestionSuccess}
                                                            error={onCreateQuestionError}
                                                       />
                                                  )}
                                             </Card.Body>
                                        </Card>
                                   </Container>
                              )}
                              <Container name="surveyContainer" className="col-sm-6">
                                   <Card className="m-4 ms-1 mb-3 me-2 rounded-0">
                                        <div>
                                             <h1 className="text-center">{surveyData.name}</h1>
                                        </div>
                                        <Row>
                                             <div className="m-2 mb-3 row form-group" id="nextQuestion">
                                                  <div className="col d-flex align-items-end flex-row">
                                                       <button
                                                            className="btn btn-primary m-1"
                                                            type="button"
                                                            onClick={handleFormToggle}
                                                       >
                                                            Add Question {"+"}
                                                       </button>
                                                  </div>
                                             </div>
                                        </Row>
                                        <Container>
                                             <div className="survey-builder-scrollit">{surveyData.surveyQuestions}</div>
                                        </Container>
                                   </Card>
                              </Container>
                         </Row>
                         <ToastContainer />
                    </Container>
               </Section>
          </React.Fragment>
     );
}

export default SurveyBuilder;
