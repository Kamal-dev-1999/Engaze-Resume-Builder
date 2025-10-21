/**
 * INDUSTRY-STANDARD RESUME TEMPLATE STYLING CONSTANTS
 * 
 * These constants enforce professional typography and spacing standards
 * based on ATS (Applicant Tracking System) best practices and modern design:
 * 
 * Spacing Reference:
 * - Section gap: 16px (gap-4) - breathing room between major sections
 * - Item gap: 12px (gap-3) - space between list items within a section
 * - Subsection gap: 8px (gap-2) - space within an item (title, company, etc)
 * - Inner padding: 4px-8px (px-1 to px-2) - internal element spacing
 * 
 * Typography Reference:
 * - Header name: 24-32px, bold, 600+ weight
 * - Section titles: 12-14px, bold/semibold, uppercase, 600+ weight
 * - Job titles: 12px, semibold, 600 weight
 * - Company names: 11-12px, semibold, 500-600 weight
 * - Body text: 11-12px, regular, 400 weight
 * - Line height: 1.4-1.6 for body, 1.2 for titles
 * 
 * ATS Compliance:
 * - Single column layout (avoid multi-column)
 * - Standard fonts (Georgia, Arial, Helvetica, Calibri)
 * - Consistent line height for screen readers
 * - Proper heading hierarchy
 * - No complex tables or graphics
 */

export const TEMPLATE_SPACING = {
  // Container padding
  containerPaddingMobile: 'p-4',
  containerPaddingTablet: 'md:p-6',
  containerPaddingDesktop: 'lg:p-8',
  
  // Section spacing
  sectionGap: 'gap-4', // 16px between major sections
  sectionMarginBottom: 'mb-4', // 16px bottom margin for sections
  sectionMarginBottomSmall: 'mb-3', // 12px for compact layouts
  
  // Item spacing within sections
  itemGap: 'gap-3', // 12px between items
  itemMarginBottom: 'mb-3',
  itemMarginBottomSmall: 'mb-2',
  
  // Subsection spacing (title, company, etc within an item)
  subitemGap: 'gap-2', // 8px between sub-elements
  subitemMarginBottom: 'mb-1',
  
  // Header/Title spacing
  headerMarginBottom: 'mb-3',
  headerMarginBottomSmall: 'mb-2',
  headerPaddingBottom: 'pb-2',
  
  // Internal padding
  paddingSmall: 'px-1',
  paddingMedium: 'px-2 py-1',
  paddingLarge: 'px-3 py-2',
  
  // Border spacing
  borderPaddingSmall: 'pl-3',
  borderPaddingMedium: 'pl-4',
};

export const TEMPLATE_TYPOGRAPHY = {
  // Name/Title (at top of resume)
  nameLarge: 'text-3xl md:text-3xl font-bold',
  nameMedium: 'text-2xl md:text-2xl font-bold',
  nameSmall: 'text-xl font-bold',
  
  // Professional title under name
  professionalTitle: 'text-sm md:text-base text-gray-600',
  
  // Section headers
  sectionHeaderLarge: 'text-sm font-bold uppercase tracking-wider',
  sectionHeaderMedium: 'text-xs font-bold uppercase tracking-wider',
  sectionHeaderSmall: 'text-xs font-semibold uppercase tracking-wide',
  
  // Position titles / Job titles
  jobTitleLarge: 'text-sm font-bold',
  jobTitleMedium: 'text-[13px] font-semibold',
  jobTitleSmall: 'text-[12px] font-semibold',
  
  // Company/Organization names
  companyNameLarge: 'text-[13px] font-semibold',
  companyNameMedium: 'text-[12px] font-semibold text-gray-700',
  companyNameSmall: 'text-xs font-semibold',
  
  // Degree/Education
  degreeLarge: 'text-sm font-bold',
  degreeMedium: 'text-[12px] font-semibold',
  degreeSmall: 'text-xs font-semibold',
  
  // Body text / descriptions
  bodyLarge: 'text-[13px] leading-relaxed',
  bodyMedium: 'text-[12px] leading-relaxed',
  bodySmall: 'text-xs leading-relaxed',
  
  // Meta text (dates, locations)
  metaLarge: 'text-xs text-gray-600',
  metaMedium: 'text-[11px] text-gray-700',
  metaSmall: 'text-xs text-gray-600 italic',
  
  // Skills/Tags
  skillsText: 'text-[12px] text-gray-800',
  
  // Line heights for better readability
  lineHeightTight: 'leading-tight', // 1.25
  lineHeightSnug: 'leading-snug', // 1.375
  lineHeightNormal: 'leading-normal', // 1.5
  lineHeightRelaxed: 'leading-relaxed', // 1.625
};

export const TEMPLATE_COLORS = {
  // Text colors
  textDark: 'text-gray-900',
  textRegular: 'text-gray-800',
  textMuted: 'text-gray-600',
  textLight: 'text-gray-500',
  textLighter: 'text-gray-400',
  
  // Accent colors
  accentPrimary: 'text-blue-600',
  accentSecondary: 'text-indigo-600',
  
  // Background colors
  bgWhite: 'bg-white',
  bgLight: 'bg-gray-50',
  bgLighter: 'bg-gray-100',
  bgDark: 'bg-gray-900',
};

export const TEMPLATE_BORDERS = {
  // Border styles
  borderThin: 'border-gray-300',
  borderRegular: 'border-gray-400',
  borderBold: 'border-gray-800',
  
  // Border spacing
  borderTopThin: 'border-t border-gray-300',
  borderBottomThin: 'border-b border-gray-300',
  borderBottomRegular: 'border-b-2 border-gray-400',
  borderBottomBold: 'border-b-2 border-gray-800',
  borderLeftAccent: 'border-l-2 border-blue-500',
};

export const TEMPLATE_UTILITIES = {
  // Standard container
  resumeContainer: `w-full ${TEMPLATE_SPACING.containerPaddingMobile} ${TEMPLATE_SPACING.containerPaddingTablet} ${TEMPLATE_SPACING.containerPaddingDesktop}`,
  
  // Standard section wrapper
  sectionWrapper: `${TEMPLATE_SPACING.sectionMarginBottom}`,
  
  // Standard section header
  sectionHeader: `${TEMPLATE_TYPOGRAPHY.sectionHeaderMedium} ${TEMPLATE_SPACING.headerMarginBottom} ${TEMPLATE_SPACING.headerPaddingBottom}`,
  
  // Standard item container
  itemContainer: `${TEMPLATE_SPACING.itemMarginBottom}`,
  
  // Standard item row (for flex layouts)
  itemRow: `flex justify-between items-start gap-4`,
  
  // Standard list container
  listContainer: `${TEMPLATE_SPACING.itemGap} space-y-3`,
};

/**
 * Pre-built Tailwind class strings for common resume layouts
 * Use these to maintain consistency across all templates
 */
export const RESUME_LAYOUTS = {
  // Two-column layout for title + date
  titleDateRow: 'flex justify-between items-baseline gap-4 mb-1',
  
  // Compact title + company info
  titleCompanyInfo: 'space-y-0.5',
  
  // Item section with proper spacing
  itemSection: 'space-y-2',
  
  // Multi-item list spacing
  multiItemList: 'space-y-3',
  
  // Contact info row with separators
  contactRow: 'flex flex-wrap gap-2 text-xs',
};

/**
 * Function to merge Tailwind classes while handling conditional spacing
 */
export function mergeSpacingClasses(baseClass: string, conditionalSpacing?: { tight?: boolean; loose?: boolean }): string {
  let classes = baseClass;
  
  if (conditionalSpacing?.tight) {
    classes = classes.replace(/gap-\d|space-y-\d|mb-\d/g, (match) => {
      if (match.startsWith('gap-')) return 'gap-2';
      if (match.startsWith('space-y-')) return 'space-y-2';
      if (match.startsWith('mb-')) return 'mb-2';
      return match;
    });
  }
  
  if (conditionalSpacing?.loose) {
    classes = classes.replace(/gap-\d|space-y-\d|mb-\d/g, (match) => {
      if (match.startsWith('gap-')) return 'gap-4';
      if (match.startsWith('space-y-')) return 'space-y-4';
      if (match.startsWith('mb-')) return 'mb-4';
      return match;
    });
  }
  
  return classes;
}

/**
 * Generate responsive font size string based on design size
 * @param designSize - The design size (e.g., 'large', 'medium', 'small')
 */
export function getResponsiveFontSize(designSize: 'header' | 'title' | 'body' | 'meta'): string {
  const sizes = {
    header: 'text-xl md:text-2xl lg:text-3xl',
    title: 'text-sm md:text-[13px] lg:text-sm',
    body: 'text-[12px] md:text-[13px]',
    meta: 'text-xs md:text-xs',
  };
  return sizes[designSize];
}
