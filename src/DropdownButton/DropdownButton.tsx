import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { FaSearch } from "react-icons/fa";

interface DropdownButtonProps {
    children: React.ReactNode;
    label: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ children, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const portalRoot = useRef(document.createElement("div"));

    const toggleDropdown = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    }, []);

    const updateDropdownPosition = useCallback(() => {
        if (isOpen && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = dropdownRef.current?.offsetHeight || 0;
            const dropdownWidth = dropdownRef.current?.offsetWidth || 0;
            const screenPadding = 10;

            const top = Math.min(
                buttonRect.bottom + window.scrollY + screenPadding,
                window.innerHeight - dropdownHeight - screenPadding
            );
            const left = Math.min(
                buttonRect.left + window.scrollX,
                window.innerWidth - dropdownWidth - screenPadding
            );

            setDropdownStyle({
                position: "absolute",
                top: `${top}px`,
                left: `${left}px`,
                width: "fit-content",
                right: "auto",
            });
        }
    }, [isOpen]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.body.appendChild(portalRoot.current);
        window.addEventListener("resize", updateDropdownPosition);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.removeChild(portalRoot.current);
            window.removeEventListener("resize", updateDropdownPosition);
        };
    }, [handleClickOutside, updateDropdownPosition]);

    useEffect(() => {
        updateDropdownPosition();
    }, [isOpen, updateDropdownPosition]);

    const dropdownContent = useMemo(
        () =>
            isOpen && (
                <div
                    className="dropdown-content"
                    style={dropdownStyle}
                    ref={dropdownRef}
                >
                    {children}
                </div>
            ),
        [isOpen, dropdownStyle, children]
    );

    return (
        <div className="dropdown-container">
            <button
                className={`dropdown-button ${isOpen ? "active" : ""}`}
                onClick={toggleDropdown}
                ref={buttonRef}
            >
                <FaSearch className="dropdown-button-icon" />
                {label}
            </button>
            {ReactDOM.createPortal(dropdownContent, portalRoot.current)}
        </div>
    );
};

export default DropdownButton;
