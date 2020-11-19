import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import { View } from 'react-native';
import * as Yup from 'yup';
import SubmitButton from './form/SubmitButton';
import TextField from './form/TextField';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';

interface Props {}

interface FormValues {
    name: '';
}

const CreateListForm: React.FC<Props> = (props) => {
    const queryCache = useQueryCache();

    const [mutate, { status, data, error }] = useMutation(
        (params) => {
            return api.post('shopping-lists', params);
        },
        {
            onSuccess() {
                queryCache.invalidateQueries('shopping-lists');
            },
        },
    );

    const initialFormValues: FormValues = {
        name: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        mutate({
            name: values.name,
        })
            .then((res) => {
                form.setSubmitting(false);
                form.resetForm();
            })
            .catch((error) => {
                form.setSubmitting(false);
                logger.red(error);
            });
    };

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({ handleSubmit, isSubmitting, values }) => (
                <View>
                    <TextField
                        required={true}
                        name="name"
                        label="List Name"
                        placeholder="List Name"
                    />
                    <SubmitButton
                        disabled={values.name === ''}
                        onPress={handleSubmit}
                        processing={isSubmitting}>
                        Add
                    </SubmitButton>
                </View>
            )}
        </Formik>
    );
};

export default CreateListForm;
