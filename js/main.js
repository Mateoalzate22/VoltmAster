(function() {
    // Función principal de inicialización
    function initApp() {
        console.log("Volt mAster: Inicializando scripts...");

        // 1. Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                offset: 50,
                once: true,
                easing: 'ease-out-cubic'
            });
        }

        // 2. GSAP Animations
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            const headline = document.getElementById('hero-headline');
            if (headline) {
                gsap.to("#hero-headline", {
                    scrollTrigger: {
                        trigger: "body",
                        start: "top top",
                        end: "bottom top",
                        scrub: 1
                    },
                    y: 100,
                    opacity: 0.5
                });
            }
        }

        // 3. Mobile Menu Logic
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');

        if(mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.onclick = function() {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    if(mobileMenu.classList.contains('hidden')) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    } else {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    }
                }
            };

            mobileLinks.forEach(link => {
                link.onclick = function() {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                };
            });
        }

        // 4. Video Player Logic
        const video = document.getElementById('featured-video');
        const toggleBtn = document.getElementById('video-toggle');
        const iconMain = document.getElementById('video-icon-main');
        const muteBtn = document.getElementById('mute-toggle');
        const muteIcon = document.getElementById('mute-icon');
        const volumeSlider = document.getElementById('volume-slider');

        if(video) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.log("Autoplay prevented:", e));
                        if(iconMain) {
                            iconMain.classList.remove('fa-play');
                            iconMain.classList.add('fa-pause');
                        }
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(video);

            if(toggleBtn && iconMain) {
                toggleBtn.onclick = function() {
                    if (video.paused) {
                        video.play();
                        iconMain.classList.remove('fa-play');
                        iconMain.classList.add('fa-pause');
                    } else {
                        video.pause();
                        iconMain.classList.remove('fa-pause');
                        iconMain.classList.add('fa-play');
                    }
                };
            }

            if(muteBtn) {
                muteBtn.onclick = function() {
                    video.muted = !video.muted;
                    updateVolumeUI();
                };
            }

            if(volumeSlider) {
                volumeSlider.oninput = function(e) {
                    const val = parseFloat(e.target.value);
                    video.volume = val;
                    if(val > 0 && video.muted) {
                        video.muted = false;
                    }
                    updateVolumeUI();
                };
            }

            function updateVolumeUI() {
                if(muteIcon) {
                    if(video.muted || video.volume === 0) {
                        muteIcon.classList.remove('fa-volume-up');
                        muteIcon.classList.add('fa-volume-mute');
                    } else {
                        muteIcon.classList.remove('fa-volume-mute');
                        muteIcon.classList.add('fa-volume-up');
                    }
                }
            }
        }

        // 5. Product Slider Logic
        const productImages = document.querySelectorAll('.slider-image');
        const captionElement = document.getElementById('slider-caption');
        const captions = ["Iluminación LED Comercial", "Cableado Certificado RETIE", "Proyectores Solares / Exterior", "Protecciones y Tableros"];
        let currentSlide = 0;

        if (productImages.length > 0) {
            setInterval(() => {
                productImages[currentSlide].style.opacity = '0';
                currentSlide = (currentSlide + 1) % productImages.length;
                productImages[currentSlide].style.opacity = '1';
                if(captionElement) {
                    captionElement.textContent = captions[currentSlide];
                }
            }, 4000);
        }

        // 6. SERVICE MODAL LOGIC (DELEGACIÓN DE EVENTOS)
        // Esta técnica asegura que funcione incluso si los botones cargan tarde
        const modal = document.getElementById('service-modal');
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalContent = document.getElementById('modal-content');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalImg = document.getElementById('modal-img');
        const modalClose = document.getElementById('modal-close');

        // Función global para cerrar
        window.closeModal = function() {
            if (!modal) return;
            if(modalBackdrop) modalBackdrop.classList.add('opacity-0');
            if(modalContent) {
                modalContent.classList.remove('scale-100', 'opacity-100');
                modalContent.classList.add('scale-95', 'opacity-0');
            }
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }

        function openModal(title, desc, img) {
            if (!modal) {
                console.error("Modal no encontrado en el DOM");
                return;
            }

            if(modalTitle) modalTitle.textContent = title;
            if(modalDesc) modalDesc.textContent = desc;
            if(modalImg) modalImg.src = img;

            // Mostrar contenedor
            modal.classList.remove('hidden');
            modal.classList.add('flex');

            // Forzar repintado para que la animación funcione
            // eslint-disable-next-line no-unused-expressions
            modal.offsetHeight; 

            // Animar entrada
            if(modalBackdrop) modalBackdrop.classList.remove('opacity-0');
            if(modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }

        // Usamos Delegación de Eventos en el Body para capturar clicks en los botones
        document.body.addEventListener('click', function(e) {
            // Buscamos si el clic fue en un botón de servicio o dentro de uno
            const btn = e.target.closest('.service-btn');
            
            if (btn) {
                e.preventDefault();
                console.log("Click detectado en botón de servicio");
                const title = btn.getAttribute('data-title');
                const desc = btn.getAttribute('data-desc');
                const img = btn.getAttribute('data-image');
                openModal(title, desc, img);
            }
        });

        // Eventos de cierre
        if(modalClose) modalClose.onclick = window.closeModal;
        if(modalBackdrop) modalBackdrop.onclick = window.closeModal;

        document.onkeydown = function(e) {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                window.closeModal();
            }
        };
    }

    // Inicializador seguro
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initApp, 1);
    } else {
        document.addEventListener('DOMContentLoaded', initApp);
    }

})();