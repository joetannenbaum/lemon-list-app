import React from 'react';
import { View } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import TextField from '@/components/form/TextField';
import * as Yup from 'yup';
import { Screen, ModalScreenProps } from '@/types/navigation';
import SubmitButton from '@/components/form/SubmitButton';
import asModal from '@/components/asModal';
import CancelButton from '@/components/form/CancelButton';
import { bsl } from '@/util/style';
import useStore from '@/hooks/useStore';
import useUpdateStore from '@/hooks/useUpdateStore';

export interface EditStoreProps {
    id: number;
}

interface FormValues {
    name: string;
}

const EditStore: Screen<EditStoreProps & ModalScreenProps> = (props) => {
    const list = useStore(props.id);

    const { mutateAsync: updateStore } = useUpdateStore(props.id);

    const initialFormValues: FormValues = {
        name: list.data?.name || '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        updateStore(values).then(props.dismiss);
    };

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({ handleSubmit, isSubmitting, values }) => (
                <View>
                    <View style={{ paddingBottom: bsl(20) }}>
                        <TextField
                            required={true}
                            name="name"
                            placeholder="Name"
                            onSubmitEditing={handleSubmit}
                        />
                    </View>

                    <SubmitButton
                        disabled={values.name === ''}
                        onPress={handleSubmit}
                        processing={isSubmitting}>
                        Update
                    </SubmitButton>
                </View>
            )}
        </Formik>
    );
};

export default asModal(EditStore);
