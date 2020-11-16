import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import { Formik, FormikHelpers } from 'formik';
import { View, Button } from 'react-native';
import * as Yup from 'yup';
import TextField from '@/components/form/TextField';
import EmailField from '@/components/form/EmailField';
import PasswordField from '@/components/form/PasswordField';
import api from '@/api';
import SubmitButton from '@/components/form/SubmitButton';
import logger from '@/util/logger';
import { requestAccessToken } from '@/api/token';
import BodyText from '@/components/BodyText';
import { setStackRootWithoutAnimating } from '@/util/navigation';

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
                setStackRootWithoutAnimating('Home');
            })
            .catch((error) => {
                form.setSubmitting(false);
                logger.red(error);
            });
    };

    return (
        <SafeAreaView>
            <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ handleSubmit, isSubmitting }) => (
                    <View>
                        <TextField
                            name="name"
                            label="Name"
                            required={true}
                            placeholder="Name"
                        />

                        <EmailField
                            name="email"
                            placeholder="Email"
                            label="Email"
                        />

                        <PasswordField
                            name="password"
                            placeholder="Password"
                            label="Password"
                        />

                        <PasswordField
                            name="passwordConfirmation"
                            placeholder="Confirm Password"
                            label="Confirm Password"
                        />

                        <SubmitButton
                            processing={isSubmitting}
                            onPress={handleSubmit}>
                            Register
                        </SubmitButton>

                        <View>
                            <BodyText>Already have an account?</BodyText>
                            <Button
                                title="Login"
                                onPress={() => {
                                    setStackRootWithoutAnimating('Login');
                                }}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default Register;
