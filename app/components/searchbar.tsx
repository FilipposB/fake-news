"use client";

import React, { useState, FormEvent, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import debounce from 'lodash.debounce';
import { IArticle } from "../model/article.model";
import { useRouter } from "next/navigation";

function SearchComponent() {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<IArticle[]>([]);

    const lastTermLength = useRef(0);

    const router = useRouter()

    const search = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const searchTerm = formData.get('article') as string | null;

        if (searchTerm) {
            fetchSelect(searchTerm)
        }


    };

    const fetchSelect = (headline: string) => {
        setQuery("");
        setSuggestions([]);
        router.push(`/article/${encodeURIComponent(headline)}`)

    }


    const fetchSuggestions = async (searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 3) {
            setSuggestions([]);
            return;
        }

        if (searchTerm.length > 3 && suggestions.length == 0 && lastTermLength.current < searchTerm.length){
            return;
        } 

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/search?q=${encodeURIComponent(searchTerm)}`);
            const results = await response.json();
            lastTermLength.current = searchTerm.length;
            setSuggestions(results);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    // Debounced version of the fetch function
    const debouncedFetchSuggestions = debounce((searchTerm: string) => {
        fetchSuggestions(searchTerm);
    }, 300);

    // Handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        debouncedFetchSuggestions(value);
    };

    return (
        <form className="relative w-full" onSubmit={(e) => search(e)}>
            <button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5"
            >
                <FontAwesomeIcon icon={faSearch} className="text-black" />
            </button>
            <input
                type="text"
                name="article"
                placeholder="Search articles..."
                value={query}
                autoComplete="off"
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-black"
            />
            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-gray-800 border rounded-lg mt-1 z-10">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => fetchSelect(suggestion.headline)}
                        >
                            {suggestion.headline}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
}

export default SearchComponent;
