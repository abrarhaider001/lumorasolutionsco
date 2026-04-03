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

    sections.forEach((section) => {
        const spotlight = section.querySelector(".spotlight");
        spotlight.style.opacity = "1";
        // pełna widoczność

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
            // Dla urządzeń mobilnych – efekt zmieniany jest przy kliknięciu
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
}
);
