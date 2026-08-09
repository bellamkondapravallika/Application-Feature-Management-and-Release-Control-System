import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      totalFlags: "Total Flags",
      activeFlags: "Active Flags",
      environments: "Environments",
      auditLogs: "Audit Logs",
      dashboardOverview: "Overview of your platform",
    },
  },
  te: {
    translation: {
      dashboard: "డాష్‌బోర్డ్",
      totalFlags: "మొత్తం ఫ్లాగ్స్",
      activeFlags: "యాక్టివ్ ఫ్లాగ్స్",
      environments: "ఎన్విరాన్‌మెంట్స్",
      auditLogs: "ఆడిట్ లాగ్స్",
      dashboardOverview: " మీ పనితర మలదన కలదన"
    },
  },
  hi: {
    translation: {
      dashboard: "डैशबोर्ड",
      totalFlags: "कुल फ्लैग्स",
      activeFlags: "सक्रिय फ्लैग्स",
      environments: "एनवायरनमेंट्स",
      auditLogs: "ऑडिट लॉग्स",
      dashboardOverview: "आपके प्लेटफॉर्म का अवलोकन"
    },
  },
  ta: {
    translation: {
      dashboard: "டாஷ்போர்டு",
      totalFlags: "மொத்த கொடிகள்",
      activeFlags: "செயலில் உள்ள கொடிகள்",
      environments: "சூழல்கள்",
      auditLogs: "தணிக்கை பதிவுகள்",
      dashboardOverview: "உங்கள் திட்டத்தின் அவலோகன்"
    },
  },
  kn: {
    translation: {
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      totalFlags: "ಒಟ್ಟು ಫ್ಲ್ಯಾಗ್‌ಗಳು",
      activeFlags: "ಸಕ್ರಿಯ ಫ್ಲ್ಯಾಗ್‌ಗಳು",
      environments: "ಪರಿಸರಗಳು",
      auditLogs: "ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
      dashboardOverview: "ನಿಮ್ಮ ಪ್ಲಾಟ್ಫಾರ್ಮ್ ಅವಲೋಕನ"
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;