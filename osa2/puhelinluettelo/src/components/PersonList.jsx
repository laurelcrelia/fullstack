const PersonList = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}{" "}
          <button onClick={() => onDelete(person)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default PersonList;
