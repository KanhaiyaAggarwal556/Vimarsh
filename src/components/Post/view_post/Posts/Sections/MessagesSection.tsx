// components/Sections/MessagesSection.tsx
interface MessagesSectionProps {
  isActive: boolean;
}

const MessagesSection = ({ isActive }: MessagesSectionProps) => {
  return (
    <div className={`section messages-section ${isActive ? "active" : ""}`}>
      <div className="messages-placeholder">
        <h2>Messages</h2>
        <p>Your messages will appear here</p>
        {/* Add your messages content here */}
      </div>
    </div>
  );
};

export default MessagesSection;