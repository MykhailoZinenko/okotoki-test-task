import React, { useState, useEffect, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import "./styles.css";
import { FaStar, FaRegStar, FaTimes, FaSearch } from "react-icons/fa";
import VirtualScroll from "../VirtualScroll";

const FilteredList: React.FC<{ items: string[] }> = ({ items }) => {
    const [displayedCoins, setDisplayedCoins] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

    const ITEM_HEIGHT = 40;
    const VISIBLE_ITEMS_COUNT = 9;

    const fuse = useMemo(() => new Fuse(items, { keys: [] }), [items]);

    useEffect(() => {
        const results = searchQuery
            ? fuse.search(searchQuery).map((result) => result.item)
            : items;

        setDisplayedCoins(
            activeTab === "favorites"
                ? results.filter((coin) => favorites.includes(coin))
                : results
        );
    }, [searchQuery, activeTab, items, favorites, fuse]);

    const toggleFavorite = useCallback((coin: string) => {
        setFavorites((prev) =>
            prev.includes(coin)
                ? prev.filter((fav) => fav !== coin)
                : [...prev, coin]
        );
    }, []);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
        },
        []
    );

    const clearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    const handleTabChange = useCallback((tab: "all" | "favorites") => {
        setActiveTab(tab);
    }, []);

    const renderItem = useCallback(
        (coin: string) => (
            <div
                className="list-item"
                style={{ height: `${ITEM_HEIGHT}px` }}
                key={coin}
            >
                <button
                    className="icon-button"
                    onClick={() => toggleFavorite(coin)}
                >
                    {favorites.includes(coin) ? <FaStar /> : <FaRegStar />}
                </button>
                <span>{coin}</span>
            </div>
        ),
        [favorites, toggleFavorite]
    );

    return (
        <div className="filtered-list-container">
            <div className="input-container">
                <FaSearch className="icon-left" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search…"
                />
                {searchQuery && (
                    <FaTimes className="clear-button" onClick={clearSearch} />
                )}
            </div>
            <div className="divider" />
            <div className="tabs">
                <button
                    onClick={() => handleTabChange("favorites")}
                    className={`tab-button ${
                        activeTab === "favorites" ? "active" : ""
                    }`}
                    disabled={activeTab === "favorites"}
                >
                    <FaStar className="icon-left" />
                    Favorites
                </button>
                <button
                    onClick={() => handleTabChange("all")}
                    className={`tab-button ${
                        activeTab === "all" ? "active" : ""
                    }`}
                    disabled={activeTab === "all"}
                >
                    All Coins
                </button>
            </div>
            <div className="list-container">
                <VirtualScroll
                    items={displayedCoins}
                    itemHeight={ITEM_HEIGHT}
                    visibleItemCount={VISIBLE_ITEMS_COUNT}
                    renderItem={renderItem}
                />
            </div>
        </div>
    );
};

export default FilteredList;
