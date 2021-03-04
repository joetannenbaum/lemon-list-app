import React from 'react';
import { ShoppingListItem as ShoppingListItemType } from '@/types/ShoppingListItem';
import BaseText from '@/components/BaseText';
import { View, Alert } from 'react-native';
import useUpdateShoppingListItem from '@/hooks/useUpdateShoppingListItem';
import useDeleteShoppingListItem from '@/hooks/useDeleteShoppingListItem';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SubmitButton from '@/components/form/SubmitButton';
import Select from '@/components/form/Select';
import useStores from '@/hooks/useStores';
import sortBy from 'lodash/sortBy';
import useUpdateItem from '@/hooks/useUpdateItem';
import omit from 'lodash/omit';
import AutoGrowTextField from '@/components/form/AutoGrowTextField';
import QuantityControlField from '@/components/QuantityControlField';
import { bsl, grey300 } from '@/util/style';
import CancelButton from '@/components/form/CancelButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
