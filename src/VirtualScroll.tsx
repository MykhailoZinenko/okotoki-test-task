import React, { useRef, useState, useEffect } from "react";

interface VirtualScrollProps {
    items: string[];
    itemHeight: number;
    visibleItemCount: number;
    renderItem: (item: string, index: number) => JSX.Element;
}

const VirtualScroll: React.FC<VirtualScrollProps> = ({
    items,
    itemHeight,
    visibleItemCount,
    renderItem,
}) => {
    const [visibleItems, setVisibleItems] = useState<string[]>([]);
    const listRef = useRef<HTMLDivElement>(null);

    const updateVisibleItems = () => {
        if (listRef.current) {
            const scrollTop = listRef.current.scrollTop;
            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = startIndex + visibleItemCount;
            setVisibleItems(items.slice(startIndex, endIndex));
        }
    };

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener("scroll", updateVisibleItems);
            updateVisibleItems();
        }

        return () => {
            if (listElement) {
                listElement.removeEventListener("scroll", updateVisibleItems);
            }
        };
    }, [items]);

    return (
        <div
            ref={listRef}
            style={{
                height: `${itemHeight * visibleItemCount}px`,
                overflowY: "auto",
                position: "relative",
            }}
        >
            <div
                style={{
                    height: `${items.length * itemHeight}px`,
                    position: "relative",
                }}
            >
                {visibleItems.map((item, index) => (
                    <div
                        key={item}
                        style={{
                            position: "absolute",
                            top: `${
                                (index +
                                    Math.floor(
                                        listRef.current?.scrollTop! / itemHeight
                                    )) *
                                itemHeight
                            }px`,
                            height: `${itemHeight}px`,
                            width: "100%",
                        }}
                    >
                        {renderItem(item, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VirtualScroll;
