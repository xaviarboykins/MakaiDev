import React, { useEffect, useState } from "react";
import Section from "components/common/Section";
import "./surveybuilderform.css";
import { Button, Card, Container, Nav, Navbar, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SurveyForm from "./SurveyForm";
import SurveyTable from "./SurveyTable";
import surveyBuilderService from "services/surveyBuilderService";
import { ToastContainer, toast } from "react-toastify";
import locale from "rc-pagination/lib/locale/en_US";
import Pagination from "rc-pagination";
import swal from "sweetalert";
import "react-toastify/dist/ReactToastify.css";
import debug from "sabio-debug";
import "rc-pagination/assets/index.css";
const _logger = debug.extend("SurveyQ");

function SurveyManager(props) {
     //#region props OBjs
     const currentUserId = props.currentUser.id;
     //#endregion

     //#region state objects
     const [showForm, setShowForm] = useState(false);
     const [activeSurveys, setActiveSurveys] = useState({
          theSurveys: [],
          pageIndex: 0,
          pageSize: 10,
          totalCount: 0,
          currentPage: 1,
          totalPages: 0,
     });

     //#endregion

     const handleFormToggle = () => {
          setShowForm((prevState) => !prevState);
     };

     const navigate = useNavigate();

     useEffect(() => {
          surveyBuilderService
               .getSurveysByCreator(activeSurveys.pageIndex, activeSurveys.pageSize, currentUserId)
               .then(onGetAllSurveysSuccess)
               .catch(onGetAllSurveysError);
     }, [activeSurveys.pageIndex, activeSurveys.totalCount]);

     const onPageChange = (current) => {
          setActiveSurveys((prevState) => {
               const pgItems = { ...prevState };
               pgItems.pageIndex = current - 1;
               pgItems.currentPage = current;
               return pgItems;
          });
     };

     //#region---success and error handlers---
     const onGetAllSurveysSuccess = (response) => {
          const allSurveys = response.item.pagedItems;

          const onlyActiveSurveys = allSurveys.filter((survey) => {
               let result = false;
               if (survey.surveyStatus.id === 1) {
                    result = true;
               }
               return result;
          });

          let totalSurveyCount = response.item.totalCount;
          let thePageSize = response.item.pageSize;
          let pages = response.item.totalPages;

          setActiveSurveys((prevState) => {
               const allActiveSurveys = { ...prevState };
               const mappedSurveys = onlyActiveSurveys?.map(mapSurveys);
               allActiveSurveys.theSurveys = [mappedSurveys];
               allActiveSurveys.pageSize = thePageSize;
               allActiveSurveys.totalCount = totalSurveyCount;
               allActiveSurveys.totalPages = pages;
               return allActiveSurveys;
          });
     };

     const onGetAllSurveysError = (err) => {
          _logger({ error: err });
     };

     const onCreateSurveySuccess = (response, resetForm) => {
          _logger(response);
          const id = response.item;
          navigate(`/surveys/${id}/builder`);
          swal("Successfully", "Created", "success");
          resetForm();
     };
     const onCreateSurveyError = (err) => {
          _logger({ error: err });
          toast.error("Survey creation was unsuccessful.");
     };
     const onDeleteSurveySuccess = () => {
          toast.success("Survey delete was successful.");
          setActiveSurveys((prevState) => {
               const updatedSurveys = { ...prevState };
               updatedSurveys.totalCount = activeSurveys.totalCount - 1;
               return updatedSurveys;
          });
     };
     const onDeleteSurveyError = (err) => {
          _logger({ error: err });
          toast.error("Survey delete was unsuccessful.");
     };

     //#endregion

     //#region ------Mappers------
     const mapSurveys = (aSurvey) => {
          return (
               <SurveyTable
                    survey={aSurvey}
                    key={"surveyListA" + aSurvey.id}
                    deleteSuccess={onDeleteSurveySuccess}
                    deleteError={onDeleteSurveyError}
               />
          );
     };
     //#endregion

     return (
          <React.Fragment>
               <Section className="py-0 overflow-hidden light" position="center bottom" overlay>
                    <Container>
                         <Row>
                              <Navbar bg="light" expand="lg">
                                   <Nav className="me-auto my-2 my-lg-0">
                                        <Button type="button" className="btn btn-dark" onClick={handleFormToggle}>
                                             Create Survey +
                                        </Button>
                                   </Nav>
                              </Navbar>
                         </Row>
                         <Container>
                              <Row>
                                   <Container className="col-sm-10">
                                        {showForm !== false && (
                                             <SurveyForm
                                                  formToggler={handleFormToggle}
                                                  success={onCreateSurveySuccess}
                                                  error={onCreateSurveyError}
                                             />
                                        )}
                                   </Container>
                              </Row>
                         </Container>
                         <Container>
                              <Row>
                                   <Container name="surveysContainer" className="col">
                                        <Card className="m-2 rounded-0">
                                             <div>
                                                  <h1 className="text-center m-4">Surveys</h1>
                                             </div>

                                             <Container>
                                                  <div className="survey-builder-scrollit">
                                                       <table className="table survey-builder-scrollit">
                                                            <thead className="survey-builder-fixed-header">
                                                                 <tr>
                                                                      <th scope="col">Name</th>
                                                                      <th scope="col">Date Created</th>
                                                                      <th scope="col">Date Modified</th>
                                                                      <th scope="col">Actions</th>
                                                                 </tr>
                                                            </thead>
                                                            {activeSurveys.theSurveys}
                                                       </table>
                                                  </div>
                                             </Container>
                                             {activeSurveys.totalPages > 1 && (
                                                  <Pagination
                                                       onChange={onPageChange}
                                                       current={activeSurveys.currentPage}
                                                       total={activeSurveys.totalCount}
                                                       pageSize={activeSurveys.pageSize}
                                                       className="d-flex justify-content-center my-3"
                                                       locale={locale}
                                                  />
                                             )}
                                        </Card>
                                   </Container>
                              </Row>
                         </Container>
                         <ToastContainer />
                    </Container>
               </Section>
          </React.Fragment>
     );
}

SurveyManager.propTypes = {
     currentUser: PropTypes.shape({
          id: PropTypes.number.isRequired,
     }),
};

export default SurveyManager;
