/**
 * Extracts the active page from the current path
 * 
 * @param pathname - The current URL path
 * @returns The active page (sales, payroll, expenses) or undefined if not found
 */
export const getActivePath = (pathname: string): Pages | undefined => {
  const pages: Pages[] = ["sales", "payroll", "expenses"];
  
  // Check if any of the page names appear in the pathname
  for (const page of pages) {
    if (pathname.includes(page)) {
      return page;
    }
  }
  
  // Return undefined if no page is found in the pathname
  return undefined;
};


/**
 * Type representing the available pages in the application
 */
export type Pages = "sales" | "payroll" | "expenses";

/**
 * Function to generate page links based on current path and target page
 * 
 * @param currentPath - The current URL path
 * @param targetPage - The target page to navigate to (sales, payroll, or expenses)
 * @returns The URL the link should lead to
 */

export const getPagesLink = (currentPath: string, targetPage: Pages): string => {
  // If we're at the selection root, always return /selection
  if (currentPath === "/selection") {
    return "/selection";
  }
  // If we're at /selection/ followed by any page
  if (currentPath.startsWith("/selection/") && currentPath.split('/').length === 3) {
    return `/selection/${targetPage}`;
  }
  // If we're at /selection/[page]/year/month
  if (/^\/selection\/\w+\/\d{4}\/\d{1,2}$/.test(currentPath)) {
    const pathParts = currentPath.split('/');
    const year = pathParts[3];
    const month = pathParts[4];
    return `/selection/${targetPage}/${year}/${month}`;
  }
  
  // Default fallback
  return "/selection";
};


/**
 * Interface representing the navigation configuration
 */
interface BackConfig {
    backURL: string;
}
/**
 * Determines the navigation configuration based on the current path
 * 
 * @param path - The current URL path
 * @returns NavConfig object with the appropriate back URL
 */

export const getBackConfig = (path: string): BackConfig => {
    // Determine the back URL based on path pattern
    let backURL: string | undefined;
    
    // Extract path parts
    const pathParts = path.split('/').filter(part => part);
    
    // Check if path matches the year/month pattern (e.g., .../something/2023/01)
    if (/\/\d{4}\/\d{1,2}$/.test(path)) {
        // For year/month pattern, return everything before year
        const yearIndex = path.lastIndexOf('/', path.lastIndexOf('/') - 1);
        backURL = path.substring(0, yearIndex);
    } else if (pathParts.length > 0) {
        // For other paths, pop off the last segment
        backURL = '/' + pathParts.slice(0, -1).join('/');
        // If we're at the root level, don't return an empty path
        if (backURL === '/') {
            backURL = undefined;
        }
    }
    
    return { backURL: backURL || '/selection' };
}; 