/**
 * Cover Flow Carousel
 * Inspired by Collins website case studies carousel
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const carousel = document.getElementById('caseStudiesCarousel');
        
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-item');
        let isScrolling = false;
        let scrollTimeout;

        // Smooth scroll to item on click
        items.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Calculate scroll position to center the clicked item
                const itemWidth = item.offsetWidth;
                const gap = 16; // gap between items
                const scrollPosition = (itemWidth + gap) * index;
                
                carousel.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
        });

        // Add keyboard navigation
        carousel.addEventListener('keydown', function(e) {
            const scrollAmount = 416; // item width + gap
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                carousel.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        });

        // Optional: Add scroll indicators or active state
        carousel.addEventListener('scroll', function() {
            isScrolling = true;
            
            // Clear timeout if it exists
            clearTimeout(scrollTimeout);
            
            // Set a timeout to run after scrolling ends
            scrollTimeout = setTimeout(function() {
                isScrolling = false;
                updateActiveItem();
            }, 150);
        });

        function updateActiveItem() {
            const scrollLeft = carousel.scrollLeft;
            const carouselCenter = scrollLeft + (carousel.offsetWidth / 2);
            
            items.forEach(item => {
                const itemLeft = item.offsetLeft;
                const itemCenter = itemLeft + (item.offsetWidth / 2);
                const distance = Math.abs(carouselCenter - itemCenter);
                
                // Add active class to centered item
                if (distance < item.offsetWidth / 2) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        // Initialize active state
        updateActiveItem();

        // Optional: Mouse drag to scroll
        let isDragging = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', function(e) {
            isDragging = true;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', function() {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseup', function() {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Set initial cursor
        carousel.style.cursor = 'grab';
    });
})();

