import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import { View, Keyboard } from 'react-native';
import * as Yup from 'yup';
import TextField from './form/TextField';
import useAddShoppingList from '@/hooks/useAddShoppingList';
import logger from '@/util/logger';
import MiniAddButton from './MiniAddButton';

interface Props {}

interface FormValues {
    name: string;
}

const CreateListForm: React.FC<Props> = (props) => {
    const { mutateAsync: addShoppingList } = useAddShoppingList();

    const initialFormValues: FormValues = {
        name: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        Keyboard.dismiss();

        addShoppingList({
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
                        placeholder="New List"
                        hideError={true}
                    />

                    <MiniAddButton
                        onPress={handleSubmit}
                        disabled={values.name.trim() === ''}
                        submitting={isSubmitting}
                    />
                </View>
            )}
        </Formik>
    );
};

export default CreateListForm;
