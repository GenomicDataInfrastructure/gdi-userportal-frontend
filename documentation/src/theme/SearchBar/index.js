import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";

export default function SearchBar() {
  const location = useLocation();
  const [currentScope, setCurrentScope] = useState("all");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [searchIndexes, setSearchIndexes] = useState(null);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Load search indexes on mount
  useEffect(() => {
    fetch("/gdi-userportal-frontend/search-indexes/search-indexes.json")
      .then((res) => res.json())
      .then((indexes) => {
        setSearchIndexes(indexes);
        console.log("Search indexes loaded:", Object.keys(indexes));
      })
      .catch((err) => console.error("Failed to load search indexes:", err));
  }, []);

  // Determine current scope based on URL
  useEffect(() => {
    const path = location.pathname;
    let newScope = "all";

    // Check for catalog managers guide paths FIRST (more specific)
    if (
      path.includes("/catalogue-managers-guide/") ||
      path.includes("/welcome-catalogue-managers")
    ) {
      newScope = "catalogue-managers-guide";
    }
    // Check for developer guide paths
    else if (
      path.includes("/developer-guide/") ||
      path.includes("/welcome-developers") ||
      path.includes("/set-up-a-developer-environment")
    ) {
      newScope = "developer-guide";
    }
    // Check for system admin guide paths
    else if (
      path.includes("/system-admin-guide/") ||
      path.includes("/welcome-system-admins") ||
      path.includes("/architecture-overview") ||
      path.includes("/configure-") ||
      path.includes("/deploy-") ||
      path.includes("/set-up-authentication")
    ) {
      newScope = "system-admin-guide";
    }
    // Check for user guide paths - includes category URLs and specific slugs
    else if (
      path.includes("/category/") ||
      path.includes("/welcome-data-users") ||
      path.includes("/create-an-account") ||
      path.includes("/export-metadata") ||
      path.includes("/request-datasets") ||
      path.includes("/explore-datasets")
    ) {
      newScope = "user-guide";
    }
    // Homepage and intro page should search all
    else if (
      path === "/gdi-userportal-frontend/" ||
      path === "/gdi-userportal-frontend/intro" ||
      path === "/intro"
    ) {
      newScope = "all";
    }

    setCurrentScope(newScope);
  }, [location.pathname]);

  // Simple text search function
  const performSearch = (searchQuery, scope) => {
    if (!searchIndexes || !searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const targetIndex = searchIndexes[scope] || [];
    const query = searchQuery.toLowerCase();

    return targetIndex
      .map((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const contentMatch = item.content.toLowerCase().includes(query);

        if (titleMatch || contentMatch) {
          // Simple scoring: title matches get higher score
          const score = titleMatch ? 2 : 1;
          return { ...item, score };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Limit to 8 results
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveResultIndex(-1);

    if (value.trim().length >= 2) {
      const searchResults = performSearch(value, currentScope);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setIsOpen(true);
      setActiveResultIndex((index) =>
        index < 0 || index === results.length - 1 ? 0 : index + 1
      );
      return;
    }

    if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setIsOpen(true);
      setActiveResultIndex((index) =>
        index < 0
          ? results.length - 1
          : (index - 1 + results.length) % results.length
      );
      return;
    }

    if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      const selectedResult =
        results[activeResultIndex >= 0 ? activeResultIndex : 0];
      window.location.assign(selectedResult.url);
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      setResults([]);
      setActiveResultIndex(-1);
    }
  };

  useEffect(() => {
    if (activeResultIndex >= 0) {
      resultsRef.current?.children[activeResultIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeResultIndex]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  // Generate placeholder text based on current scope
  const getPlaceholderText = () => {
    switch (currentScope) {
      case "all":
        return "Search all documentation";
      case "user-guide":
        return "Search data user guide";
      case "catalogue-managers-guide":
        return "Search catalogue manager guide";
      case "system-admin-guide":
        return "Search system admin guide";
      case "developer-guide":
        return "Search developer guide";
      default:
        return "Search documentation";
    }
  };

  return (
    <div
      className={`custom-search-wrapper search-scope-${currentScope}`}
      ref={searchRef}
    >
      <div className="search-input-wrapper">
        <input
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen && results.length > 0}
          aria-controls="documentation-search-results"
          aria-activedescendant={
            activeResultIndex >= 0
              ? `documentation-search-result-${activeResultIndex}`
              : undefined
          }
          placeholder={getPlaceholderText()}
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="search-input"
        />

        {isOpen && results.length > 0 && (
          <div
            className="search-results-dropdown"
            id="documentation-search-results"
            role="listbox"
            ref={resultsRef}
          >
            {results.map((result, index) => (
              <a
                key={result.id}
                href={result.url}
                id={`documentation-search-result-${index}`}
                role="option"
                aria-selected={activeResultIndex === index}
                className={`search-result-item${
                  activeResultIndex === index
                    ? " search-result-item-active"
                    : ""
                }`}
                onMouseMove={() => setActiveResultIndex(index)}
                onClick={handleResultClick}
              >
                <div className="search-result-title">{result.title}</div>
                <div className="search-result-content">
                  {result.content.substring(0, 100)}...
                </div>
                <div className="search-result-guide">
                  {result.guide.replace("-", " ")}
                </div>
              </a>
            ))}
          </div>
        )}

        {isOpen && query.length >= 2 && results.length === 0 && (
          <div className="search-results-dropdown">
            <div className="no-results">No results found for "{query}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
