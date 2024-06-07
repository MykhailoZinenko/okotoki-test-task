import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import { FaSearch } from "react-icons/fa";

interface DropdownButtonProps {
    children: React.ReactNode;
    label: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ children, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button
                className={`dropdown-button  ${isOpen ? "active" : ""}`}
                onClick={toggleDropdown}
            >
                <FaSearch className="icon-left" />
                {label}
            </button>
            {isOpen && <div className="dropdown-content">{children}</div>}
        </div>
    );
};

export default DropdownButton;
