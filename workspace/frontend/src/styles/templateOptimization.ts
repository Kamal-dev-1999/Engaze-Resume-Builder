/**
 * Template Styling Optimization
 * Ensures all templates fit content efficiently on A4 pages
 * Automatically expands to multiple pages if content exceeds first page
 */

export const RESPONSIVE_STYLES = `
  /* Global responsive optimization */
  @media screen and (min-width: 1024px) {
    html, body, #root {
      margin: 0;
      padding: 0;
    }
  }

  /* Ensure proper A4 page sizing */
  div[data-resume-page] {
    width: 794px;  /* A4 width at 96 DPI */
    min-height: 1123px; /* A4 height at 96 DPI */
    margin: 0 auto;
    page-break-after: always;
  }

  /* Flexible spacing that collapses on small screens */
  @media (max-width: 1024px) {
    div[data-template-container] {
      padding: 12px !important;
      font-size: 12px !important;
    }

    h1 { font-size: 28px !important; margin: 8px 0 !important; }
    h2 { font-size: 13px !important; margin: 6px 0 4px 0 !important; }
    h3 { font-size: 12px !important; margin: 4px 0 2px 0 !important; }
    p { margin: 2px 0 !important; }
    
    section { margin-bottom: 8px !important; }
    div[role="section"] { margin-bottom: 8px !important; }
  }

  /* Print optimization */
  @media print {
    * {
      margin: 0;
      padding: 0;
      orphans: 2;
      widows: 2;
    }

    body, html {
      width: 100%;
      height: 100%;
    }

    @page {
      size: A4;
      margin: 20mm;
    }

    /* Prevent content from breaking awkwardly */
    section, article, div[role="section"], 
    .space-y-3, .space-y-4, .space-y-6 {
      page-break-inside: avoid;
    }

    /* Allow only reasonable breaks */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }

    /* Hide interactive elements */
    button, input, [role="button"] {
      display: none !important;
    }
  }
`;

/**
 * Compact spacing classes for better fit
 */
export const COMPACT_SPACING = {
  marginBottomCompact: 'mb-1 md:mb-2',
  marginBottomSection: 'mb-2 md:mb-3',
  marginBottomLarge: 'mb-3 md:mb-4',
  paddingCompact: 'p-2 md:p-3',
  paddingNormal: 'p-3 md:p-4',
  paddingLarge: 'p-4 md:p-6',
  spaceYCompact: 'space-y-1 md:space-y-2',
  spaceYSmall: 'space-y-2 md:space-y-3',
  spaceYNormal: 'space-y-3 md:space-y-4',
};

/**
 * Optimized font sizes for better content fit
 */
export const OPTIMIZED_FONTS = {
  headingXL: 'text-2xl md:text-3xl',
  headingLg: 'text-lg md:text-xl',
  headingMd: 'text-base md:text-lg',
  bodySm: 'text-xs md:text-sm',
  bodyMd: 'text-sm md:text-base',
};

/**
 * Page break optimization mixin
 */
export const PAGE_BREAK_SAFE = `
  page-break-inside: avoid;
  page-break-after: auto;
`;

/**
 * Get responsive margin classes
 */
export const getResponsiveMargin = (size: 'sm' | 'md' | 'lg'): string => {
  const margins = {
    sm: 'mb-1 md:mb-1.5',
    md: 'mb-1.5 md:mb-2',
    lg: 'mb-2 md:mb-3',
  };
  return margins[size];
};

/**
 * Get responsive padding classes
 */
export const getResponsivePadding = (size: 'sm' | 'md' | 'lg'): string => {
  const paddings = {
    sm: 'p-2 md:p-2.5',
    md: 'p-3 md:p-3.5',
    lg: 'p-4 md:p-5',
  };
  return paddings[size];
};

/**
 * Get responsive text size
 */
export const getResponsiveText = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl'): string => {
  const sizes = {
    xs: 'text-xs md:text-[11px]',
    sm: 'text-[11px] md:text-xs',
    base: 'text-xs md:text-sm',
    lg: 'text-sm md:text-base',
    xl: 'text-base md:text-lg',
  };
  return sizes[size];
};

/**
 * Optimize section spacing for first page fit
 */
export const optimizeSectionSpacing = (): string => {
  return `
    section {
      margin-bottom: 0.75rem;
      page-break-inside: avoid;
    }

    div[data-section] {
      margin-bottom: 0.75rem;
    }

    /* Tight spacing for headers */
    h1 {
      margin: 0.5rem 0 0.25rem 0;
      line-height: 1.1;
    }

    h2 {
      margin: 0.5rem 0 0.25rem 0;
      line-height: 1.2;
    }

    h3 {
      margin: 0.25rem 0 0.15rem 0;
      line-height: 1.2;
    }

    /* Reduce item spacing */
    div[role="list"] {
      gap: 0.25rem !important;
    }

    .space-y-2 > * + * {
      margin-top: 0.4rem !important;
    }

    .space-y-3 > * + * {
      margin-top: 0.5rem !important;
    }

    .space-y-4 > * + * {
      margin-top: 0.75rem !important;
    }

    /* Compress sidebar if present */
    [class*="sidebar"], [class*="w-1/3"] {
      padding: 0.75rem !important;
    }

    /* Reduce gap in flex containers */
    .gap-4 {
      gap: 0.75rem !important;
    }

    .gap-6 {
      gap: 1rem !important;
    }

    /* Optimize padding */
    .p-8 {
      padding: 1.5rem !important;
    }

    .p-6 {
      padding: 1rem !important;
    }

    /* Line height optimization */
    body {
      line-height: 1.4;
    }

    p {
      line-height: 1.3;
      margin-bottom: 0.25rem;
    }
  `;
};
