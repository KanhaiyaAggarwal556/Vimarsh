interface ValidationResult {
  isChecking: boolean;
  isValid: boolean | null;
  message: string;
}

const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/email/${encodeURIComponent(email)}/availability`,
      {
        credentials: 'include',
      }
    );
    
    if (response.status === 404) {
      return true; // Email not found means it's available
    } else if (response.ok) {
      return false; // Email found means it's taken
    } else {
      throw new Error("Failed to check email availability");
    }
  } catch (error) {
    console.error('Email availability check error:', error);
    throw error;
  }
};

const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/username/${encodeURIComponent(username)}/availability`,
      {
        credentials: 'include',
      }
    );
    
    if (response.status === 404) {
      return true; // Username not found means it's available
    } else if (response.ok) {
      return false; // Username found means it's taken
    } else {
      throw new Error("Failed to check username availability");
    }
  } catch (error) {
    console.error('Username availability check error:', error);
    throw error;
  }
};

export const validateEmail = async (email: string): Promise<ValidationResult> => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return {
      isChecking: false,
      isValid: false,
      message: "Invalid email format",
    };
  }

  try {
    const isAvailable = await checkEmailAvailability(email);

    if (isAvailable) {
      return {
        isChecking: false,
        isValid: true,
        message: "Email is available",
      };
    } else {
      return {
        isChecking: false,
        isValid: false,
        message: "Email is already taken",
      };
    }
  } catch (error) {
    console.error("Email validation error:", error);
    return {
      isChecking: false,
      isValid: false,
      message: "Unable to verify email",
    };
  }
};

export const validateUsername = async (username: string): Promise<ValidationResult> => {
  if (!username || username.length < 3) {
    return {
      isChecking: false,
      isValid: false,
      message: "Username must be at least 3 characters",
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isChecking: false,
      isValid: false,
      message: "Only letters, numbers, and underscores allowed",
    };
  }

  try {
    const isAvailable = await checkUsernameAvailability(username);

    if (isAvailable) {
      return {
        isChecking: false,
        isValid: true,
        message: "Username is available",
      };
    } else {
      return {
        isChecking: false,
        isValid: false,
        message: "Username is already taken",
      };
    }
  } catch (error) {
    console.error("Username validation error:", error);
    return {
      isChecking: false,
      isValid: false,
      message: "Unable to check username",
    };
  }
};