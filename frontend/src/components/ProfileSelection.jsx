const options = {
  hobbies: [
    "Coding",
    "Reading",
    "Gaming",
    "Sports",
    "Music",
    "Travel",
    "Cooking",
    "Art",
    "Photography",
    "Writing",
  ],
  strengths: [
    "Quick Learner",
    "Creative",
    "Disciplined",
    "Communicative",
    "Analytical",
    "Empathetic",
    "Leadership",
    "Adaptable",
    "Detail-Oriented",
    "Resilient",
  ],
  weaknesses: [
    "Procrastination",
    "Overthinking",
    "Impatience",
    "Perfectionism",
    "Time Management",
    "Public Speaking",
    "Organization",
    "Distraction",
    "Decision-Making",
    "Delegation",
  ],
};

const ProfileSelection = ({ selections, onSelect }) => {
  return (
    <div className="profile-section">
      {Object.keys(options).map((category) => (
        <div key={category} className="profile-card">
          <h3 className="profile-title">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h3>

          <div className="profile-options">
            {options[category].map((item) => {
              const selected = selections[category]?.includes(item);

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelect(category, item)}
                  className={`profile-option ${selected ? "selected" : ""}`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileSelection;
