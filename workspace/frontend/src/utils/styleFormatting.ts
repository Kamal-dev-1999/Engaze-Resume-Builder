/**
 * Utility function to convert formatting object to inline CSS styles
 * Used by all resume templates to apply user-defined styling
 */

interface SectionFormatting {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  textColor?: string;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
}

export const getFormattingStyles = (formatting?: SectionFormatting): React.CSSProperties => {
  if (!formatting) {
    return {};
  }

  const styles: React.CSSProperties = {};

  if (formatting.fontFamily) {
    styles.fontFamily = formatting.fontFamily;
  }
  if (formatting.fontSize) {
    styles.fontSize = `${formatting.fontSize}px`;
  }
  if (formatting.fontWeight) {
    styles.fontWeight = formatting.fontWeight as any;
  }
  if (formatting.textAlign) {
    styles.textAlign = formatting.textAlign as any;
  }
  if (formatting.textColor) {
    styles.color = formatting.textColor;
  }
  if (formatting.backgroundColor && formatting.backgroundColor !== 'transparent') {
    styles.backgroundColor = formatting.backgroundColor;
  }
  if (formatting.padding !== undefined && formatting.padding > 0) {
    styles.padding = `${formatting.padding}px`;
  }
  if (formatting.margin !== undefined && formatting.margin > 0) {
    styles.margin = `${formatting.margin}px`;
  }
  if (formatting.borderWidth !== undefined && formatting.borderWidth > 0) {
    styles.border = `${formatting.borderWidth}px solid ${formatting.borderColor || '#d1d5db'}`;
    if (formatting.borderRadius !== undefined) {
      styles.borderRadius = `${formatting.borderRadius}px`;
    }
  }

  return styles;
};

/**
 * Get container styles (for the whole section)
 */
export const getSectionContainerStyles = (formatting?: SectionFormatting): React.CSSProperties => {
  if (!formatting) {
    return {};
  }

  const styles: React.CSSProperties = {};

  if (formatting.margin !== undefined && formatting.margin > 0) {
    styles.margin = `${formatting.margin}px`;
  }
  if (formatting.backgroundColor && formatting.backgroundColor !== 'transparent') {
    styles.backgroundColor = formatting.backgroundColor;
  }
  if (formatting.padding !== undefined && formatting.padding > 0) {
    styles.padding = `${formatting.padding}px`;
  }
  if (formatting.borderWidth !== undefined && formatting.borderWidth > 0) {
    styles.border = `${formatting.borderWidth}px solid ${formatting.borderColor || '#d1d5db'}`;
    if (formatting.borderRadius !== undefined) {
      styles.borderRadius = `${formatting.borderRadius}px`;
    }
  }

  return styles;
};

/**
 * Get text styles (for inline text content)
 */
export const getTextStyles = (formatting?: SectionFormatting): React.CSSProperties => {
  if (!formatting) {
    return {};
  }

  const styles: React.CSSProperties = {};

  if (formatting.fontFamily) {
    styles.fontFamily = formatting.fontFamily;
  }
  if (formatting.fontSize) {
    styles.fontSize = `${formatting.fontSize}px`;
  }
  if (formatting.fontWeight) {
    styles.fontWeight = formatting.fontWeight as any;
  }
  if (formatting.textAlign) {
    styles.textAlign = formatting.textAlign as any;
  }
  if (formatting.textColor) {
    styles.color = formatting.textColor;
  }

  return styles;
};
