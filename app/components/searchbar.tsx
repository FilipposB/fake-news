"use client";

import React, { useState, FormEvent, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash.debounce";
import { IArticle } from "../model/article.model";
import { useRouter } from "next/navigation";
import { friendlyUrl } from "../util/UrlUtil";
import Image from "next/image";

const SearchComponent: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<IArticle[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const lastTermLength = useRef(0);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const search = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Close keyboard on form submission
        inputRef.current?.blur();

        if (query.trim()) {
            fetchSelect(query.trim());
        }
    };

    const fetchSelect = (headline: string) => {
        setQuery("");
        setSuggestions([]);
        setIsOpen(false);
        router.push(`/article/${encodeURIComponent(friendlyUrl(headline))}`);
    };



    const fetchSuggestions = async (searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 3) {
            setSuggestions([]);
            return;
        }

        if (searchTerm.length > 3 && suggestions.length === 0 && lastTermLength.current < searchTerm.length) {
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/api/search?q=${encodeURIComponent(searchTerm)}`
            );
            const results: IArticle[] = await response.json();
            lastTermLength.current = searchTerm.length;
            setSuggestions(results);
            setIsOpen(true);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const debouncedFetchSuggestions = debounce((searchTerm: string) => {
        fetchSuggestions(searchTerm);
    }, 300);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        debouncedFetchSuggestions(value);
    };


    return (
        <form className="relative w-full" onSubmit={search}>
            <button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5"
            >
                <FontAwesomeIcon icon={faSearch} className="text-black" />
            </button>
            <input
                ref={inputRef}
                type="text"
                name="article"
                placeholder="Search articles..."
                value={query}
                autoComplete="off"
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-black"
            />
            {isOpen && suggestions.length > 0 && (
                <ul
                    ref={dropdownRef}
                    className="absolute top-full left-0 w-full divide-y grid bg-gray-800 border rounded-lg mt-1 z-10 max-h-64 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => fetchSelect(suggestion.topic)}
                        >
                            <div className=" flex items-center gap-2 overflow-hidden">
                            <Image
                                      className="object-contain"
                                      src={suggestion.google_image_url}
                                      alt={suggestion.google_image_query}
                                      width={32}
                                      height={32}
                                    />
                            {suggestion.headline}
                            </div>
                        
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default SearchComponent;
