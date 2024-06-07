import { useEffect, useState } from "react";
import "./App.css";
import DropdownButton from "./DropdownButton/DropdownButton";
import FilteredList from "./FilteredList/FilteredList";

const fetchCoins = async (): Promise<string[]> => {
    const response = await fetch("https://api-eu.okotoki.com/coins");
    return response.json();
};

function App() {
    const [coins, setCoins] = useState<string[]>([]);

    useEffect(() => {
        const getCoins = async () => {
            const data = await fetchCoins();
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
