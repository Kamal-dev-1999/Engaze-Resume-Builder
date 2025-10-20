/**
 * Debug Logger Utility
 * Logs template data, identifies hardcoded content, and helps troubleshoot data display issues
 */

interface SectionDebugInfo {
  type: string;
  id: number;
  order: number;
  hasContent: boolean;
  contentKeys: string[];
  contentPreview: any;
  issues: string[];
}

interface TemplateDebugInfo {
  templateName: string;
  totalSections: number;
  sortedSections: SectionDebugInfo[];
  missingData: string[];
  hardcodedStrings: string[];
  timestamp: string;
}

/**
 * Analyzes section data for issues and logs them
 */
export const analyzeSection = (section: any, _index: number): SectionDebugInfo => {
  const issues: string[] = [];
  const contentKeys = section.content ? Object.keys(section.content) : [];
  
  // Check for missing or empty content
  if (!section.content) {
    issues.push('Missing content object');
  } else if (Object.keys(section.content).length === 0) {
    issues.push('Empty content object');
  }
  
  // Check for required fields based on section type
  switch (section.type) {
    case 'summary':
      if (!section.content?.text) issues.push('Missing summary text');
      break;
    case 'experience':
      if (!section.content?.items || section.content.items.length === 0) {
        issues.push('Missing or empty experience items');
      } else {
        section.content.items.forEach((exp: any, idx: number) => {
          if (!exp.title) issues.push(`Experience ${idx}: Missing title`);
          if (!exp.company) issues.push(`Experience ${idx}: Missing company`);
        });
      }
      break;
    case 'education':
      if (!section.content?.items || section.content.items.length === 0) {
        issues.push('Missing or empty education items');
      } else {
        section.content.items.forEach((edu: any, idx: number) => {
          if (!edu.degree) issues.push(`Education ${idx}: Missing degree`);
          if (!edu.institution) issues.push(`Education ${idx}: Missing institution`);
        });
      }
      break;
    case 'skills':
      if (!section.content?.items || section.content.items.length === 0) {
        issues.push('Missing or empty skills items');
      }
      break;
    case 'projects':
      if (!section.content?.items || section.content.items.length === 0) {
        if (!section.content?.name && !section.content?.title) {
          issues.push('Missing project name/title');
        }
      } else {
        section.content.items.forEach((proj: any, idx: number) => {
          if (!proj.name && !proj.title) issues.push(`Project ${idx}: Missing name/title`);
        });
      }
      break;
    case 'custom':
      if (!section.content?.title && !section.content?.content && !section.content?.text) {
        issues.push('Missing custom section content');
      }
      break;
    case 'contact':
      if (!section.content?.name && !section.content?.email) {
        issues.push('Missing contact information');
      }
      break;
  }

  return {
    type: section.type,
    id: section.id,
    order: section.order,
    hasContent: !!section.content && Object.keys(section.content).length > 0,
    contentKeys,
    contentPreview: section.content,
    issues,
  };
};

/**
 * Main logging function for templates
 */
export const logTemplateData = (
  templateName: string,
  sections: any[],
  sortedSections: any[]
): TemplateDebugInfo => {
  const debugInfo: TemplateDebugInfo = {
    templateName,
    totalSections: sections.length,
    sortedSections: sortedSections.map((s, idx) => analyzeSection(s, idx)),
    missingData: [],
    hardcodedStrings: [],
    timestamp: new Date().toISOString(),
  };

  // Identify sections with missing data
  debugInfo.sortedSections.forEach((sectionInfo) => {
    if (sectionInfo.issues.length > 0) {
      debugInfo.missingData.push(...sectionInfo.issues);
    }
  });

  // Log to console with styling
  console.group(
    `%c📋 ${templateName} Debug Info`,
    'color: #0066cc; font-size: 14px; font-weight: bold;'
  );
  
  console.log('%cTotal Sections:', 'font-weight: bold; color: #0066cc;', debugInfo.totalSections);
  
  console.group('%cSorted Sections:', 'font-weight: bold; color: #0066cc;');
  debugInfo.sortedSections.forEach((section) => {
    const statusColor = section.issues.length > 0 ? '#cc0000' : '#00cc00';
    const statusIcon = section.issues.length > 0 ? '❌' : '✅';
    
    console.group(
      `%c${statusIcon} ${section.type.toUpperCase()} (ID: ${section.id}, Order: ${section.order})`,
      `color: ${statusColor}; font-weight: bold;`
    );
    
    console.log('%cContent Keys:', 'font-weight: bold;', section.contentKeys);
    console.log('%cContent Preview:', 'font-weight: bold;', section.contentPreview);
    
    if (section.issues.length > 0) {
      console.error('%c⚠️  Issues Found:', 'color: #cc0000; font-weight: bold;');
      section.issues.forEach((issue) => {
        console.error(`  - ${issue}`);
      });
    }
    
    console.groupEnd();
  });
  console.groupEnd();

  if (debugInfo.missingData.length > 0) {
    console.group('%c⚠️  Missing Data Summary:', 'color: #ff6600; font-weight: bold;');
    debugInfo.missingData.forEach((issue) => {
      console.warn(`  • ${issue}`);
    });
    console.groupEnd();
  }

  console.log(
    '%cFull Debug Object:',
    'font-weight: bold; color: #0066cc;',
    debugInfo
  );
  
  console.groupEnd();

  return debugInfo;
};

/**
 * Check for hardcoded strings in rendered output
 * Helps identify sections that might be using placeholder text instead of actual data
 */
export const detectHardcodedContent = (
  sectionType: string,
  content: any
): string[] => {
  const hardcodedPatterns = [
    'Additional Information', // Generic placeholder
    'View Project', // Generic link text
    'Add your', // Incomplete placeholder
    'Enter your', // Incomplete placeholder
    '[', // Array bracket indicating unrendered data
    'Lorem ipsum', // Lorem placeholder
    'TBD', // To Be Determined
    'N/A', // Not Applicable generic
  ];

  const found: string[] = [];
  const contentStr = JSON.stringify(content).toLowerCase();

  hardcodedPatterns.forEach((pattern) => {
    if (contentStr.includes(pattern.toLowerCase())) {
      found.push(pattern);
    }
  });

  if (found.length > 0) {
    console.warn(
      `%c⚠️  Potential hardcoded content detected in ${sectionType}:`,
      'color: #ff6600; font-weight: bold;'
    );
    found.forEach((pattern) => {
      console.warn(`  - "${pattern}"`);
    });
  }

  return found;
};

/**
 * Compare rendered data with source data
 */
export const compareDataRendering = (
  sectionType: string,
  sourceData: any,
  renderedElements: string[]
): void => {
  console.group(
    `%cData Rendering Comparison - ${sectionType}`,
    'color: #6600cc; font-weight: bold;'
  );
  
  console.log('%cSource Data:', 'font-weight: bold;', sourceData);
  console.log('%cRendered Elements Count:', 'font-weight: bold;', renderedElements.length);
  
  if (sourceData && renderedElements.length === 0) {
    console.error(
      '%c❌ ERROR: Data exists but nothing was rendered!',
      'color: #cc0000; font-weight: bold;'
    );
  }
  
  console.groupEnd();
};

/**
 * Log data before and after sorting
 */
export const logSectionSorting = (
  originalSections: any[],
  sortedSections: any[]
): void => {
  console.group('%cSection Sorting', 'color: #009900; font-weight: bold;');
  
  console.log('%cOriginal Order:', 'font-weight: bold;');
  console.table(
    originalSections.map((s) => ({
      Type: s.type,
      ID: s.id,
      Order: s.order,
    }))
  );

  console.log('%cSorted Order:', 'font-weight: bold;');
  console.table(
    sortedSections.map((s) => ({
      Type: s.type,
      ID: s.id,
      Order: s.order,
    }))
  );

  // Check if sorting changed anything
  const isSorted = originalSections.every(
    (s, idx) => s.id === sortedSections[idx].id
  );
  
  if (!isSorted) {
    console.log('%c✅ Sections were reordered', 'color: #009900; font-weight: bold;');
  } else {
    console.log('%ℹ️  No reordering needed', 'color: #0066cc; font-weight: bold;');
  }
  
  console.groupEnd();
};

/**
 * Export debug data to a downloadable JSON file
 */
export const exportDebugData = (debugInfo: TemplateDebugInfo): void => {
  const dataStr = JSON.stringify(debugInfo, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `template-debug-${debugInfo.templateName}-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  console.log('%c💾 Debug data exported to JSON file', 'color: #009900; font-weight: bold;');
};
