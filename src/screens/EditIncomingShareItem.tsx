import React from 'react';
import { View } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SubmitButton from '@/components/form/SubmitButton';
import AutoGrowTextField from '@/components/form/AutoGrowTextField';
import { bsl } from '@/util/style';
import CancelButton from '@/components/form/CancelButton';
import asModal from '@/components/asModal';
import { Screen, ModalScreenProps } from '@/types/navigation';

export interface EditIncomingShareItemProps {
    name: string;
    note: string;
    onUpdate: (value: FormValues) => void;
}

interface FormValues {
    name: string;
    note: string;
}

const EditIncomingShareItem: Screen<
    EditIncomingShareItemProps & ModalScreenProps
> = (props) => {
    const initialFormValues: FormValues = {
        name: props.name,
        note: props.note,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        note: Yup.string().nullable(),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        props.onUpdate(values);
        props.dismiss();
    };

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({ handleSubmit, isSubmitting, values }) => (
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <View style={{ flex: 1 }}>
                            <AutoGrowTextField
                                required={true}
                                name="name"
                                placeholder="Item"
                            />
                        </View>
                    </View>
                    <View style={{ paddingVertical: bsl(20) }}>
                        <AutoGrowTextField
                            name="note"
                            maxLength={100}
                            placeholder="Add a note"
                        />
                    </View>
                    <View style={{ paddingTop: bsl(20) }}>
                        <SubmitButton
                            disabled={values.name === ''}
                            onPress={handleSubmit}
                            processing={isSubmitting}>
                            Update
                        </SubmitButton>
                        <CancelButton onPress={props.dismiss} />
                    </View>
                </View>
            )}
        </Formik>
    );
};

export default asModal(EditIncomingShareItem);
