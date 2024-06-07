import { useState, useEffect } from "react";
import noteService from "./services/countries";
import Filter from "./components/Filter";
import CountryList from "./components/CountryList";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [showFiltered, setShowFiltered] = useState(true);

  useEffect(() => {
    noteService.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);

  const countriesToShow = showFiltered
    ? countries
    : countries.filter((country) =>
        country.name.common.toLowerCase().includes(newFilter.toLowerCase())
      );

  const handleFilterCountry = (event) => {
    event.preventDefault();
    setShowFiltered(false);
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <Filter value={newFilter} onChange={handleFilterCountry} />

      <CountryList countries={countriesToShow} />
    </div>
  );
};

export default App;
