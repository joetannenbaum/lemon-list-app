import React from 'react';
import { Formik, FormikHelpers } from 'formik';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Yup from 'yup';
import SubmitButton from './form/SubmitButton';
import TextField from './form/TextField';
import api from '@/api';
import { useMutation, useQueryClient } from 'react-query';
import { bsl, sizeImage } from '@/util/style';
import Processing from './Processing';

interface Props {}

interface FormValues {
    name: string;
}

const CreateStoreForm: React.FC<Props> = (props) => {
    const queryClient = useQueryClient();

    const { mutateAsync, status, data, error } = useMutation(
        (params) => {
            return api.post('stores', params);
        },
        {
            onSuccess() {
                queryClient.invalidateQueries('stores');
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
                        placeholder="Store Name"
                        hideError={true}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleSubmit}
                        disabled={values.name.trim() === ''}>
                        {isSubmitting ? (
                            <Processing />
                        ) : (
                            <Image
                                source={require('@images/plus-circle.png')}
                                style={styles.addIcon}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        right: bsl(20),
        top: bsl(20),
        ...sizeImage(10, 10, { width: 40 }),
    },
    addIcon: sizeImage(76, 78, { width: 40 }),
});

export default CreateStoreForm;
