/* ====================================
   PROTEÇÃO VEICULAR - VICTOR SANCHES
   Script Principal
   ==================================== */

// ====================================
// CONFIGURAÇÕES
// ====================================

// ⚠️ IMPORTANTE: Altere o número do WhatsApp abaixo para o número real do consultor
// Formato: Código do país + DDD + Número (apenas números, sem espaços ou caracteres especiais)
// Exemplo: 5511999999999 = +55 (Brasil) 11 (DDD) 999999999 (Número)
const WHATSAPP_NUMBER = '5511999999999';

// ====================================
// NAVEGAÇÃO MOBILE
// ====================================

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

// Toggle menu mobile
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ====================================
// HEADER SCROLL
// ====================================

let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Esconder header ao rolar para baixo, mostrar ao rolar para cima
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});

// ====================================
// CARROSSEL DE NOTÍCIAS
// ====================================

const newsSlides = document.getElementById('news-slides');
const prevBtn = document.getElementById('prev-news');
const nextBtn = document.getElementById('next-news');
const dotsContainer = document.getElementById('news-dots');

if (newsSlides) {
    const slides = newsSlides.querySelectorAll('.coverage-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Criar dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('news-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.news-dot');
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(n) {
        currentSlide = n;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        
        newsSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    // Pausar autoplay ao hover
    newsSlides.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    newsSlides.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
    
    // Suporte para touch/swipe em mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    newsSlides.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    newsSlides.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }
}

// ====================================
// SCROLL REVEAL - ANIMAÇÕES AO ROLAR
// ====================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Opcional: parar de observar após animar
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar todos os elementos com classes de reveal
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
revealElements.forEach(el => observer.observe(el));

// ====================================
// SMOOTH SCROLL
// ====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// VALIDAÇÃO E FORMATAÇÃO DO FORMULÁRIO
// ====================================

const form = document.getElementById('cotacao-form');
const nomeInput = document.getElementById('nome');
const placaInput = document.getElementById('placa');
const nomeError = document.getElementById('nome-error');
const placaError = document.getElementById('placa-error');

// Formatação automática da placa
placaInput.addEventListener('input', (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Limitar a 7 caracteres (formato padrão e Mercosul)
    if (value.length > 7) {
        value = value.substring(0, 7);
    }
    
    // Adicionar hífen automaticamente para formato padrão (ABC-1234)
    if (value.length > 3 && /^[A-Z]{3}[0-9]/.test(value)) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    e.target.value = value;
    
    // Limpar erro ao digitar
    placaError.textContent = '';
    placaInput.classList.remove('error');
});

// Limpar erro do nome ao digitar
nomeInput.addEventListener('input', () => {
    nomeError.textContent = '';
    nomeInput.classList.remove('error');
});

// Validação do nome
function validarNome(nome) {
    if (!nome.trim()) {
        return 'Por favor, digite seu nome completo';
    }
    
    if (nome.trim().length < 3) {
        return 'Nome muito curto';
    }
    
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        return 'Nome deve conter apenas letras';
    }
    
    const palavras = nome.trim().split(/\s+/);
    if (palavras.length < 2) {
        return 'Por favor, digite nome e sobrenome';
    }
    
    return null;
}

// Validação da placa
function validarPlaca(placa) {
    const placaLimpa = placa.replace(/[^A-Z0-9]/g, '');
    
    if (!placaLimpa) {
        return 'Por favor, digite a placa do veículo';
    }
    
    if (placaLimpa.length !== 7) {
        return 'Placa deve ter 7 caracteres';
    }
    
    // Validar formato padrão: ABC1234
    const formatoPadrao = /^[A-Z]{3}[0-9]{4}$/;
    // Validar formato Mercosul: ABC1D23
    const formatoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    
    if (!formatoPadrao.test(placaLimpa) && !formatoMercosul.test(placaLimpa)) {
        return 'Formato de placa inválido';
    }
    
    return null;
}

// ====================================
// ENVIO DO FORMULÁRIO PARA WHATSAPP
// ====================================

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Resetar erros
    nomeError.textContent = '';
    placaError.textContent = '';
    nomeInput.classList.remove('error');
    placaInput.classList.remove('error');
    
    const nome = nomeInput.value;
    const placa = placaInput.value;
    
    // Validar campos
    const erroNome = validarNome(nome);
    const erroPlaca = validarPlaca(placa);
    
    let temErro = false;
    
    if (erroNome) {
        nomeError.textContent = erroNome;
        nomeInput.classList.add('error');
        temErro = true;
    }
    
    if (erroPlaca) {
        placaError.textContent = erroPlaca;
        placaInput.classList.add('error');
        temErro = true;
    }
    
    // Se houver erros, não enviar
    if (temErro) {
        // Focar no primeiro campo com erro
        if (erroNome) {
            nomeInput.focus();
        } else if (erroPlaca) {
            placaInput.focus();
        }
        return;
    }
    
    // Preparar mensagem para WhatsApp
    const placaFormatada = placa.toUpperCase();
    const mensagem = `Olá Victor! Meu nome é ${nome} e minha placa é ${placaFormatada}. Quero receber minha cotação APVS.`;
    
    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Construir URL do WhatsApp
    const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${mensagemCodificada}`;
    
    // Abrir WhatsApp em nova aba
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    
    // Opcional: Limpar formulário após envio
    // form.reset();
    
    // Feedback visual de sucesso
    mostrarMensagemSucesso();
});

// ====================================
// FEEDBACK DE SUCESSO
// ====================================

function mostrarMensagemSucesso() {
    const button = form.querySelector('button[type="submit"]');
    const textoOriginal = button.innerHTML;
    
    button.innerHTML = '<span class="btn__icon">✅</span><span class="btn__text">Redirecionando para WhatsApp...</span>';
    button.style.backgroundColor = 'var(--color-success)';
    
    setTimeout(() => {
        button.innerHTML = textoOriginal;
        button.style.backgroundColor = '';
    }, 3000);
}

// ====================================
// TYPING EFFECT NO HERO
// ====================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Iniciar efeito de digitação quando a página carregar
window.addEventListener('load', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const originalText = typingElement.textContent;
        typeWriter(typingElement, originalText, 50);
    }
});

// ====================================
// PREVENÇÃO DE SPAM NO FORMULÁRIO
// ====================================

let ultimoEnvio = 0;
const INTERVALO_MINIMO = 3000; // 3 segundos entre envios

form.addEventListener('submit', (e) => {
    const agora = Date.now();
    
    if (agora - ultimoEnvio < INTERVALO_MINIMO) {
        e.preventDefault();
        alert('Por favor, aguarde alguns segundos antes de enviar novamente.');
        return;
    }
    
    ultimoEnvio = agora;
}, true); // Usar capture phase para executar antes do outro listener

// ====================================
// ANALYTICS E TRACKING (OPCIONAL)
// ====================================

// Rastrear cliques nos botões de CTA
document.querySelectorAll('.btn--primary').forEach(button => {
    button.addEventListener('click', () => {
        // Aqui você pode adicionar código para Google Analytics, Facebook Pixel, etc.
        console.log('CTA clicado:', button.textContent.trim());
        
        // Exemplo com Google Analytics (se estiver configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'CTA',
                'event_label': button.textContent.trim()
            });
        }
    });
});

// Rastrear envio do formulário
form.addEventListener('submit', () => {
    console.log('Formulário enviado');
    
    // Exemplo com Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'submit', {
            'event_category': 'Form',
            'event_label': 'Cotação'
        });
    }
});

// ====================================
// PERFORMANCE - LAZY LOADING DE IMAGENS
// ====================================

if ('loading' in HTMLImageElement.prototype) {
    // Navegador suporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback para navegadores antigos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ====================================
// DETECÇÃO DE CLIQUES NOS LINKS SOCIAIS
// ====================================

document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        console.log('Link social clicado:', link.getAttribute('aria-label'));
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Social',
                'event_label': link.getAttribute('aria-label')
            });
        }
    });
});

// ====================================
// BOTÃO FLUTUANTE DO WHATSAPP
// ====================================

const whatsappFloat = document.querySelector('.whatsapp-float');

if (whatsappFloat) {
    whatsappFloat.addEventListener('click', () => {
        console.log('WhatsApp flutuante clicado');
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'WhatsApp',
                'event_label': 'Floating Button'
            });
        }
    });
}

// ====================================
// MODO ESCURO (OPCIONAL - FUTURO)
// ====================================

// Detectar preferência do sistema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Função para alternar tema (para implementação futura)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Carregar tema salvo
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}

// ====================================
// EASTER EGGS E INTERATIVIDADE
// ====================================

// Contador de cliques no logo (Easter egg)
let logoClicks = 0;
const logo = document.querySelector('.nav__logo');

if (logo) {
    logo.addEventListener('click', () => {
        logoClicks++;
        
        if (logoClicks === 5) {
            console.log('🎉 Easter egg encontrado! Você é curioso(a)!');
            logoClicks = 0;
            
            // Adicionar efeito visual divertido
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });
}

// ====================================
// VERIFICAÇÃO DE CONEXÃO
// ====================================

window.addEventListener('online', () => {
    console.log('Conexão restaurada');
});

window.addEventListener('offline', () => {
    console.warn('Sem conexão com a internet');
    alert('Você está offline. Verifique sua conexão com a internet.');
});

// ====================================
// INFORMAÇÕES DE DEBUG (APENAS DESENVOLVIMENTO)
// ====================================

console.log('%c🚗 Site Proteção Veicular - Victor Sanches', 'font-size: 20px; font-weight: bold; color: #0b72ff;');
console.log('%c✅ Script carregado com sucesso', 'font-size: 14px; color: #10b981;');
console.log('%c⚠️ Lembre-se de alterar o número do WhatsApp na constante WHATSAPP_NUMBER', 'font-size: 14px; color: #f59e0b; font-weight: bold;');
console.log(`%cNúmero atual: ${WHATSAPP_NUMBER}`, 'font-size: 12px; color: #6b7280;');

// ====================================
// INICIALIZAÇÃO COMPLETA
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM carregado completamente');
    
    // Adicionar classe de carregamento completo
    document.body.classList.add('loaded');
    
    // Iniciar animações iniciais
    setTimeout(() => {
        document.querySelector('.hero')?.classList.add('animated');
    }, 100);
});

// ====================================
// FIM DO SCRIPT
// ====================================
