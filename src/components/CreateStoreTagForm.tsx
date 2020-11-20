import React, { useRef } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { View, TextInput } from 'react-native';
import * as Yup from 'yup';
import SubmitButton from './form/SubmitButton';
import TextField from './form/TextField';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';

interface Props {
    storeId: number;
}

interface FormValues {
    name: string;
}

const CreateStoreTagForm: React.FC<Props> = (props) => {
    const queryCache = useQueryCache();

    const inputRef = useRef<TextInput>(null);

    const [mutate, { status, data, error }] = useMutation(
        (params) => {
            return api.post(`stores/${props.storeId}/tags`, params);
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['store', props.storeId]);
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
                inputRef.current?.focus();
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
                        ref={inputRef}
                        required={true}
                        name="name"
                        placeholder="Add Item Here"
                        onSubmitEditing={handleSubmit}
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

export default CreateStoreTagForm;