export const ICONS = {
  USER_VARIANT: require("../icons/User_Variant.webp"),
  LIGHT_MODE: require("../icons/Sun.webp"),
  DARK_MODE: require("../icons/Moon.webp"),
  BEE_LOGO: require("../icons/bee-logo.webp"),
  WHITE_BEE_LOGO: require("../icons/bee-logo-white.webp"),
  ALIGN_RIGHT: require("../icons/Align-Right.webp"),
  CALENDAR: require("../icons/Calendar.webp"),
  TCHECK: require("../icons/Check-Circle.webp"),
  EDIT_ICON: require("../icons/EDIT-ICON.webp"),
  CLIPBOARD: require("../icons/Clipboard.webp"),
  LIXEIRA: require("../icons/Lixeira.webp"),
  MAIL: require("../icons/Mail.webp"),
  PASSWORD: require("../icons/Password.webp"),
  PLUS_CIRCLE: require("../icons/plus-circle.webp"),
  SIDE_ARROW: require("../icons/SideArrow.webp"),
  DOWN_ARROW: require("../icons/DOWN-ARROW.webp"),
  UP_ARROW: require("../icons/ArrowUp.webp"),
  TRENDING_UP: require("../icons/Trending-Up.webp"),
  X_BUTTON: require("../icons/X.webp"),
  MESSAGE_CIRCLE: require("../icons/Message-Circle.webp"),
  ACTIVITY: require("../icons/Activity.webp"),
};

export const MESSAGES = {
  WELCOME: "Seja Bem-Vindo(a)",
  TASKS: "📋 Tarefas",
  NOTES: "📝 Notas",
  REPORTS: "📊 Relatórios",
};

export const calculateTaskCounts = (tasks) => {
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return { pendingTasks, completedTasks, totalTasks };
};

export const calculateProductivityData = (tasks) => {
  return tasks.reduce((acc, task) => {
    const day = new Date(task.created_at).toLocaleDateString("en-US", {
      weekday: "long",
    });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
};

export const calculateTimeSpentData = (tasks) => {
  return tasks.map((task) => {
    if (!task.due_date) return 0;
    const createdAt = new Date(task.created_at);
    const dueDate = new Date(task.due_date);
    const hoursSpent = (dueDate - createdAt) / (1000 * 60 * 60);
    return Math.max(hoursSpent, 0);
  });
};

export const calculateUsagePatterns = (tasks) => {
  const usagePatterns = { manhã: 0, tarde: 0, noite: 0 };

  tasks.forEach((task) => {
    const hour = new Date(task.created_at).getHours();
    if (hour >= 6 && hour < 12) usagePatterns.manhã++;
    else if (hour >= 12 && hour < 18) usagePatterns.tarde++;
    else usagePatterns.noite++;
  });

  return usagePatterns;
};

export const handleLogout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  navigate("/login");
};

export const toggleTheme = (mode, setIsDarkMode) => {
  setIsDarkMode(mode === "dark");
  localStorage.setItem("theme", mode);
};

export const getStoredUsername = () => {
  return localStorage.getItem("username") || "";
};

export const getStoredProfilePic = () => {
  return localStorage.getItem("profilePic") || "";
};

export const getStoredTheme = () => {
  return localStorage.getItem("theme") || "light";
};
