/**
 * Application routes configuration
 * Centralizes all route definitions for better maintainability
 */

export const ROUTES = {
  HOME: "/",
  NEWS: {
    INDEX: "/news",
    DETAIL: (id: string) => `/news/${id}`,
    CATEGORY: (category: string) => `/news/category/${category}`,
  },
  AWARENESS: {
    INDEX: "/awareness",
    DETAIL: (id: string) => `/awareness/${id}`,
  },
  STANDARDS: {
    INDEX: "/standards",
    CATEGORY: (category: string) => `/standards/${category}`,
    STANDARD: (category: string, standard: string) => `/standards/${category}/${standard}`,
    CONTROL: (category: string, standard: string, control: string) => `/standards/${category}/${standard}/${control}`,
    SAFEGUARD: (category: string, standard: string, control: string, safeguard: string) =>
      `/standards/${category}/${standard}/${control}/${safeguard}`,
    TECHNIQUE: (category: string, standard: string, control: string, safeguard: string, technique: string) =>
      `/standards/${category}/${standard}/${control}/${safeguard}/${technique}`,
    IMPLEMENTATION: (
      category: string,
      standard: string,
      control: string,
      safeguard: string,
      technique: string,
      implementation: string,
    ) => `/standards/${category}/${standard}/${control}/${safeguard}/${technique}/${implementation}`,
  },
  INSTRUCTIONS: {
    INDEX: "/instructions",
    DETAIL: (type: string, year: string) => `/instructions/${type}/${year}`,
  },
  MEDIA: {
    INDEX: "/media",
    LECTURE: (id: string) => `/media/lecture/${id}`,
    PRESENTATION: (id: string) => `/media/presentation/${id}`,
  },
  FRAMEWORK: {
    INDEX: "/framework",
    DOMAIN: (domain: string) => `/framework/${domain}`,
  },
  DEFINITIONS: {
    INDEX: "/definitions",
    DETAIL: (id: string) => `/definitions/${id}`,
    CATEGORY: (category: string) => `/definitions/category/${category}`,
  },
  // Section anchors for in-page navigation
  SECTIONS: {
    SYSTEMS: "/#systems",
    REGULATION: "/#regulation",
    AWARENESS: "/#awareness",
    INSTRUCTIONS: "/#instructions",
    STANDARDS: "/#standards",
    MEDIA: "/#media",
  },
}
