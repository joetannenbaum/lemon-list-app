import React, { useRef } from 'react';
import { Formik, FormikHelpers } from 'formik';
import {
    View,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import * as Yup from 'yup';
import TextField from './form/TextField';
import api from '@/api';
import { useMutation, useQueryClient } from 'react-query';
import useShoppingList from '@/hooks/useShoppingList';
import AutoComplete from './AutoComplete';
import useItems from '@/hooks/useItems';
import logger from '@/util/logger';
import { bsl, paddingX, sizeImage } from '@/util/style';
import Processing from './Processing';

interface Props {
    listId: number;
}

interface FormValues {
    name: string;
}

const CreateItemForm: React.FC<Props> = (props) => {
    const queryClient = useQueryClient();

    const inputRef = useRef<TextInput>(null);

    const list = useShoppingList(props.listId);
    const items = useItems();

    const itemsData =
        items.data?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];

    const { mutateAsync } = useMutation(
        (params) => {
            return api.post(
                `shopping-list-versions/${list.data?.active_version.id}/items`,
                params,
            );
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(['shopping-list', props.listId]);
                queryClient.invalidateQueries('items');
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
        mutateAsync({
            name: values.name,
        })
            .then((res) => {
                console.log(res, form);

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
                    <View style={styles.inputWrapper}>
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
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleSubmit}
                            disabled={values.name.trim() === ''}>
                            {isSubmitting ? (
                                <Processing />
                            ) : (
                                <Image
                                    source={require('@images/plus-circle.png')}
                                    style={styles.addIcon}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    <AutoComplete
                        query={values.name}
                        data={itemsData}
                        onSelect={(val) => {
                            setSubmitting(true);

                            mutateAsync({
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

const styles = StyleSheet.create({
    inputWrapper: {
        ...paddingX(20),
        position: 'relative',
    },
    addButton: {
        position: 'absolute',
        right: bsl(40),
        top: bsl(20),
        ...sizeImage(10, 10, { width: 40 }),
    },
    addIcon: {
        ...sizeImage(76, 78, { width: 40 }),
    },
});

export default CreateItemForm;
