/**
 * Utility to reset and reinitialize mock data
 * Use this when you want to clear localStorage and start fresh
 */

export const resetMockData = () => {
  // Clear all localStorage
  localStorage.removeItem('products');
  localStorage.removeItem('users');
  localStorage.removeItem('orders');
  localStorage.removeItem('reviews');
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
  localStorage.removeItem('events');
  localStorage.removeItem('filter_configuration');
  
  console.log('✅ All mock data cleared!');
  console.log('🔄 Reload the page to regenerate fresh mock data');
  
  // Reload the page to trigger data regeneration
  window.location.reload();
};

// Make it available in console for easy access
if (typeof window !== 'undefined') {
  (window as any).resetMockData = resetMockData;
}

export default resetMockData;
