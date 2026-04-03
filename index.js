WebFont.load({
    google: {
        families: ["Schibsted Grotesk:300,400,500,600,700"]
    }
});

!function (o, c) {
    var n = c.documentElement
        , t = " w-mod-";
    n.className += t + "js",
        ("ontouchstart" in o || o.DocumentTouch && c instanceof DocumentTouch) && (n.className += t + "touch")
}(window, document);

!function () {
    if (!window.UnicornStudio) {
        window.UnicornStudio = {
            isInitialized: !1
        };
        var i = document.createElement("script");
        i.src = "https://cdn.unicorn.studio/v1.4.1/unicornStudio.umd.js",
            i.onload = function () {
                window.UnicornStudio.isInitialized || (UnicornStudio.init(),
                    window.UnicornStudio.isInitialized = !0)
            }
            ,
            (document.head || document.body).appendChild(i)
    }
}();

window.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section_spotlight");

    // Definiowanie rozmiarów spotlight dla desktopu i urządzeń mobilnych
    const desktopSpotlightSize = "rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 0.9) 150px, rgba(0, 0, 0, 0.7) 300px, rgba(0, 0, 0, 0.3) 600px, rgba(0, 0, 0, 0.1) 800px";
    const mobileSpotlightSize = "rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 0.8) 50px, rgba(0, 0, 0, 0.5) 100px, rgba(0, 0, 0, 0.2) 150px";

    function isDesktop() {
        return window.innerWidth >= 1024;
    }

    /** Hero spotlight: no mask / no interaction on tablet & mobile (matches CSS max-width: 991px) */
    const heroMobileMq = window.matchMedia("(max-width: 991px)");

    function disableHeroSpotlight(spotlight) {
        spotlight.style.webkitMaskImage = "none";
        spotlight.style.maskImage = "none";
        spotlight.style.opacity = "1";
    }

    sections.forEach((section) => {
        const spotlight = section.querySelector(".spotlight");
        if (!spotlight) return;
        spotlight.style.opacity = "1";
        // pełna widoczność

        if (heroMobileMq.matches) {
            disableHeroSpotlight(spotlight);
            return;
        }

        function getSpotlightSize() {
            return isDesktop() ? desktopSpotlightSize : mobileSpotlightSize;
        }

        // Ustawienie spotlighta na środku
        function setCenterSpotlight() {
            const rect = section.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const maskValue = `radial-gradient(circle at ${centerX}px ${centerY}px, ${getSpotlightSize()})`;
            spotlight.style.maskImage = maskValue;
            spotlight.style.webkitMaskImage = maskValue;
            return {
                centerX,
                centerY
            };
        }

        // Na starcie ustawiamy spotlight na środku
        const { centerX, centerY } = setCenterSpotlight();

        if (isDesktop()) {
            // Dla desktopu – animacyjne "podążanie" za kursorem
            let currentX = centerX;
            let currentY = centerY;
            let targetX = centerX;
            let targetY = centerY;
            let animating = false;
            let animationFrameId = null;

            function updateTargetPosition(event) {
                const rect = section.getBoundingClientRect();
                targetX = event.clientX - rect.left;
                targetY = event.clientY - rect.top;
            }

            function animateSpotlight() {
                animating = true;
                const dx = targetX - currentX;
                const dy = targetY - currentY;
                // Współczynnik "wygładzania" – im mniejszy, tym bardziej płynne przejście
                currentX += dx * 0.1;
                currentY += dy * 0.1;

                const maskValue = `radial-gradient(circle at ${currentX}px ${currentY}px, ${getSpotlightSize()})`;
                spotlight.style.maskImage = maskValue;
                spotlight.style.webkitMaskImage = maskValue;

                // Jeśli różnica jest minimalna, kończymy animację
                if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                    animating = false;
                } else {
                    animationFrameId = requestAnimationFrame(animateSpotlight);
                }
            }

            section.addEventListener("mousemove", (event) => {
                updateTargetPosition(event);
                // Jeśli animacja nie jest już aktywna, ją uruchamiamy
                if (!animating) {
                    animateSpotlight();
                }
                section.dataset.interacted = "true";
            }
            );

            section.addEventListener("mouseleave", () => {
                // Opcjonalnie przerywamy animację po opuszczeniu elementu,
                // ale nie resetujemy pozycji do środka.
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animating = false;
                }
            }
            );
        } else {
            // Dla urządzeń mobilnych (992px–1023px): efekt zmieniany jest przy kliknięciu — wyłączone gdy heroMobileMq (obsługa wyżej)
            section.addEventListener("click", (event) => {
                const rect = section.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const maskValue = `radial-gradient(circle at ${x}px ${y}px, ${getSpotlightSize()})`;
                spotlight.style.maskImage = maskValue;
                spotlight.style.webkitMaskImage = maskValue;
            }
            );
            spotlight.addEventListener("click", (event) => {
                const rect = section.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const maskValue = `radial-gradient(circle at ${x}px ${y}px, ${getSpotlightSize()})`;
                spotlight.style.maskImage = maskValue;
                spotlight.style.webkitMaskImage = maskValue;
            }
            );
        }
    }
    );

    // Przy zmianie rozmiaru okna:
    window.addEventListener("resize", () => {
        sections.forEach((section) => {
            const spotlight = section.querySelector(".spotlight");
            if (!spotlight) return;
            if (heroMobileMq.matches) {
                disableHeroSpotlight(spotlight);
                return;
            }
            if (isDesktop()) {
                if (!section.dataset.interacted) {
                    const rect = section.getBoundingClientRect();
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const maskValue = `radial-gradient(circle at ${centerX}px ${centerY}px, ${desktopSpotlightSize})`;
                    spotlight.style.maskImage = maskValue;
                    spotlight.style.webkitMaskImage = maskValue;
                }
                // Jeśli użytkownik już interagował, pozostawiamy ostatnią pozycję spotlighta.
            } else {
                spotlight.style.opacity = "1";
                const rect = section.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const maskValue = `radial-gradient(circle at ${centerX}px ${centerY}px, ${mobileSpotlightSize})`;
                spotlight.style.maskImage = maskValue;
                spotlight.style.webkitMaskImage = maskValue;
            }
        }
        );
    }
    );

    const backToTopEl = document.getElementById("back-to-top");
    if (backToTopEl) {
        const showNearBottomPx = 320;
        function updateBackToTop() {
            const doc = document.documentElement;
            const scrollBottom = window.scrollY + window.innerHeight;
            const nearBottom = scrollBottom >= doc.scrollHeight - showNearBottomPx;
            const notAtTop = window.scrollY > 120;
            backToTopEl.classList.toggle("is-visible", nearBottom && notAtTop);
        }
        window.addEventListener("scroll", updateBackToTop, { passive: true });
        updateBackToTop();
        backToTopEl.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("Hero")?.scrollIntoView({ behavior: "smooth" });
        });
    }

    const faqEase = "cubic-bezier(0.4, 0, 0.2, 1)";
    const faqDur = "0.45s";

    function syncFaqOpenHeights() {
        document.querySelectorAll(".faq_accordion.is-open .faq10_answer").forEach((answer) => {
            const inner = answer.firstElementChild;
            if (!inner) return;
            answer.style.height = `${inner.scrollHeight}px`;
        });
    }

    window.addEventListener("resize", () => {
        requestAnimationFrame(syncFaqOpenHeights);
    });

    document.querySelectorAll(".faq_accordion .faq_question").forEach((question) => {
        question.addEventListener("click", (e) => {
            e.preventDefault();
            const acc = question.closest(".faq_accordion");
            const answer = acc?.querySelector(".faq10_answer");
            if (!acc || !answer) return;

            const inner = answer.firstElementChild;
            const opening = !acc.classList.contains("is-open");

            if (opening) {
                acc.classList.add("is-open");
                answer.style.transition = "none";
                answer.style.height = "0px";
                void answer.offsetHeight;
                const target = inner ? inner.scrollHeight : 0;
                requestAnimationFrame(() => {
                    answer.style.transition = `height ${faqDur} ${faqEase}`;
                    answer.style.height = `${target}px`;
                });
                answer.addEventListener(
                    "transitionend",
                    function onOpenEnd(ev) {
                        if (ev.propertyName !== "height") return;
                        answer.style.height = "auto";
                        answer.style.transition = "";
                        answer.removeEventListener("transitionend", onOpenEnd);
                    },
                    { once: true }
                );
            } else {
                let h = answer.scrollHeight;
                if (answer.style.height === "auto" || answer.style.height === "") {
                    answer.style.height = `${h}px`;
                }
                void answer.offsetHeight;
                requestAnimationFrame(() => {
                    answer.style.transition = `height ${faqDur} ${faqEase}`;
                    answer.style.height = "0px";
                });
                answer.addEventListener(
                    "transitionend",
                    function onCloseEnd(ev) {
                        if (ev.propertyName !== "height") return;
                        acc.classList.remove("is-open");
                        answer.style.height = "";
                        answer.style.transition = "";
                        answer.removeEventListener("transitionend", onCloseEnd);
                    },
                    { once: true }
                );
            }
        });
    });

    const mobileNavMq = window.matchMedia("(max-width: 991px)");
    const mobileNavRoot = document.querySelector(".mobile-nav");
    const mNavOverlay = document.querySelector(".m-nav-overlay");
    const mNavPanel = document.querySelector(".m-nav-overlay .m-nav-content");
    const mNavOpen = document.querySelector(".m-nav-toggle-open");
    const mNavClose = document.querySelector(".m-nav-sidebar-close");

    function resetMobileMenuOpenButton() {
        if (!mNavOpen) return;
        mNavOpen.style.removeProperty("display");
        mNavOpen.style.removeProperty("opacity");
        mNavOpen.style.removeProperty("visibility");
        mNavOpen.style.removeProperty("transform");
        mNavOpen.style.removeProperty("-webkit-transform");
        mNavOpen.style.removeProperty("-moz-transform");
        mNavOpen.style.removeProperty("-ms-transform");
    }

    function resetMobileMenuCloseButton() {
        if (!mNavClose) return;
        mNavClose.style.removeProperty("display");
        mNavClose.style.removeProperty("opacity");
        mNavClose.style.removeProperty("visibility");
        mNavClose.style.removeProperty("transform");
        mNavClose.style.removeProperty("-webkit-transform");
        mNavClose.style.removeProperty("-moz-transform");
        mNavClose.style.removeProperty("-ms-transform");
        mNavClose.querySelectorAll(".m-nav-toggle-inner, .m-nav-close-icon-wrapper").forEach((el) => {
            el.style.removeProperty("opacity");
            el.style.removeProperty("visibility");
            el.style.removeProperty("transform");
            el.style.removeProperty("-webkit-transform");
        });
    }

    let mNavCloseFallbackTimer = null;
    let mNavCloseGeneration = 0;

    function finishMobileMenuClose() {
        if (!mNavOverlay || !mNavPanel) return;
        if (mNavCloseFallbackTimer) {
            clearTimeout(mNavCloseFallbackTimer);
            mNavCloseFallbackTimer = null;
        }
        mNavPanel.classList.remove("m-nav-content--slide-out");
        mNavOverlay.classList.remove("is-open", "is-closing");
        mobileNavRoot?.classList.remove("menu-open");
        mNavOverlay.style.display = "none";
        mNavOverlay.style.height = "0%";
        mNavOverlay.style.width = "100%";
        resetMobileMenuOpenButton();
        resetMobileMenuCloseButton();
    }

    function closeMobileMenu(ev) {
        if (!mobileNavMq.matches || !mNavOverlay || !mNavPanel) return;
        if (!mNavOverlay.classList.contains("is-open")) return;
        if (mNavOverlay.classList.contains("is-closing")) return;
        if (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        }
        const generation = ++mNavCloseGeneration;
        mNavOverlay.classList.add("is-closing");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mNavPanel.classList.add("m-nav-content--slide-out");
            });
        });
        const onTransitionEnd = (e) => {
            if (generation !== mNavCloseGeneration) return;
            if (e.propertyName !== "transform") return;
            mNavPanel.removeEventListener("transitionend", onTransitionEnd);
            if (mNavCloseFallbackTimer) {
                clearTimeout(mNavCloseFallbackTimer);
                mNavCloseFallbackTimer = null;
            }
            finishMobileMenuClose();
        };
        mNavPanel.addEventListener("transitionend", onTransitionEnd);
        if (mNavCloseFallbackTimer) clearTimeout(mNavCloseFallbackTimer);
        mNavCloseFallbackTimer = window.setTimeout(() => {
            mNavPanel.removeEventListener("transitionend", onTransitionEnd);
            if (generation !== mNavCloseGeneration) return;
            finishMobileMenuClose();
        }, 500);
    }

    function openMobileMenu(ev) {
        if (!mobileNavMq.matches || !mNavOverlay || !mNavPanel) return;
        if (mNavOverlay.classList.contains("is-open") && !mNavOverlay.classList.contains("is-closing")) return;
        if (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        }
        mNavCloseGeneration += 1;
        if (mNavCloseFallbackTimer) {
            clearTimeout(mNavCloseFallbackTimer);
            mNavCloseFallbackTimer = null;
        }
        mNavPanel.classList.remove("m-nav-content--slide-out");
        mNavOverlay.classList.remove("is-closing");
        mNavOverlay.style.display = "flex";
        mNavOverlay.style.width = "100%";
        mNavOverlay.style.height = "100%";
        void mNavOverlay.offsetHeight;
        mNavOverlay.classList.add("is-open");
        mobileNavRoot?.classList.add("menu-open");
        resetMobileMenuCloseButton();
    }

    mNavOpen?.addEventListener("click", openMobileMenu, true);
    mNavClose?.addEventListener("click", closeMobileMenu, true);

    mNavOverlay?.addEventListener("click", (e) => {
        if (!mobileNavMq.matches) return;
        if (e.target.closest(".m-nav-content")) return;
        e.preventDefault();
        closeMobileMenu(e);
    });

    document.querySelectorAll(".m-nav-link").forEach((link) => {
        link.addEventListener("click", (e) => {
            if (!mobileNavMq.matches) return;
            const href = link.getAttribute("href");
            if (!href || href.charAt(0) !== "#") return;
            e.preventDefault();
            const id = href.slice(1);
            closeMobileMenu();
            window.setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 420);
        });
    });

    window.addEventListener(
        "resize",
        () => {
            if (!mobileNavMq.matches && mNavOverlay?.classList.contains("is-open")) {
                finishMobileMenuClose();
            }
        },
        { passive: true }
    );
}
);
