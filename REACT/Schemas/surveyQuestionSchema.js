import * as Yup from "yup";

export const surveyQuestionSchema = Yup.object().shape({
     question: Yup.string().min(2).max(500).required("Question required"),
     helpText: Yup.string().min(2).max(255),
     questionTypeId: Yup.string()
          .oneOf(["1", "2", "3", "4", "5", "6", "8"], "Select a question type")
          .required("Question type is required"),
     statusId: Yup.string().oneOf(["1", "2", "3", "4", "5"], "Select a status").required("Status is required"),
     sortOrder: Yup.number().min(1).required("Sort order required"),
});

export default surveyQuestionSchema;
