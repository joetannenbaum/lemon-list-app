import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { AutoDragSortableView } from 'react-native-drag-sort';
import { ScrollView } from 'react-native-gesture-handler';

export interface SortableListProps {
    data: any[];
    renderItem: (
        item: any,
        index: number,
        dragging: boolean,
    ) => React.ReactElement<any>;
    onUpdate: (data: any[]) => void;
}

const SortableList: React.FC<SortableListProps> = (props) => {
    const { width } = useWindowDimensions();

    const [scrollEnabled, setScrollEnabled] = useState(true);

    return (
        <ScrollView style={{ flex: 1 }} scrollEnabled={scrollEnabled}>
            <AutoDragSortableView
                dataSource={props.data}
                parentWidth={width}
                childrenWidth={width}
                childrenHeight={50}
                onDataChange={props.onUpdate}
                onDragStart={() => setScrollEnabled(false)}
                onDragEnd={() => setScrollEnabled(true)}
                keyExtractor={(item) => item.id}
                renderItem={(item, index) =>
                    props.renderItem(item, index, !scrollEnabled)
                }
            />
        </ScrollView>
    );
};

export default SortableList;
