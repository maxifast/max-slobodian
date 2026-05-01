/* ═══════════════════════════════════════════
   AI Demo — Interactive CBT-style Demo
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    var thoughtsData = [
        {
            thought: '«Тимчасовий захист скоро закінчиться, і мене депортують»',
            analysis: 'Тимчасовий захист для українців в Іспанії регулярно продовжується. Навіть якщо статус ТЗ зміниться — існують альтернативні шляхи легалізації: arraigo social, arraigo laboral, робоча резиденція. Жодного масового повернення не відбувалось і не планується. Але важливо заздалегідь підготувати план Б.',
            alternative: 'Усі варіанти переходу з ТЗ на інший тип резиденції детально розібрані в автоконсультації «Загальна» — з покроковими інструкціями, чек-лістами документів та реальними прикладами. А якщо хочете розбір саме вашого кейсу — напишіть мені для приватної консультації.',
            scale: 92
        },
        {
            thought: '«Я не зможу знайти роботу в Іспанії без знання мови»',
            analysis: 'В Іспанії працюють тисячі українців — від IT-фахівців до працівників сфери послуг. Для IT, маркетингу та багатьох інших сфер достатньо англійської. Базова іспанська вивчається за 2-3 місяці до рівня, достатнього для побутового спілкування. А є міста, де українська громада настільки велика, що перші місяці можна обійтись і без мови.',
            alternative: 'В автоконсультації «Бізнес & IT» я детально розбираю: який тип міста підходить для різних спеціальностей, як оформити autónomo, де шукати роботу без іспанської. 8 відео з конкретними інструкціями. Для індивідуального розбору вашої ситуації — пишіть мені особисто.',
            scale: 88
        },
        {
            thought: '«Переїзд коштує занадто дорого, я не потягну»',
            analysis: 'Середній бюджет переїзду в Іспанію — від 2000 до 5000€ на сім\'ю, залежно від міста та формату. Це значно менше, ніж думає більшість людей. Правильне планування дозволяє заощадити 30-50% бюджету: вибір правильного міста, знання де шукати житло, уникнення типових помилок з документами.',
            alternative: 'В автоконсультації «Загальна» є окремий відеоблок про бюджет переїзду — скільки реально коштує кожен етап, де можна заощадити, які міста найдешевші для старту. Автоконсультація за 25€ заощаджує до 2000€. Для персонального бюджетного плану — зверніться за приватною консультацією.',
            scale: 85
        },
        {
            thought: '«Мені відмовлять у документах, бо я не знаю процедуру»',
            analysis: 'Процедура оформлення документів в Іспанії стандартна і прозора. 95% відмов відбуваються через неправильно подані документи або пропущені терміни — тобто через незнання нюансів, а не через суб\'єктивне рішення чиновника. З правильною підготовкою — шанс успіху близький до 100%.',
            alternative: 'В автоконсультаціях я даю повні чек-лісти документів, правильний порядок дій та типові помилки з 400+ реальних кейсів. Все разом (23 відео, 4 години) покриває абсолютно все. А для супроводу саме вашого оформлення — запишіться на приватну консультацію зі мною.',
            scale: 95
        }
    ];

    var thoughtsContainer = document.getElementById('ai-thoughts');
    var resultContainer = document.getElementById('ai-result');
    var originalEl = document.getElementById('ai-original');
    var analysisEl = document.getElementById('ai-analysis');
    var alternativeEl = document.getElementById('ai-alternative');
    var scaleEl = document.getElementById('ai-scale');
    var scaleValueEl = document.getElementById('ai-scale-value');
    var resetBtn = document.getElementById('ai-reset');

    if (!thoughtsContainer || !resultContainer) return;

    // Typewriter effect
    function typeWriter(element, text, speed, callback) {
        element.textContent = '';
        var i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Handle thought selection
    var thoughtBtns = thoughtsContainer.querySelectorAll('.thought-btn');
    thoughtBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var index = parseInt(this.getAttribute('data-thought'), 10);
            var data = thoughtsData[index];

            thoughtsContainer.style.display = 'none';
            resultContainer.style.display = 'block';

            // Set original thought
            originalEl.textContent = data.thought;

            // Typewriter for analysis
            typeWriter(analysisEl, data.analysis, 12, function () {
                // Typewriter for alternative
                typeWriter(alternativeEl, data.alternative, 12, function () {
                    // Animate scale
                    setTimeout(function () {
                        scaleEl.style.width = data.scale + '%';

                        // Animate percentage number
                        var currentVal = 0;
                        var interval = setInterval(function () {
                            currentVal += 1;
                            scaleValueEl.textContent = currentVal + '%';
                            if (currentVal >= data.scale) {
                                clearInterval(interval);
                            }
                        }, 15);
                    }, 300);
                });
            });
        });
    });

    // Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            resultContainer.style.display = 'none';
            thoughtsContainer.style.display = 'flex';
            scaleEl.style.width = '0%';
            scaleValueEl.textContent = '0%';
            analysisEl.textContent = '';
            alternativeEl.textContent = '';
        });
    }
})();
