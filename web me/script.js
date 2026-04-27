// Mobile navigation toggle + smooth active update
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const navLinkItems = document.querySelectorAll('.nav-links li a');
        const sections = document.querySelectorAll('section');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        function closeMenu() {
            if (navLinks.classList.contains('active')) navLinks.classList.remove('active');
        }

        navLinkItems.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    closeMenu();
                    updateActiveLink(targetId);
                } else {
                    if (this.getAttribute('href') === '#') e.preventDefault();
                    closeMenu();
                }
            });
        });

        function updateActiveLink(currentId) {
            navLinkItems.forEach(link => {
                const href = link.getAttribute('href').substring(1);
                if (href === currentId) link.classList.add('active');
                else link.classList.remove('active');
            });
        }

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (pageYOffset >= sectionTop) current = section.getAttribute('id');
            });
            if (current) updateActiveLink(current);
        });

        // scroll reveal
        const fadeElements = document.querySelectorAll('.fade-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
        fadeElements.forEach(el => observer.observe(el));
        document.querySelectorAll('.fade-up').forEach(el => el.classList.add('fade-up'));

        // resume button
        document.getElementById('resumeCta').addEventListener('click', () => {
            alert("📄 Yhang's resume – full-stack passion, 2+ years exp, ready for new challenges. Contact me directly!");
        });
        document.getElementById('demoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('💌 Thanks! I’ll reach out within 24h.');
            e.target.reset();
        });