import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import { Formik } from 'formik';
import { View, TextInput, Button } from 'react-native';
import * as Yup from 'yup';
import TextField from '@/components/form/TextField';
import EmailField from '@/components/form/EmailField';
import PasswordField from '@/components/form/PasswordField';

interface Props extends ScreenProps {}

const App: Screen<Props> = (props) => {
    const initialFormValues = { name: '', email: '', password: '' };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(
            8,
            'Password should be at least 8 characters',
        ),
    });

    const handleSubmit = (values) => {
        console.log(values);
    };

    return (
        <SafeAreaView>
            <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ handleSubmit }) => (
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

                        <Button onPress={handleSubmit} title="Register" />
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default App;
