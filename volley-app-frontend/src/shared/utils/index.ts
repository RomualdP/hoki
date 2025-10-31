export const formatDate = (date: Date | string, locale = 'fr-FR'): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObject.getTime())) {
    return 'Date invalide';
  }

  return dateObject.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string, locale = 'fr-FR'): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObject.getTime())) {
    return 'Date invalide';
  }

  return dateObject.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date: Date | string, locale = 'fr-FR'): string => {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObject.getTime())) {
    return 'Heure invalide';
  }

  return dateObject.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength).trim()}...`;
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) {
    return '';
  }
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatScore = (homeScore?: number, awayScore?: number): string => {
  if (homeScore === undefined || awayScore === undefined) {
    return '-';
  }
  
  return `${homeScore} - ${awayScore}`;
};

export const getMatchStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    SCHEDULED: 'Programmé',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé',
  };
  
  return statusMap[status] || status;
};

export const getTournamentStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    REGISTRATION: 'Inscriptions ouvertes',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé',
  };
  
  return statusMap[status] || status;
};

export const getTeamRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    CAPTAIN: 'Capitaine',
    COACH: 'Entraîneur',
    PLAYER: 'Joueur',
    SUBSTITUTE: 'Remplaçant',
  };
  
  return roleMap[role] || role;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 