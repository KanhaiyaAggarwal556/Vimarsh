// components/Header/SectionToggle.tsx
interface SectionToggleProps {
  activeSection: string;
  onSectionToggle: (section: string) => void;
}

const SectionToggle = ({ activeSection, onSectionToggle }: SectionToggleProps) => {
  return (
    <div className="section-toggle">
      <button
        className={`toggle-btn ${activeSection === "home" ? "active" : ""}`}
        onClick={() => onSectionToggle("home")}
      >
        Home
      </button>
      <button
        className={`toggle-btn ${activeSection === "messages" ? "active" : ""}`}
        onClick={() => onSectionToggle("messages")}
      >
        Messages
      </button>
      <div className={`toggle-indicator ${activeSection}`}></div>
    </div>
  );
};

export default SectionToggle;