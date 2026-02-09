document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! We will contact you soon.');
    this.reset();
});

document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.closest('.product-card').querySelector('h3').textContent;
        alert('Purchase ' + name + '\n\nJoin Discord: discord.gg/kingfancy');
    });
});