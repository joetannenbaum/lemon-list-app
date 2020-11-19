import React, { useRef } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { View } from 'react-native';
import * as Yup from 'yup';
import SubmitButton from './form/SubmitButton';
import TextField from './form/TextField';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';
import useShoppingList from '@/hooks/useShoppingList';

interface Props {
    listId: number;
}

interface FormValues {
    name: '';
}

const CreateItemForm: React.FC<Props> = (props) => {
    const queryCache = useQueryCache();

    const inputRef = useRef(null);

    const list = useShoppingList(props.listId);

    const [mutate, { status, data, error }] = useMutation(
        (params) => {
            return api.post(
                `shopping-list-versions/${list.data?.active_version.id}/items`,
                params,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['shopping-list', props.listId]);
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
                        onInputRef={(ref) => {
                            inputRef.current = ref;
                        }}
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

export default CreateItemForm;
