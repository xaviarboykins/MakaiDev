import { React, useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { Nav, Navbar, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import surveyQuestionSchema from "../../schemas/surveyQuestionSchema.js";
import lookUpService from "services/lookUpService";
import surveyBuilderService from "services/surveyBuilderService";
import debug from "sabio-debug";

const _logger = debug.extend("SurveyQ");

function SurveyQuestionForm(props) {
     //#region props
     const toggleFunction = props.formToggler;
     const createSuccessHandler = props.success;
     const createErrorHandler = props.error;
     //#endregion

     //#region State Objects
     const surveyId = useParams();

     const [questionFormData] = useState({
          question: "",
          helpText: "",
          isRequired: true,
          isMultipleAllowed: false,
          questionTypeId: "",
          statusId: "",
          surveyId: `${surveyId.id}`,
          sortOrder: "",
          answerOptions: [""],
     });

     const [questionType, setQuestionType] = useState("");

     const [options, setOptions] = useState({ questionOptions: [], statusOptions: [] });

     //#endregion

     useEffect(() => {
          lookUpService.LookUp(["QuestionTypes"]).then(onGetQuestionTypesSuccess).catch(onGetQuestionTypeError);
          lookUpService.LookUp(["StatusTypes"]).then(onGetStatusTypesSuccess).catch(onGetStatusTypeError);
     }, []);

     const handleSubmit = (values, { resetForm }) => {
          surveyBuilderService
               .createQuestion(values)
               .then((response) => createSuccessHandler(response, resetForm, values))
               .catch(createErrorHandler);
     };

     const handleQuestTypeChange = (e) => {
          let qt = e.target.value.toString();
          setQuestionType((prevState) => {
               let questType = { ...prevState };
               questType = qt;
               return questType;
          });
     };

     //#region Success and Error Handlers

     const onGetQuestionTypesSuccess = (response) => {
          const qOptions = response.item.questionTypes;
          setOptions((prevState) => {
               const questOptions = { ...prevState };
               const mappedOptions = qOptions.map(optionTags);
               questOptions.questionOptions = mappedOptions;

               return questOptions;
          });
     };
     const onGetQuestionTypeError = (err) => {
          _logger({ error: err });
     };

     const onGetStatusTypesSuccess = (response) => {
          const sOptions = response.item.statusTypes;
          setOptions((prevState) => {
               const statOptions = { ...prevState };
               const mappedOptions = sOptions.map(optionTags);
               statOptions.statusOptions = mappedOptions;
               return statOptions;
          });
     };
     const onGetStatusTypeError = (err) => {
          _logger({ error: err });
     };
     //#endregion

     //#region Mappers

     const optionTags = (option) => {
          return (
               <option key={`optionList${option.id}`} value={option.id} name={option.name}>
                    {option.name}
               </option>
          );
     };

     //#endregion

     return (
          <Row>
               <div>
                    <Formik
                         enableReinitialize={true}
                         initialValues={questionFormData}
                         validationSchema={surveyQuestionSchema}
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
                                   <div className="col-sm-10 mb-3 form-group" id="formGroupQuestion">
                                        <label htmlFor="question">Question</label>
                                        <Field
                                             type="text"
                                             name="question"
                                             placeholder="Enter your question"
                                             className="form-control"
                                        />
                                        <ErrorMessage
                                             name="question"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>

                                   <div className="col-2 mb-3 form-group" id="formGroupQuestion">
                                        <label htmlFor="sortOrder">SortOrder</label>
                                        <Field type="text" name="sortOrder" placeholder="0" className="form-control" />
                                        <ErrorMessage
                                             name="sortOrder"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>
                              </Row>

                              <Row>
                                   <div className="col-sm-6 mb-3 form-group" id="formGroupQuestionType">
                                        <label htmlFor="questionTypeId">Question Type</label>
                                        <Field
                                             as="select"
                                             name="questionTypeId"
                                             className="form-select"
                                             onClick={handleQuestTypeChange}
                                        >
                                             <option value="">Choose Type</option>
                                             {options.questionOptions}
                                        </Field>

                                        <ErrorMessage
                                             name="questionTypeId"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>

                                   <div className="col-sm-6 mb-3 form-group" id="formGroupQuestionType">
                                        <label htmlFor="statusId">Status</label>
                                        <Field as="select" name="statusId" className="form-select">
                                             <option value="">Choose Status</option>

                                             {options.statusOptions}
                                        </Field>
                                        <ErrorMessage
                                             name="statusId"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>
                              </Row>

                              <Row>
                                   <div className="col  mb-3 form-group" id="formGroupHelpText">
                                        <label htmlFor="helpText">Help Text</label>
                                        <Field
                                             as="textarea"
                                             rows="3"
                                             type="text"
                                             name="helpText"
                                             placeholder="Enter your question"
                                             className="form-control"
                                        />
                                        <ErrorMessage
                                             name="helpText"
                                             component="div"
                                             className="survey-builder-has-error"
                                        />
                                   </div>
                              </Row>

                              <hr />
                              {questionType === "8" && (
                                   <Row>
                                        <label htmlFor="multipleChoice">Answers</label>
                                        <FieldArray name="answerOptions">
                                             {(fieldArrayProps) => {
                                                  const { push, remove, form } = fieldArrayProps;
                                                  const { values } = form;
                                                  const { answerOptions } = values;
                                                  return (
                                                       <div>
                                                            {answerOptions.map((answer, index) => (
                                                                 <div key={index}>
                                                                      <div className="row">
                                                                           <div className="col-sm-8">
                                                                                <Field
                                                                                     placeholder="Enter an answer here"
                                                                                     className="form-control"
                                                                                     name={`answerOptions[${index}]`}
                                                                                />{" "}
                                                                                <br />
                                                                           </div>
                                                                           <div className="col-sm-4">
                                                                                <button
                                                                                     className="btn btn-danger"
                                                                                     type="button"
                                                                                     onClick={() => remove(index)}
                                                                                >
                                                                                     {" "}
                                                                                     -{" "}
                                                                                </button>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            ))}
                                                            <div>
                                                                 <button
                                                                      className="btn btn-primary"
                                                                      type="button"
                                                                      onClick={() => push("")}
                                                                 >
                                                                      {" "}
                                                                      Add{" "}
                                                                 </button>
                                                            </div>
                                                       </div>
                                                  );
                                             }}
                                        </FieldArray>

                                        <div>
                                             <hr />
                                        </div>
                                   </Row>
                              )}

                              <Row>
                                   <div className="col mb-3 row form-group" id="cancel">
                                        <div className="col d-flex align-items-end flex-row">
                                             <button
                                                  className="btn btn-light btn-outline-dark m-1"
                                                  type="button"
                                                  onClick={toggleFunction}
                                             >
                                                  Cancel
                                             </button>
                                        </div>
                                   </div>

                                   <div className="col-4 mb-3 row form-group" id="save">
                                        <div className="col d-flex align-items-end flex-row-reverse">
                                             <button type="submit" className="btn btn-primary m-1">
                                                  Save
                                             </button>
                                        </div>
                                   </div>
                              </Row>
                         </Form>
                    </Formik>
               </div>
          </Row>
     );
}
//#region propTypes
SurveyQuestionForm.propTypes = {
     formToggler: PropTypes.func.isRequired,
     success: PropTypes.func.isRequired,
     error: PropTypes.func.isRequired,
};

//#endregion

export default SurveyQuestionForm;
