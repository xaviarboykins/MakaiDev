import React, { useState } from "react";
import { Card, Form, Button, Container, Modal, Row, Col } from "react-bootstrap";
import debug from "sabio-debug";
import surveysService from "services/surveysService";
import toastr from "toastr";
import PropTypes from "prop-types";

const SurveyPreview = (props) => {
     const surveyIdNumber = props.currentSurveyId;
     const _logger = debug.extend("SurveyPreviewCard.jsx");
     const [surveyData, setSurveyData] = useState({});

     const [showModal, setShowModal] = useState(false);

     const handleClose = () => {
          setShowModal(false);
     };

     const handleButtonClick = () => {
          getDetailsOnClick();
     };

     const handleSubmit = (e) => {
          e.preventDefault();
     };

     const getDetailsOnClick = () => {
          const surveyId = surveyIdNumber;

          surveysService.getSurveyDetails(surveyId).then(onGetSurveyDetailsSuccess).catch(onGetSurveyDetailsError);
     };

     const onGetSurveyDetailsSuccess = (data) => {
          _logger("Success!", data);
          setSurveyData(data);
          setShowModal(true);
     };
     const onGetSurveyDetailsError = (error) => {
          _logger("Failed to get Survey!", error);
          toastr.error("error");
     };

     const renderQuestionInput = (question) => {
          if (question.type === 1) {
               return question.answerOptions?.map((option) => (
                    <Form.Check
                         key={option.id}
                         type="radio"
                         name={`question-${question.id}`}
                         value={option.value}
                         label={option.text}
                    />
               ));
          } else if (question.type === 2) {
               return <Form.Control type="text" name={`question-${question.id}`} placeholder="Enter your Answer" />;
          } else if (question.type === 3) {
               return (
                    <Form.Control
                         as="textarea"
                         type="text"
                         name={`question-${question.id}`}
                         placeholder="Enter your Answer"
                    />
               );
          } else if (question.type === 4) {
               return <Form.Control type="file" name={`question-${question.id}`} placeholder="Enter your Answer" />;
          } else if (question.type === 8) {
               return question.answerOptions.map((option) => (
                    <Form.Check
                         key={option.id}
                         type="radio"
                         name={`question-${question.id}`}
                         value={option.value}
                         label={option.text}
                    />
               ));
          } else {
               return null;
          }
     };

     return (
          <>
               <Container>
                    <Row className="justify-content-md-center mt-3">
                         <Col md="auto">
                              <Button
                                   className="btn btn-light btn-outline-dark m-1"
                                   variant="primary"
                                   onClick={handleButtonClick}
                              >
                                   Preview
                              </Button>
                         </Col>
                    </Row>
                    <Modal show={showModal} onHide={handleClose}>
                         <Modal.Header closeButton>
                              <Modal.Title>Survey Preview</Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                              <Container>
                                   <Card>
                                        <Card.Header className="fw-bold fs-2">
                                             {surveyData.item && surveyData.item.name}
                                        </Card.Header>
                                        <Card.Body>
                                             <Form onSubmit={handleSubmit}>
                                                  {surveyData.item &&
                                                       surveyData.item.questions.map((question) => (
                                                            <Form.Group
                                                                 className="mb-3"
                                                                 controlId={`question-${question.id}`}
                                                                 key={question.id}
                                                            >
                                                                 <Form.Label>{question.question}</Form.Label>
                                                                 {renderQuestionInput(question)}
                                                            </Form.Group>
                                                       ))}
                                                  <Button variant="primary" type="submit" disabled>
                                                       Submit
                                                  </Button>
                                             </Form>
                                        </Card.Body>
                                   </Card>
                              </Container>
                         </Modal.Body>
                    </Modal>
               </Container>
          </>
     );
};

SurveyPreview.propTypes = {
     currentSurveyId: PropTypes.number.isRequired,
     surveyData: PropTypes.shape({
          item: PropTypes.shape({
               name: PropTypes.string,
               questions: PropTypes.arrayOf(
                    PropTypes.shape({
                         id: PropTypes.number.isRequired,
                         question: PropTypes.string.isRequired,
                         type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                         answerOptions: PropTypes.arrayOf(
                              PropTypes.shape({
                                   id: PropTypes.number.isRequired,
                                   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                                   text: PropTypes.string.isRequired,
                              }).isRequired
                         ),
                    }).isRequired
               ),
          }).isRequired,
     }).isRequired,
};

export default SurveyPreview;
