// ============================================
// BANCO DE DADOS DE PRODUTOS
// ============================================
const products = [
    { id: 1, name: "Camisa Oversized Black", price: 89.90, category: "camisetas", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400", featured: true },
    { id: 2, name: "Camisa Street White", price: 79.90, category: "camisetas", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", featured: true },
    { id: 3, name: "Camisa Graphic Navy", price: 99.90, category: "camisetas", image: "https://images.unsplash.com/photo-1581655353564-df123f1c3f46?w=400", featured: false },
    { id: 4, name: "Regata Urban", price: 69.90, category: "camisetas", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400", featured: false },
    { id: 5, name: "Jeans Skinny", price: 159.90, category: "calcas", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", featured: true },
    { id: 6, name: "Cargo Preto", price: 179.90, category: "calcas", image: "https://images.unsplash.com/photo-1594938374182-f1f0e2a9ab0e?w=400", featured: false },
    { id: 7, name: "Calça Jogger", price: 139.90, category: "calcas", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", featured: false },
    { id: 8, name: "Bermuda Cargo", price: 99.90, category: "calcas", image: "https://images.unsplash.com/photo-1594938374182-f1f0e2a9ab0e?w=400", featured: true },
    { id: 9, name: "Boné Snapback", price: 49.90, category: "acessorios", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", featured: true },
    { id: 10, name: "Mochila Urbana", price: 129.90, category: "acessorios", image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400", featured: false },
    { id: 11, name: "Relógio Casual", price: 89.90, category: "acessorios", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400", featured: false },
    { id: 12, name: "Cordão Prata", price: 39.90, category: "acessorios", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400", featured: true }
];

// ============================================
// CARRINHO DE COMPRAS (com localStorage)
// ============================================
let carrinho = [];

function carregarCarrinho() {
    const salvo = localStorage.getItem('carrinho');
    if (salvo) {
        carrinho = JSON.parse(salvo);
    }
    atualizarContadorCarrinho();
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
    const contadores = document.querySelectorAll('.cart-count');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contadores.forEach(contador => {
        contador.textContent = totalItens;
    });
}

function adicionarAoCarrinho(productId) {
    const produto = products.find(p => p.id === productId);
    if (!produto) return;
    
    const itemExistente = carrinho.find(item => item.id === productId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            name: produto.name,
            price: produto.price,
            image: produto.image,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    showNotification(`${produto.name} adicionado ao carrinho!`);
}

function removerDoCarrinho(productId) {
    const index = carrinho.findIndex(item => item.id === productId);
    if (index !== -1) {
        carrinho.splice(index, 1);
        salvarCarrinho();
        if (window.location.pathname.includes('checkout.html')) {
            carregarCarrinhoCheckout();
        }
    }
}

function atualizarQuantidade(productId, novaQuantidade) {
    if (novaQuantidade <= 0) {
        removerDoCarrinho(productId);
        return;
    }
    
    const item = carrinho.find(item => item.id === productId);
    if (item) {
        item.quantidade = novaQuantidade;
        salvarCarrinho();
        if (window.location.pathname.includes('checkout.html')) {
            carregarCarrinhoCheckout();
        }
    }
}

function getTotalCarrinho() {
    return carrinho.reduce((total, item) => total + (item.price * item.quantidade), 0);
}

// ============================================
// FUNÇÃO PARA IR AO CHECKOUT
// ============================================
function irParaCheckout() {
    if (carrinho.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }
    window.location.href = 'checkout.html';
}

// ============================================
// CARREGAR CARRINHO NA PÁGINA DE CHECKOUT
// ============================================
function carregarCarrinhoCheckout() {
    const container = document.getElementById('carrinho-items');
    const totalContainer = document.getElementById('totalCarrinho');
    
    if (!container) return;
    
    if (carrinho.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem;">Seu carrinho está vazio. <a href="produtos.html">Voltar às compras</a></p>';
        if (totalContainer) totalContainer.innerHTML = 'R$ 0,00';
        return;
    }
    
    let html = '';
    carrinho.forEach(item => {
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantidade}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    R$ ${(item.price * item.quantidade).toFixed(2)}
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    if (totalContainer) {
        totalContainer.innerHTML = `R$ ${getTotalCarrinho().toFixed(2)}`;
    }
    
    // Eventos dos botões
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = carrinho.find(i => i.id === id);
            if (item) {
                atualizarQuantidade(id, item.quantidade - 1);
            }
        });
    });
    
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const item = carrinho.find(i => i.id === id);
            if (item) {
                atualizarQuantidade(id, item.quantidade + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            removerDoCarrinho(id);
        });
    });
}

// ============================================
// FORMATAÇÃO DE CAMPOS
// ============================================
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length === 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length === 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    input.value = value;
}

function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length === 8) {
        value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    input.value = value;
}

function formatarCartao(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    input.value = value.trim();
}

function formatarValidade(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    input.value = value;
}

// ============================================
// VALIDAÇÃO DO FORMULÁRIO DE PAGAMENTO
// ============================================
function configurarFormularioPagamento() {
    const form = document.getElementById('paymentForm');
    if (!form) return;
    
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardFields = document.getElementById('creditCardFields');
    
    if (paymentMethods.length && creditCardFields) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', () => {
                creditCardFields.style.display = method.value === 'credit' ? 'block' : 'none';
            });
        });
    }
    
    document.getElementById('cpf')?.addEventListener('input', e => formatarCPF(e.target));
    document.getElementById('phone')?.addEventListener('input', e => formatarTelefone(e.target));
    document.getElementById('cep')?.addEventListener('input', e => formatarCEP(e.target));
    document.getElementById('cardNumber')?.addEventListener('input', e => formatarCartao(e.target));
    document.getElementById('validity')?.addEventListener('input', e => formatarValidade(e.target));
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('fullName')?.value.trim();
        const cpf = document.getElementById('cpf')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const endereco = document.getElementById('address')?.value.trim();
        const termos = document.getElementById('terms')?.checked;
        
        if (!nome || !cpf || !email || !endereco) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        
        if (!termos) {
            alert('Você precisa aceitar os termos e condições!');
            return;
        }
        
        if (cpf.replace(/\D/g, '').length !== 11) {
            alert('CPF inválido!');
            return;
        }
        
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        let itensTexto = '';
        carrinho.forEach(item => {
            itensTexto += `\n- ${item.name} (${item.quantidade}x) = R$ ${(item.price * item.quantidade).toFixed(2)}`;
        });
        
        alert(`✅ Compra finalizada!\n\nProdutos:${itensTexto}\n\nTotal: R$ ${getTotalCarrinho().toFixed(2)}\n\nObrigado pela compra!`);
        
        localStorage.removeItem('carrinho');
        carrinho = [];
        atualizarContadorCarrinho();
        
        form.reset();
        window.location.href = 'index.html';
    });
}

// ============================================
// NOTIFICAÇÃO
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1a2a4f;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ============================================
// RENDERIZAR PRODUTOS (COM ADICIONAR AO CARRINHO)
// ============================================
function renderizarProdutosHome() {
    const container = document.getElementById('featured-grid');
    if (!container) return;
    
    const destaque = products.filter(p => p.featured === true);
    
    container.innerHTML = destaque.map(produto => `
        <div class="product-card" data-id="${produto.id}">
            <div class="product-image" style="cursor: pointer;">
                <img src="${produto.image}" alt="${produto.name}" onerror="this.src='https://placehold.co/400x300/1a2a4f/white?text=Produto'">
            </div>
            <div class="product-info">
                <h3>${produto.name}</h3>
                <p class="product-price">R$ ${produto.price.toFixed(2)}</p>
                <div class="product-buttons">
                    <button class="btn-cart" data-id="${produto.id}">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                    <button class="btn-buy" data-id="${produto.id}">Comprar</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Clique na imagem (vai para detalhes ou compra)
    document.querySelectorAll('.product-image').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(img.closest('.product-card').dataset.id);
            adicionarAoCarrinho(id);
        });
    });
    
    // Botão Adicionar ao Carrinho
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            adicionarAoCarrinho(id);
        });
    });
    
    // Botão Comprar (vai direto para o checkout)
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            // Limpa carrinho atual e adiciona só este produto
            carrinho = [];
            adicionarAoCarrinho(id);
            irParaCheckout();
        });
    });
}

function renderizarProdutosLoja(categoria = 'todos') {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    let filtrados = products;
    if (categoria !== 'todos') {
        filtrados = products.filter(p => p.category === categoria);
    }
    
    container.innerHTML = filtrados.map(produto => `
        <div class="product-card" data-id="${produto.id}">
            <div class="product-image" style="cursor: pointer;">
                <img src="${produto.image}" alt="${produto.name}" onerror="this.src='https://placehold.co/400x300/1a2a4f/white?text=Produto'">
            </div>
            <div class="product-info">
                <h3>${produto.name}</h3>
                <p class="product-price">R$ ${produto.price.toFixed(2)}</p>
                <div class="product-buttons">
                    <button class="btn-cart" data-id="${produto.id}">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                    <button class="btn-buy" data-id="${produto.id}">Comprar</button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.product-image').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(img.closest('.product-card').dataset.id);
            adicionarAoCarrinho(id);
        });
    });
    
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            adicionarAoCarrinho(id);
        });
    });
    
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            carrinho = [];
            adicionarAoCarrinho(id);
            irParaCheckout();
        });
    });
}

// ============================================
// FILTROS
// ============================================
function configurarFiltros() {
    const botoes = document.querySelectorAll('.filter-btn');
    if (!botoes.length) return;
    
    botoes.forEach(botao => {
        botao.addEventListener('click', () => {
            botoes.forEach(b => b.classList.remove('active'));
            botao.classList.add('active');
            renderizarProdutosLoja(botao.dataset.category);
        });
    });
}

// ============================================
// FORMULÁRIO DE CONTATO
// ============================================
function configurarContato() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const mensagem = document.getElementById('message')?.value.trim();
        
        if (!nome || nome.length < 3) {
            document.getElementById('nameError').textContent = 'Nome inválido';
            return;
        }
        if (!email || !email.includes('@')) {
            document.getElementById('emailError').textContent = 'Email inválido';
            return;
        }
        if (!mensagem || mensagem.length < 10) {
            document.getElementById('messageError').textContent = 'Mensagem muito curta';
            return;
        }
        
        showNotification('Mensagem enviada com sucesso!');
        form.reset();
    });
}

// ============================================
// CLIQUE NO ÍCONE DO CARRINHO
// ============================================
function configurarCarrinhoIcone() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            irParaCheckout();
        });
    }
}

// ============================================
// MENU MOBILE
// ============================================
function configurarMenuMobile() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', () => menu.classList.toggle('active'));
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => menu.classList.remove('active'));
        });
    }
}

// ============================================
// INICIAR
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    configurarMenuMobile();
    configurarCarrinhoIcone();
    renderizarProdutosHome();
    renderizarProdutosLoja();
    configurarFiltros();
    configurarContato();
    carregarCarrinhoCheckout();
    configurarFormularioPagamento();
});