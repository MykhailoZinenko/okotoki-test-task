import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import "./styles.css";
import { FaStar, FaRegStar, FaTimes, FaSearch } from "react-icons/fa";

const FilteredList: React.FC<{ items: string[] }> = ({
    items,
}: {
    items: string[];
}) => {
    const [displayedCoins, setDisplayedCoins] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
    const [visibleCoins, setVisibleCoins] = useState<string[]>([]);
    const listRef = useRef<HTMLDivElement>(null);

    const ITEM_HEIGHT = 40;
    const VISIBLE_ITEMS_COUNT = 9;

    const fuse = new Fuse(items, { keys: [] });

    useEffect(() => {
        const results = searchQuery
            ? fuse.search(searchQuery).map((result) => result.item)
            : items;

        setDisplayedCoins(
            activeTab === "favorites"
                ? results.filter((coin) => favorites.includes(coin))
                : results
        );
    }, [searchQuery, activeTab, items, favorites]);

    useEffect(() => {
        setVisibleCoins(displayedCoins.slice(0, VISIBLE_ITEMS_COUNT));
    }, [displayedCoins]);

    const handleScroll = () => {
        if (listRef.current) {
            const scrollTop = listRef.current.scrollTop;
            const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
            const endIndex = startIndex + VISIBLE_ITEMS_COUNT;
            setVisibleCoins(displayedCoins.slice(startIndex, endIndex));
        }
    };

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (listElement) {
                listElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [displayedCoins]);

    const toggleFavorite = (coin: string) => {
        setFavorites((prev) =>
            prev.includes(coin)
                ? prev.filter((fav) => fav !== coin)
                : [...prev, coin]
        );
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleTabChange = (tab: "all" | "favorites") => {
        setActiveTab(tab);
    };

    return (
        <div className="filtered-list-container">
            <div className="input-container">
                <FaSearch className="icon-left" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                />
                {searchQuery && (
                    <FaTimes className="clear-button" onClick={clearSearch} />
                )}
            </div>
            <div className="divider" />
            <div className="tabs">
                <button
                    onClick={() => handleTabChange("favorites")}
                    className={activeTab === "favorites" ? "active" : ""}
                >
                    <FaStar className="icon-left" />
                    Favorites
                </button>
                <button
                    onClick={() => handleTabChange("all")}
                    className={activeTab === "all" ? "active" : ""}
                >
                    All Coins
                </button>
            </div>
            <div
                className="list-container"
                ref={listRef}
                style={{
                    height: `${ITEM_HEIGHT * VISIBLE_ITEMS_COUNT}px`,
                    overflowY: "auto",
                }}
            >
                <div
                    style={{
                        height: `${displayedCoins.length * ITEM_HEIGHT}px`,
                        position: "relative",
                    }}
                >
                    {visibleCoins.map((coin, index) => (
                        <div
                            key={coin}
                            className="list-item"
                            style={{
                                position: "absolute",
                                top: `${
                                    (index +
                                        Math.floor(
                                            listRef.current?.scrollTop! /
                                                ITEM_HEIGHT
                                        )) *
                                    ITEM_HEIGHT
                                }px`,
                                height: `${ITEM_HEIGHT}px`,
                            }}
                        >
                            <button
                                className="icon-button"
                                onClick={() => toggleFavorite(coin)}
                            >
                                {favorites.includes(coin) ? (
                                    <FaStar />
                                ) : (
                                    <FaRegStar />
                                )}
                            </button>
                            <span>{coin}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilteredList;
