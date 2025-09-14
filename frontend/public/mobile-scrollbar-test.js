/**
 * Mobile Scrollbar Fix Verification Script
 * Run this in browser console to validate the mobile dashboard scrollbar fix
 */

function verifyMobileScrollbarFix() {
  console.log('🔍 Verifying Mobile Scrollbar Fix...\n');
  
  // Check if mobile CSS is loaded
  const mobileCSS = Array.from(document.styleSheets).some(sheet => {
    try {
      return Array.from(sheet.rules || sheet.cssRules || []).some(rule => 
        rule.selectorText && rule.selectorText.includes('dashboard-mobile-container')
      );
    } catch (e) {
      return false;
    }
  });
  
  console.log(`✅ Mobile CSS loaded: ${mobileCSS}`);
  
  // Check for mobile container class
  const mobileContainer = document.querySelector('.dashboard-mobile-container');
  console.log(`✅ Mobile container found: ${!!mobileContainer}`);
  
  // Check for viewport height CSS variable
  const vhVariable = getComputedStyle(document.documentElement).getPropertyValue('--vh');
  console.log(`✅ Viewport height variable set: ${!!vhVariable} (${vhVariable})`);
  
  // Check for conflicting overflow containers
  const conflictingContainers = document.querySelectorAll('div[class*="overflow-auto"], div[class*="h-screen"][class*="overflow"]');
  console.log(`⚠️  Potential conflicting containers: ${conflictingContainers.length}`);
  
  if (conflictingContainers.length > 1) {
    console.log('🚨 Multiple scrollable containers detected - may cause dual scrollbars');
    conflictingContainers.forEach((el, i) => {
      console.log(`   ${i + 1}. ${el.className}`);
    });
  }
  
  // Check mobile media query support
  const isMobile = window.matchMedia('(max-width: 640px)').matches;
  console.log(`📱 Mobile breakpoint active: ${isMobile}`);
  
  // Test smooth scrolling
  const smoothScrollElements = document.querySelectorAll('.mobile-smooth-scroll, .dashboard-mobile-container');
  console.log(`✅ Smooth scroll elements: ${smoothScrollElements.length}`);
  
  // Check for sidebar body lock class
  console.log(`🔒 Sidebar body lock available: ${document.body.classList.contains('dashboard-body')}`);
  
  console.log('\n🎯 Summary:');
  if (mobileCSS && mobileContainer && vhVariable) {
    console.log('✅ Mobile scrollbar fix appears to be working correctly!');
  } else {
    console.log('❌ Mobile scrollbar fix may not be fully active');
  }
  
  // Performance check
  const perfEntries = performance.getEntriesByType('navigation');
  if (perfEntries.length > 0) {
    console.log(`⚡ Page load time: ${Math.round(perfEntries[0].loadEventEnd - perfEntries[0].navigationStart)}ms`);
  }
}

// Auto-run on mobile devices
if (window.matchMedia('(max-width: 640px)').matches) {
  console.log('📱 Mobile device detected - running verification...');
  setTimeout(verifyMobileScrollbarFix, 1000);
} else {
  console.log('💻 Desktop detected - run verifyMobileScrollbarFix() manually to test');
}

// Export for manual use
window.verifyMobileScrollbarFix = verifyMobileScrollbarFix;