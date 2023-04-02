import { React, useState, useEffect } from "react";
import { Card, Nav, Navbar, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { surveySchema } from "../../schemas/surveySchema.js";
import PropTypes from "prop-types";
import lookUpService from "services/lookUpService";
import surveyBuilderService from "services/surveyBuilderService.js";
import "./surveybuilderform.css";
import debug from "sabio-debug";

const _logger = debug.extend("SurveyQ");

function SurveyForm(props) {
     //#region props
     const toggleFunction = props.formToggler;
     const createSuccessHandler = props.success;
     const createErrorHandler = props.error;
     //#endregion

     //#region state objs
     const [surveyFormData] = useState({
          name: "",
          description: "",
          statusId: 1,
          surveyTypeId: 0,
     });

     const [options, setOptions] = useState({ surveyOtions: [] });
     //#endregion

     useEffect(() => {
          lookUpService.LookUp(["SurveyTypes"]).then(onGetSurveyTypesSuccess).catch(onGetSurveyTypesError);
     }, []);

     const handleSubmit = (values) => {
          surveyBuilderService.createSurvey(values).then(createSuccessHandler).catch(createErrorHandler);
     };

     //#region Success and Error handlers

     const onGetSurveyTypesSuccess = (response) => {
          const surveyTypes = response.item.surveyTypes;
          setOptions((prevState) => {
               const surveyOptions = { ...prevState };
               const mappedTypes = surveyTypes.map(optionTags);
               surveyOptions.surveyOtions = [mappedTypes];

               return surveyOptions;
          });
     };
     const onGetSurveyTypesError = (err) => {
          _logger({ error: err });
     };

     //#region Mappers
     const optionTags = (option) => {
          return (
               <option key={`optionList${option.id}`} value={option.id}>
                    {option.name}
               </option>
          );
     };
     //#endregion

     return (
          <Card className="m-2 rounded-0">
               <Card.Body>
                    <Formik
                         enableReinitialize={true}
                         initialValues={surveyFormData}
                         validationSchema={surveySchema}
                         onSubmit={handleSubmit}
                    >
                         <Form>
                              <Row>
                                   <Navbar bg="light" expand="lg">
                                        <Navbar.Toggle aria-controls="navbarScroll" />
                                        <Navbar.Collapse id="navbarScroll">
                                             <Nav className="me-auto my-2 my-lg-0">
                                                  <Nav.Link
                                                       href="#action2"
                                                       className="navbar-nav survey-builder-nav-linkx"
                                                  >
                                                       Options
                                                  </Nav.Link>
                                             </Nav>
                                        </Navbar.Collapse>
                                   </Navbar>
                              </Row>

                              <Row>
                                   <div className="col-sm-9 mb-3 form-group" id="formGroupQuestion">
                                        <label htmlFor="question">Name</label>
                                        <Field
                                             type="text"
                                             name="name"
                                             placeholder="Enter survey name"
                                             className="form-control"
                                        />
                                        <ErrorMessage
                                             name="name"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>

                                   <div className="col-sm-3 mb-3 form-group" id="formGroupQuestionType">
                                        <label htmlFor="surveyTypeId">Survey Type</label>
                                        <Field as="select" name="surveyTypeId" className="form-select">
                                             <option value="">Choose Type</option>
                                             {options.surveyOtions}
                                        </Field>
                                        <ErrorMessage
                                             name="surveyTypeId"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>
                              </Row>

                              <hr />

                              <Row>
                                   <div className="col mb-3 form-group" id="formGroupQuestion">
                                        <label htmlFor="question">Desciption</label>
                                        <Field
                                             as="textarea"
                                             type="text"
                                             name="description"
                                             placeholder="Enter description"
                                             rows="3"
                                             className="form-control"
                                        />
                                        <ErrorMessage
                                             name="description"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>
                              </Row>

                              <hr />

                              <Row>
                                   <div className="col mb-3 row form-group" id="nextQuestion">
                                        <div className="col d-flex align-items-end flex-row">
                                             <button
                                                  className="btn btn-light btn-outline-dark m-1 ms-3"
                                                  type="button"
                                                  onClick={toggleFunction}
                                             >
                                                  Cancel
                                             </button>
                                        </div>
                                   </div>

                                   <div className="col-4 mb-3 row form-group" id="save">
                                        <div className="col d-flex align-items-end flex-row-reverse">
                                             <button type="submit" className="btn btn-primary m-1 me-3">
                                                  Create
                                             </button>
                                        </div>
                                   </div>
                              </Row>
                         </Form>
                    </Formik>
               </Card.Body>
          </Card>
     );
}

SurveyForm.propTypes = {
     formToggler: PropTypes.func.isRequired,
     success: PropTypes.func.isRequired,
     error: PropTypes.func.isRequired,
};

export default SurveyForm;
