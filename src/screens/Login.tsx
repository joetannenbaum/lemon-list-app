import React, { useCallback } from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { View, StyleSheet, Keyboard, KeyboardAvoidingView } from 'react-native';
import * as Yup from 'yup';
import EmailField from '@/components/form/EmailField';
import PasswordField from '@/components/form/PasswordField';
import SubmitButton from '@/components/form/SubmitButton';
import logger from '@/util/logger';
import { requestAccessToken } from '@/api/token';
import BaseText from '@/components/BaseText';
import { setStackRootWithoutAnimating } from '@/util/navigation';
import { flexCenter, bsl, blue400 } from '@/util/style';

interface Props extends ScreenProps {}

interface FormValues {
    email: string;
    password: string;
}

const Login: Screen<Props> = (props) => {
    const initialFormValues: FormValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Required'),
    });

    const handleSubmit = useCallback(
        (values: FormValues, form: FormikHelpers<FormValues>) => {
            Keyboard.dismiss();

            requestAccessToken(values.email, values.password)
                .then((res) => {
                    setStackRootWithoutAnimating('App');
                })
                .catch((error) => {
                    form.setSubmitting(false);
                    logger.red(error);
                });
        },
        [],
    );

    const onRegisterPress = useCallback(() => {
        setStackRootWithoutAnimating('Register');
    }, []);

    const renderForm = useCallback(
        ({
            handleSubmit,
            isSubmitting,
            isValid,
        }: FormikProps<FormikValues>) => (
            <View style={styles.form}>
                <View style={styles.formFieldsWrapper}>
                    <View style={styles.formFieldsInner}>
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
                            <SubmitButton
                                disabled={!isValid}
                                processing={isSubmitting}
                                onPress={handleSubmit}>
                                Login
                            </SubmitButton>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <BaseText align="center">
                        Don't have an account?{' '}
                        <BaseText color={blue400} onPress={onRegisterPress}>
                            Register
                        </BaseText>
                    </BaseText>
                </View>
            </View>
        ),
        [],
    );

    return (
        <SafeAreaView style={styles.safearea}>
            <KeyboardAvoidingView style={styles.form}>
                <Formik
                    initialValues={initialFormValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}>
                    {renderForm}
                </Formik>
            </KeyboardAvoidingView>
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

export default Login;
