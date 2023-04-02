import React from "react";
import { Card, Container, Form, Row } from "react-bootstrap";
import surveyBuilderService from "services/surveyBuilderService";
import PropTypes from "prop-types";
// import debug from "sabio-debug";

// const _logger = debug.extend("SurveyQ");

function SurveyCard(props) {
     const question = props.question;

     const deleteSuccess = props.deleteSuccess;
     const deleteError = props.deleteError;

     const handleQuestionDelete = () => {
          const questionId = question.id;
          surveyBuilderService.deleteQuestion(questionId).then(deleteSuccess).catch(deleteError);
     };

     const renderQuestionContent = () => {
          let content = <input></input>;
          switch (question.type) {
               case 1:
                    content = (
                         <div>
                              <Form.Check type="radio" name="option" value="yes" label="Yes" />
                              <Form.Check type="radio" name="option" value="no" label="No" />
                              <Form.Check type="radio" name="option" value="idk" label="I don't know" />
                         </div>
                    );
                    break;
               case 2:
                    content = (
                         <div className="row m-1">
                              <Form.Control type="text" name="answer" placeholder="Enter your Answer" />
                         </div>
                    );
                    break;
               case 3:
                    content = (
                         <div className="row m-1">
                              <Form.Control as="textarea" type="text" name="answer" placeholder="Enter your Answer" />
                         </div>
                    );
                    break;
               case 4:
                    content = (
                         <div className="row m-1">
                              <Form.Control type="file" name="answer" />
                         </div>
                    );
                    break;
               case 8:
                    const answerOptions = question.answerOptions?.map((answer) => {
                         const answerText = answer.text;

                         return (
                              <div key={answerText + "key"}>
                                   <Form.Check type="radio" name="option" value={answer.value} label={answerText} />
                              </div>
                         );
                    });

                    content = <div>{answerOptions}</div>;
               default:
                    break;
          }

          return content;
     };

     return (
          <Row>
               <div>
                    <Card className="m-2">
                         <Card.Body>
                              <Container>
                                   <Row>
                                        <div className="row mb-3">
                                             <h5>{question.question}</h5>
                                        </div>
                                        <div>{question.helpText}</div>
                                        <div className="col-sm-8">{renderQuestionContent()}</div>
                                        <div className="col-sm-4 d-flex align-items-end flex-row-reverse">
                                             <div className="col d-flex align-items-end flex-row-reverse">
                                                  <button
                                                       className="btn btn-danger m-1"
                                                       type="button"
                                                       onClick={handleQuestionDelete}
                                                  >
                                                       Delete
                                                  </button>
                                             </div>
                                             <div className="col-sm d-flex align-items-end flex-row-reverse">
                                                  <button
                                                       className="btn btn-light btn-outline-dark m-1 d-none"
                                                       type="button"
                                                  >
                                                       Edit
                                                  </button>
                                             </div>
                                        </div>
                                   </Row>
                              </Container>
                         </Card.Body>
                    </Card>
               </div>
          </Row>
     );
}
SurveyCard.propTypes = {
     question: PropTypes.shape({
          id: PropTypes.number.isRequired,
          question: PropTypes.string.isRequired,
          type: PropTypes.number.isRequired,
          statusId: PropTypes.number.isRequired,
          helpText: PropTypes.string,
          answerOptions: PropTypes.arrayOf(
               PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    questionId: PropTypes.number.isRequired,
                    text: PropTypes.string.isRequired,
                    value: PropTypes.number,
               })
          ),
     }).isRequired,
     deleteSuccess: PropTypes.func.isRequired,
     deleteError: PropTypes.func.isRequired,
};

export default SurveyCard;
