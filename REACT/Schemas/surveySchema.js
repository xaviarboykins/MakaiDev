import * as Yup from "yup";

export const surveySchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required("Name is required"),
  description: Yup.string()
    .min(5)
    .max(2000)
    .required("Description is required"),
  statusId: Yup.string()
    .oneOf(["1", "2", "3", "4", "5"], "Select a status")
    .required("Status is required"),
  surveyTypeId: Yup.string()
    .oneOf(["1", "2"], "Select survey type")
    .required("Survey type is required"),
});

export default { surveySchema };
