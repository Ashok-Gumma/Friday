const themes = [
  { id: "light", label: "🌤", title: "Light" },
  { id: "dark", label: "🌙", title: "Dark" },
  { id: "emerald", label: "💚", title: "Emerald" },
  { id: "rose", label: "🌹", title: "Rose" },
];

const ThemeSwitch = ({ theme, setTheme }) => {
  return (
    <div className="theme-switch">
      {themes.map((t) => (
        <button
          key={t.id}
          className={`theme-btn ${theme === t.id ? "active" : ""}`}
          onClick={() => setTheme(t.id)}
          title={t.title}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitch;