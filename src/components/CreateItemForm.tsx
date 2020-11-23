import React, { useRef } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { View, TextInput } from 'react-native';
import * as Yup from 'yup';
import SubmitButton from './form/SubmitButton';
import TextField from './form/TextField';
import api from '@/api';
import { useMutation, useQueryCache } from 'react-query';
import useShoppingList from '@/hooks/useShoppingList';
import AutoComplete from './AutoComplete';
import useItems from '@/hooks/useItems';
import logger from '@/util/logger';

interface Props {
    listId: number;
}

interface FormValues {
    name: string;
}

const CreateItemForm: React.FC<Props> = (props) => {
    const queryCache = useQueryCache();

    const inputRef = useRef<TextInput>(null);

    const list = useShoppingList(props.listId);
    const items = useItems();

    const itemsData =
        items.data?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];

    const [mutate, { status, data, error }] = useMutation(
        (params) => {
            return api.post(
                `shopping-list-versions/${list.data?.active_version.id}/items`,
                params,
            );
        },
        {
            onSuccess() {
                queryCache.invalidateQueries(['shopping-list', props.listId]);
                queryCache.invalidateQueries('items');
            },
        },
    );

    const initialFormValues: FormValues = {
        name: '',
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string(),
    });

    const onSubmit = (values: FormValues, form: FormikHelpers<FormValues>) => {
        mutate({
            name: values.name,
        })
            .then((res) => {
                form.setSubmitting(false);
                form.resetForm();
                inputRef.current?.focus();
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
            {({
                handleSubmit,
                isSubmitting,
                values,
                setSubmitting,
                resetForm,
            }) => (
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TextField
                                ref={inputRef}
                                name="name"
                                placeholder="Add Item Here"
                                onSubmitEditing={() => {
                                    if (values.name.trim().length > 0) {
                                        handleSubmit();
                                    }
                                }}
                            />
                        </View>

                        <SubmitButton
                            disabled={values.name === ''}
                            onPress={handleSubmit}
                            processing={isSubmitting}>
                            Add
                        </SubmitButton>
                    </View>
                    <AutoComplete
                        query={values.name}
                        data={itemsData}
                        onSelect={(val) => {
                            setSubmitting(true);

                            mutate({
                                item_id: val.value,
                            })
                                .then((res) => {
                                    setSubmitting(false);
                                    resetForm();
                                    inputRef.current?.focus();
                                })
                                .catch((error) => {
                                    setSubmitting(false);
                                    logger.red(error);
                                });
                        }}
                    />
                </View>
            )}
        </Formik>
    );
};

export default CreateItemForm;
