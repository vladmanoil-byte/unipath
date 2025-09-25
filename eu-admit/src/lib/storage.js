// storage.js
// Provides helpers to persist and retrieve profile, applications, and wizard draft data from localStorage.
const PROFILE_KEY = 'euAdmit.profile';
const APPLICATIONS_KEY = 'euAdmit.applications';
const WIZARD_DRAFT_KEY = 'euAdmit.wizardDraft';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Failed to parse stored data', error);
    return null;
  }
};

export const loadProfile = () => {
  if (!isBrowser()) return null;
  return safeParse(window.localStorage.getItem(PROFILE_KEY));
};

export const saveProfile = (profile) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const loadApplications = () => {
  if (!isBrowser()) return null;
  return safeParse(window.localStorage.getItem(APPLICATIONS_KEY));
};

export const saveApplications = (applications) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
};

export const loadWizardDraft = () => {
  if (!isBrowser()) return null;
  return safeParse(window.localStorage.getItem(WIZARD_DRAFT_KEY));
};

export const saveWizardDraft = (draft) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(draft));
};

export const clearWizardDraft = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(WIZARD_DRAFT_KEY);
};
