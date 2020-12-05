import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import { Formik, FormikHelpers } from 'formik';
import { View, Button } from 'react-native';
import * as Yup from 'yup';
import EmailField from '@/components/form/EmailField';
import PasswordField from '@/components/form/PasswordField';
import SubmitButton from '@/components/form/SubmitButton';
import logger from '@/util/logger';
import { requestAccessToken } from '@/api/token';
import BaseText from '@/components/BaseText';
import { setStackRootWithoutAnimating } from '@/util/navigation';

interface Props extends ScreenProps {}

interface FormValues {
    email: string;
    password: string;
}

const Register: Screen<Props> = (props) => {
    const initialFormValues: FormValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().required('Required'),
    });

    const handleSubmit = (
        values: FormValues,
        form: FormikHelpers<FormValues>,
    ) => {
        requestAccessToken(values.email, values.password)
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

                        <SubmitButton
                            processing={isSubmitting}
                            onPress={handleSubmit}>
                            Login
                        </SubmitButton>

                        <View>
                            <BaseText>Don't have an account?</BaseText>
                            <Button
                                title="Register"
                                onPress={() => {
                                    setStackRootWithoutAnimating('Register');
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
