import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import SurveyPreview from "components/surveys/SurveyPreview";
import surveyBuilderService from "services/surveyBuilderService";

const SurveyTable = (props) => {
     //#region Prop Objs
     const survey = props.survey;
     const createdDate = survey.dateCreated;
     const modifiedDate = survey.dateModified;
     const deleteSuccess = props.deleteSuccess;
     const deleteError = props.deleteError;
     //#endregion

     const navigate = useNavigate();

     const formatDate = (newDate) => {
          const date = new Date(newDate);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const year = date.getFullYear();
          const formattedDate = `${month}/${day}/${year}`;
          return formattedDate;
     };

     const onEditClicked = () => {
          navigate(`/surveys/${survey.id}/builder`);
     };
     const ondeleteClicked = () => {
          surveyBuilderService.deleteSurvey(survey.id).then(deleteSuccess).catch(deleteError);
     };

     return (
          <React.Fragment>
               <tbody>
                    <tr>
                         <td className="col-4">{survey.name}</td>
                         <td className="col-2">{formatDate(createdDate)}</td>
                         <td className="col-2">{formatDate(modifiedDate)}</td>
                         <td className="col-4">
                              <div className="col d-flex align-items-end flex-row">
                                   <SurveyPreview currentSurveyId={survey.id} />
                                   <button type="button" className="btn btn-primary m-1" onClick={onEditClicked}>
                                        Edit
                                   </button>
                                   <button type="button" className="btn btn-danger m-1" onClick={ondeleteClicked}>
                                        Delete
                                   </button>
                              </div>
                         </td>
                    </tr>
               </tbody>
          </React.Fragment>
     );
};
//#region Prop validation
SurveyTable.propTypes = {
     deleteSuccess: PropTypes.func,
     deleteError: PropTypes.func,
     survey: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          surveyStatus: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string.isRequired })
               .isRequired,
          surveyType: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string.isRequired })
               .isRequired,
          user: PropTypes.shape({
               id: PropTypes.number.isRequired,
               firstName: PropTypes.string.isRequired,
               lastName: PropTypes.string.isRequired,
               avatarUrl: PropTypes.string.isRequired,
          }).isRequired,
          dateCreated: PropTypes.string.isRequired,
          dateModified: PropTypes.string.isRequired,
     }).isRequired,
};
//#endregion

export default React.memo(SurveyTable);
