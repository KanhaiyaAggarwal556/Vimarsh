// Enhanced responsive styles object with dark theme
const styles = {
  container: {
    minHeight: "100vh",
    background: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "20px",
    // Responsive padding
    "@media (max-width: 768px)": {
      padding: "10px",
    },
    "@media (max-width: 480px)": {
      padding: "5px",
    },
  },
  
  pageContainer: {
    width: "100%",
    maxWidth: "500px",
    background: "rgba(26, 24, 24, 0.75)",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
    overflow: "hidden",
    // Responsive adjustments
    "@media (max-width: 768px)": {
      maxWidth: "90%",
      borderRadius: "16px",
    },
    "@media (max-width: 480px)": {
      maxWidth: "95%",
      borderRadius: "12px",
    },
  },
  
  header: {
    padding: "30px 40px 20px",
    background: "linear-gradient(45deg, #253b9dc3 0%, #7e33cab1 100%)",
    color: "white",
    textAlign: "center",
    position: "relative",
    // Responsive padding
    "@media (max-width: 768px)": {
      padding: "25px 30px 15px",
    },
    "@media (max-width: 480px)": {
      padding: "20px 20px 15px",
    },
  },
  
  backButton: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "white",
    // Responsive size
    "@media (max-width: 480px)": {
      width: "35px",
      height: "35px",
      left: "15px",
    },
  },
  
  headerIcon: {
    width: "60px",
    height: "60px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    // Responsive size
    "@media (max-width: 480px)": {
      width: "50px",
      height: "50px",
      margin: "0 auto 15px",
    },
  },
  
  headerTitle: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 10px",
    // Responsive font size
    "@media (max-width: 768px)": {
      fontSize: "24px",
    },
    "@media (max-width: 480px)": {
      fontSize: "20px",
      margin: "0 0 8px",
    },
  },
  
  headerSubtitle: {
    fontSize: "16px",
    opacity: "0.9",
    margin: "0",
    fontWeight: "400",
    // Responsive font size
    "@media (max-width: 480px)": {
      fontSize: "14px",
    },
  },
  
  formContainer: {
    padding: "40px",
    background: "#1A1A1A",
    // Responsive padding
    "@media (max-width: 768px)": {
      padding: "30px",
    },
    "@media (max-width: 480px)": {
      padding: "20px",
    },
  },
  
  formGroup: {
    marginBottom: "25px",
    // Responsive margin
    "@media (max-width: 480px)": {
      marginBottom: "20px",
    },
  },
  
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: "8px",
    // Responsive font size
    "@media (max-width: 480px)": {
      fontSize: "13px",
    },
  },
  
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  
  inputIcon: {
    position: "absolute",
    left: "16px",
    color: "#9CA3AF",
    zIndex: 1,
    // Responsive positioning
    "@media (max-width: 480px)": {
      left: "12px",
    },
  },
  
  passwordToggle: {
    position: "absolute",
    right: "16px",
    color: "#9CA3AF",
    cursor: "pointer",
    zIndex: 1,
    background: "none",
    border: "none",
    // Responsive positioning
    "@media (max-width: 480px)": {
      right: "12px",
    },
  },
  
  formInput: {
    width: "100%",
    padding: "16px 16px 16px 50px",
    border: "2px solid #374151",
    borderRadius: "12px",
    fontSize: "16px",
    background: "#111827",
    color: "#F9FAFB",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    // Responsive padding and font size
    "@media (max-width: 480px)": {
      padding: "14px 14px 14px 45px",
      fontSize: "16px", // Keep 16px to prevent zoom on iOS
      borderRadius: "10px",
    },
  },
  
  formInputWithToggle: {
    paddingRight: "50px",
    // Responsive padding
    "@media (max-width: 480px)": {
      paddingRight: "45px",
    },
  },
  
  formInputFocus: {
    borderColor: "#667eea",
    background: "#1F2937",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
  
  formInputError: {
    borderColor: "#EF4444",
    background: "#1F1F1F",
  },
  
  errorMessage: {
    color: "#EF4444",
    fontSize: "14px",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    // Responsive font size
    "@media (max-width: 480px)": {
      fontSize: "12px",
    },
  },
  
  passwordStrength: {
    marginTop: "8px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#E5E7EB",
    // Responsive font size
    "@media (max-width: 480px)": {
      fontSize: "11px",
      gap: "6px",
    },
  },
  
  strengthBar: {
    height: "4px",
    borderRadius: "2px",
    flex: 1,
    background: "#374151",
    overflow: "hidden",
    // Responsive height
    "@media (max-width: 480px)": {
      height: "3px",
    },
  },
  
  strengthFill: {
    height: "100%",
    transition: "all 0.3s ease",
  },
  
  submitButton: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    // Responsive padding and font size
    "@media (max-width: 480px)": {
      padding: "14px",
      fontSize: "16px", // Keep 16px to prevent zoom on iOS
      borderRadius: "10px",
      marginTop: "16px",
    },
  },
  
  submitButtonDisabled: {
    opacity: "0.6",
    cursor: "not-allowed",
    transform: "none",
  },
  
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    // Responsive size
    "@media (max-width: 480px)": {
      width: "18px",
      height: "18px",
    },
  },
  
  successContainer: {
    textAlign: "center",
    padding: "60px 40px",
    // Responsive padding
    "@media (max-width: 768px)": {
      padding: "50px 30px",
    },
    "@media (max-width: 480px)": {
      padding: "40px 20px",
    },
  },
  
  successIcon: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 30px",
    animation: "bounce 0.6s ease-out",
    // Responsive size
    "@media (max-width: 480px)": {
      width: "70px",
      height: "70px",
      margin: "0 auto 25px",
    },
  },
  
  successTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: "16px",
    // Responsive font size
    "@media (max-width: 768px)": {
      fontSize: "24px",
    },
    "@media (max-width: 480px)": {
      fontSize: "20px",
      marginBottom: "12px",
    },
  },
  
  successMessage: {
    fontSize: "16px",
    color: "#D1D5DB",
    lineHeight: "1.6",
    marginBottom: "40px",
    // Responsive font size and margin
    "@media (max-width: 768px)": {
      fontSize: "15px",
      marginBottom: "35px",
    },
    "@media (max-width: 480px)": {
      fontSize: "14px",
      marginBottom: "30px",
    },
  },
  
  successActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    // Responsive gap
    "@media (max-width: 480px)": {
      gap: "10px",
    },
  },
  
  primaryButton: {
    padding: "16px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    // Responsive padding and font size
    "@media (max-width: 480px)": {
      padding: "14px 20px",
      fontSize: "16px", // Keep 16px to prevent zoom on iOS
      borderRadius: "10px",
    },
  },
  
  secondaryButton: {
    padding: "16px 24px",
    background: "transparent",
    color: "#667eea",
    border: "2px solid #667eea",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    // Responsive padding and font size
    "@media (max-width: 480px)": {
      padding: "14px 20px",
      fontSize: "16px", // Keep 16px to prevent zoom on iOS
      borderRadius: "10px",
    },
  },
  
  infoBox: {
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    // Responsive padding and gap
    "@media (max-width: 480px)": {
      padding: "14px",
      gap: "10px",
      borderRadius: "10px",
      marginBottom: "16px",
    },
  },
  
  infoText: {
    fontSize: "14px",
    color: "#E5E7EB",
    lineHeight: "1.5",
    // Responsive font size
    "@media (max-width: 480px)": {
      fontSize: "13px",
    },
  },
  
  backToLogin: {
    color: "white",
  },

  // CSS animations (these would typically be in your CSS file)
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  
  '@keyframes bounce': {
    '0%': { transform: 'scale(0.3)' },
    '50%': { transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '100%': { transform: 'scale(1)' }
  }
};

// Helper function to apply responsive styles
export const getResponsiveStyles = (baseStyles) => {
  const processedStyles = {};
  
  Object.keys(baseStyles).forEach(key => {
    const style = baseStyles[key];
    processedStyles[key] = {};
    
    Object.keys(style).forEach(prop => {
      if (prop.startsWith('@media')) {
        // Handle media queries - you'll need to implement this based on your framework
        // For CSS-in-JS libraries like styled-components or emotion
        processedStyles[key][prop] = style[prop];
      } else {
        processedStyles[key][prop] = style[prop];
      }
    });
  });
  
  return processedStyles;
};

export default styles;