import CountryView from "./CountryView";

const CountryList = ({ countries, handleClick }) => {
  // Jos maita on yli kymmenen:
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;

    // Jos maita on kymmenen tai alle mutta enemmän kuin yksi:
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map((country) => (
          <p key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleClick(country.name.common)}>
              show
            </button>
          </p>
        ))}
      </div>
    );
  }
  // Jos maita on enää yksi, näytetään maan tiedot suoraan:
  else if (countries.length === 1) {
    return (
      <div>
        <CountryView country={countries[0]} />
      </div>
    );
  }
};

export default CountryList;
