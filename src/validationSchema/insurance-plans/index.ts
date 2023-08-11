import * as yup from 'yup';

export const insurancePlanValidationSchema = yup.object().shape({
  plan_name: yup.string().required(),
  organization_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
