import React, { useRef } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { View, TextInput } from 'react-native';
import * as Yup from 'yup';
import TextField from './form/TextField';
import api from '@/api';
import { useMutation, useQueryClient } from 'react-query';
import MiniAddButton from './MiniAddButton';

interface Props {
    storeId: number;
}

interface FormValues {
    name: string;
}

const CreateStoreTagForm: React.FC<Props> = (props) => {
    const queryClient = useQueryClient();

    const inputRef = useRef<TextInput>(null);

    const { mutateAsync, status, data, error } = useMutation(
        (params) => {
            return api.post(`stores/${props.storeId}/tags`, params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['store', props.storeId]);
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
        mutateAsync({
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
                    <MiniAddButton
                        disabled={values.name === ''}
                        onPress={handleSubmit}
                        submitting={isSubmitting}
                    />
                </View>
            )}
        </Formik>
    );
};

export default CreateStoreTagForm;
