import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const setSearchData = (query, results) => {
    setSearchQuery(query);
    setSearchResults(results);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, searchResults, setSearchData }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
