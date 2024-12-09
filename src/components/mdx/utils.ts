import React, { ReactElement } from "react";

const extractTextFromReactElement = (element: ReactElement): string => {
  const children = element.props.children;
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(child =>
      typeof child === 'string' ? child :
        React.isValidElement(child) ? extractTextFromReactElement(child) : ''
    ).join('');
  }
  if (React.isValidElement(children)) {
    return extractTextFromReactElement(children);
  }
  return '';
};

export const generateId = (text: string | React.ReactNode): string => {
  let textContent = '';
  if (typeof text === 'string') {
    textContent = text;
  } else if (React.isValidElement<{ children?: React.ReactNode }>(text)) {
    textContent = extractTextFromReactElement(text);
  } else if (Array.isArray(text)) {
    textContent = text.map(child =>
      typeof child === 'string' ? child :
        React.isValidElement(child) ? extractTextFromReactElement(child) : ''
    ).join('');
  }

  return textContent
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
