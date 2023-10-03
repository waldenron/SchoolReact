// src/analytics.js
import ReactGA from 'react-ga';

export const initGA = () => {  
  ReactGA.initialize('YOUR_GOOGLE_ANALYTICS_ID');
}

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
}
