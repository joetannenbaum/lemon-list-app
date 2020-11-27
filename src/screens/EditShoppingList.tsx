import React from 'react';
import { View, Button } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import TextField from '@/components/form/TextField';
import * as Yup from 'yup';
import { Navigation } from 'react-native-navigation';
import { ScreenProps, Screen } from '@/types/navigation';
import SubmitButton from '@/components/form/SubmitButton';
import SafeAreaView from 'react-native-safe-area-view';
import useStores from '@/hooks/useStores';
import useUpdateShoppingList from '@/hooks/useUpdateShoppingList';
import useShoppingList from '@/hooks/useShoppingList';

export interface EditShoppingListProps {
    id: number;
}

interface FormValues {
    name: string;
}

const EditShoppingList: Screen<EditShoppingListProps & ScreenProps> = (
    props,
) => {
    const stores = useStores();

    const list = useShoppingList(props.id);

    const [updateShoppingList] = useUpdateShoppingList(props.id);

    const initialFormValues: FormValues = {
        name: list.data?.name || '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        Promise.all([updateShoppingList(values)]).then(() => {
            Navigation.dismissModal(props.componentId);
        });
    };

    return (
        <SafeAreaView>
            <Formik
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {({ handleSubmit, isSubmitting, values }) => (
                    <View style={{ padding: 50 }}>
                        <TextField
                            required={true}
                            name="name"
                            placeholder="Name"
                            onSubmitEditing={handleSubmit}
                        />

                        <SubmitButton
                            disabled={values.name === ''}
                            onPress={handleSubmit}
                            processing={isSubmitting}>
                            Update
                        </SubmitButton>
                        <View style={{ padding: 20 }}>
                            <Button
                                color="grey"
                                title="Cancel"
                                onPress={() => {
                                    Navigation.dismissModal(props.componentId);
                                }}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default EditShoppingList;
