/* eslint-disable react-refresh/only-export-components */
// AppContext.jsx
// Provides global state for profile, applications, compare selections, and exposes helpers to mutate local mock data.
import { createContext, useContext, useMemo, useState } from 'react';
import { applications as initialApplications, universities as universitySeed, userProfile as profileSeed } from '../mockData';
import {
  clearWizardDraft,
  loadApplications as loadApplicationsFromStorage,
  loadProfile as loadProfileFromStorage,
  saveApplications as persistApplications,
  saveProfile as persistProfile,
} from '../lib/storage.js';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => loadProfileFromStorage() ?? profileSeed);
  const [applications, setApplications] = useState(
    () => loadApplicationsFromStorage() ?? initialApplications,
  );
  const [compareIds, setCompareIds] = useState([]);

  const saveProfile = (nextProfile) => {
    setProfile((prev) => {
      const merged = { ...prev, ...nextProfile };
      persistProfile(merged);
      return merged;
    });
  };

  const completeOnboarding = (nextProfile) => {
    setProfile((prev) => {
      const merged = { ...prev, ...nextProfile, completedOnboarding: true };
      persistProfile(merged);
      clearWizardDraft();
      return merged;
    });
  };

  const toggleTask = (applicationId, taskId) => {
    setApplications((prev) => {
      const next = prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          tasks: app.tasks.map((task) =>
            task.id === taskId ? { ...task, done: !task.done } : task,
          ),
        };
      });
      persistApplications(next);
      return next;
    });
  };

  const addTask = (applicationId, task) => {
    setApplications((prev) => {
      const next = prev.map((app) => {
        if (app.id !== applicationId) return app;
        const id = `task-${Date.now()}-${Math.round(Math.random() * 1000)}`;
        return {
          ...app,
          tasks: [
            ...app.tasks,
            {
              id,
              label: task.label,
              done: false,
              dueDate: task.dueDate ?? null,
            },
          ],
        };
      });
      persistApplications(next);
      return next;
    });
  };

  const updateTask = (applicationId, taskId, updates) => {
    setApplications((prev) => {
      const next = prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          tasks: app.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  label: updates.label ?? task.label,
                  dueDate:
                    Object.prototype.hasOwnProperty.call(updates, 'dueDate')
                      ? updates.dueDate
                      : task.dueDate,
                }
              : task,
          ),
        };
      });
      persistApplications(next);
      return next;
    });
  };

  const removeTask = (applicationId, taskId) => {
    setApplications((prev) => {
      const next = prev.map((app) => {
        if (app.id !== applicationId) return app;
        return {
          ...app,
          tasks: app.tasks.filter((task) => task.id !== taskId),
        };
      });
      persistApplications(next);
      return next;
    });
  };

  const addApplicationDraft = (universityId) => {
    setApplications((prev) => {
      if (prev.some((app) => app.universityId === universityId)) {
        return prev;
      }
      const university = universitySeed.find((u) => u.id === universityId);
      const deadline = university?.deadlines?.[0]?.date ?? null;
      const scaffold = {
        id: `app-${universityId}`,
        universityId,
        status: 'in_progress',
        tasks: [
          { id: 'draft-personal-statement', label: 'Draft personal statement', done: false },
          { id: 'request-recommendation', label: 'Request recommendation letter', done: false },
          { id: 'prepare-financial-docs', label: 'Prepare financial documents', done: false },
        ],
        nextDeadlineDate: deadline,
      };
      const next = [...prev, scaffold];
      persistApplications(next);
      return next;
    });
  };

  const toggleCompare = (universityId, checked) => {
    setCompareIds((prev) => {
      if (checked) {
        if (prev.includes(universityId)) return prev;
        return [...prev, universityId];
      }
      return prev.filter((id) => id !== universityId);
    });
  };

  const clearCompare = () => setCompareIds([]);

  const value = useMemo(
    () => ({
      universities: universitySeed,
      profile,
      saveProfile,
      completeOnboarding,
      applications,
      toggleTask,
      addTask,
      updateTask,
      removeTask,
      addApplicationDraft,
      compareIds,
      toggleCompare,
      clearCompare,
    }),
    [applications, compareIds, profile],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
