import React, { useCallback } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { View, StyleSheet } from 'react-native';
import * as Yup from 'yup';
import TextField from '@/components/form/TextField';
import EmailField from '@/components/form/EmailField';
import PasswordField from '@/components/form/PasswordField';
import api from '@/api';
import SubmitButton from '@/components/form/SubmitButton';
import logger from '@/util/logger';
import { requestAccessToken } from '@/api/token';
import BaseText from '@/components/BaseText';
import { setStackRootWithoutAnimating } from '@/util/navigation';
import { bsl, flexCenter, blue400 } from '@/util/style';

interface Props extends ScreenProps {}

interface FormValues {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

const Register: Screen<Props> = (props) => {
    const initialFormValues: FormValues = {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string()
            .required('Required')
            .min(8, 'Password should be at least 8 characters'),
        passwordConfirmation: Yup.string()
            .required('Required')
            .oneOf([Yup.ref('password'), ''], 'Passwords must match'),
    });

    const handleSubmit = (
        values: FormValues,
        form: FormikHelpers<FormValues>,
    ) => {
        api.post('/auth/register', values)
            .then((res) => requestAccessToken(values.email, values.password))
            .then((res) => {
                setStackRootWithoutAnimating('App');
            })
            .catch((error) => {
                form.setSubmitting(false);
                logger.red(error);
            });
    };

    const renderForm = useCallback(
        ({ handleSubmit, isSubmitting }: FormikProps<FormikValues>) => (
            <View style={styles.form}>
                <View style={styles.formFieldsWrapper}>
                    <View style={styles.formFieldsInner}>
                        <View style={styles.inputWrapper}>
                            <TextField
                                name="name"
                                required={true}
                                placeholder="Name"
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <EmailField name="email" placeholder="Email" />
                        </View>
                        <View style={styles.inputWrapper}>
                            <PasswordField
                                name="password"
                                placeholder="Password"
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <PasswordField
                                name="passwordConfirmation"
                                placeholder="Confirm Password"
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <SubmitButton
                                processing={isSubmitting}
                                onPress={handleSubmit}>
                                Register
                            </SubmitButton>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <BaseText align="center">
                        Already have an account?{' '}
                        <BaseText
                            color={blue400}
                            onPress={() => {
                                setStackRootWithoutAnimating('Login');
                            }}>
                            Login
                        </BaseText>
                    </BaseText>
                </View>
            </View>
        ),
        [],
    );

    return (
        <SafeAreaView style={styles.safearea}>
            <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {renderForm}
            </Formik>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        paddingHorizontal: bsl(60),
    },
    inputWrapper: {
        paddingVertical: bsl(20),
    },
    form: {
        flex: 1,
    },
    formFieldsWrapper: {
        flex: 1,
        ...flexCenter,
    },
    formFieldsInner: {
        width: '100%',
    },
    footer: {
        paddingVertical: bsl(40),
    },
});

export default Register;
