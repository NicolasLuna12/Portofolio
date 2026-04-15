// Demo modal interactions
(() => {
    const demoBtn = document.getElementById('demo-btn');
    const demoAndroidBtn = document.getElementById('demo-android-btn');
    const modal = document.getElementById('demo-modal');
    const closeModalBtn = document.getElementById('close-demo-modal');
    const goDemoBtn = document.getElementById('go-demo-login');

    if (!modal || !closeModalBtn || !goDemoBtn) {
        return;
    }

    let lastDemo = 'web';

    const openModal = (target) => {
        lastDemo = target;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    if (demoBtn) {
        demoBtn.addEventListener('click', () => openModal('web'));
    }

    if (demoAndroidBtn) {
        demoAndroidBtn.addEventListener('click', () => openModal('android'));
    }

    closeModalBtn.addEventListener('click', closeModal);

    goDemoBtn.addEventListener('click', () => {
        const targetUrl = lastDemo === 'android'
            ? 'https://appetize.io/app/b_zzjugodwwxe26uawgbpk4yiqhi'
            : 'https://ispcfood.dev.ar/';

        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        closeModal();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
})();
