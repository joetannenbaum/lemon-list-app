import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { bsl } from '@/util/style';

export interface SortableListProps {
    data: any[];
    renderItem: (
        item: any,
        index: number,
        dragging: boolean,
    ) => React.ReactElement<any>;
    onUpdate: (data: any[]) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    disableScroll?: boolean;
}

const SortableList: React.FC<SortableListProps> = (props) => {
    const { width } = useWindowDimensions();

    const [scrollEnabled, setScrollEnabled] = useState(true);

    const onDragEnd = () => {
        if (props.onDragEnd) {
            props.onDragEnd();
        }

        setScrollEnabled(true);
    };

    const onDragStart = () => {
        if (props.onDragStart) {
            props.onDragStart();
        }

        setScrollEnabled(false);
    };

    return (
        <FlatList
            scrollEnabled={false}
            data={props.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) =>
                props.renderItem(item, index, !scrollEnabled)
            }
        />
    );

    const renderSortable = () => (
        <DragSortableView
            dataSource={props.data}
            parentWidth={width}
            childrenWidth={width}
            childrenHeight={bsl(110)}
            onDataChange={props.onUpdate}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={(item, index) =>
                props.renderItem(item, index, !scrollEnabled)
            }
        />
    );

    if (props.disableScroll) {
        return renderSortable();
    }

    return (
        <ScrollView style={{ flex: 1 }} scrollEnabled={scrollEnabled}>
            {renderSortable()}
        </ScrollView>
    );
};

export default SortableList;
