// GitHub Pages compatible navigation
function setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Update active link
    document.querySelectorAll('nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.style.color = '#ffcc66';
            link.style.fontWeight = 'bold';
        }
    });
}

// Page load时 navigation setup করুন
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
});