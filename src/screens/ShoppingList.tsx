import React from 'react';
import { ScreenProps, Screen } from '@/types/navigation';
import SafeAreaView from 'react-native-safe-area-view';
import useShoppingList from '@/hooks/useShoppingList';
import { FlatList } from 'react-native';
import useItems from '@/hooks/useItems';
import CreateItemForm from '@/components/CreateItemForm';
import ShoppingListItem from '@/components/ShoppingListItem';

interface Props extends ScreenProps {
    id: number;
}

const Home: Screen<Props> = (props) => {
    const list = useShoppingList(props.id);
    const items = useItems();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CreateItemForm listId={props.id} />
            <FlatList
                style={{ flex: 1 }}
                data={list.data?.active_version?.items}
                renderItem={({ item }) => (
                    <ShoppingListItem item={item} key={item.id.toString()} />
                )}
            />
        </SafeAreaView>
    );
};

export default Home;
