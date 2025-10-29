/**
 * 🔮 Template Counter Utility
 * 
 * Utility functions to count templates by category for both
 * Global and Mexican templates
 * 
 * @author Blockchain & Web3 Developer Full Stack Senior
 * @version 1.0.0
 */

import { MarketTemplate } from '../components/MarketTemplates';
import { MarketTemplate as MexicoTemplate } from '../components/MarketTemplatesMexico';

/**
 * Count templates by category
 */
export function countTemplatesByCategory(templates: MarketTemplate[] | MexicoTemplate[]): Record<string, number> {
  const categoryCount: Record<string, number> = {};
  
  templates.forEach(template => {
    const category = template.category;
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  return categoryCount;
}

/**
 * Get total count of templates
 */
export function getTotalTemplateCount(templates: MarketTemplate[] | MexicoTemplate[]): number {
  return templates.length;
}

/**
 * Get category count with formatted display
 */
export function getCategoryCountDisplay(categoryCount: Record<string, number>): string {
  const total = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);
  return `${total} total`;
}

/**
 * Get detailed category breakdown
 */
export function getCategoryBreakdown(categoryCount: Record<string, number>): Array<{category: string, count: number}> {
  return Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
