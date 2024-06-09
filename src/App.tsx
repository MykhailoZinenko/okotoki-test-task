import { useEffect, useState } from "react";
import "./App.css";
import DropdownButton from "./DropdownButton/DropdownButton";
import FilteredList from "./FilteredList/FilteredList";

const fetchCoins = async (): Promise<string[]> => {
    try {
        const response = await fetch("https://api-eu.okotoki.com/coins");
        if (!response.ok) {
            throw new Error("Failed to fetch coins");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching coins:", error);
        return [];
    }
};

function App() {
    const [coins, setCoins] = useState<string[]>([]);

    useEffect(() => {
        const getCoins = async () => {
            let data = (await fetchCoins())
                .sort()
                .filter((item) => item !== "");

            setCoins(data);
        };
        getCoins();
    }, []);

    return (
        <div className="app">
            <DropdownButton label="Search">
                <FilteredList items={coins} />
            </DropdownButton>
        </div>
    );
}

export default App;
