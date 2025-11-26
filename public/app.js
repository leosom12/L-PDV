// ==================== VARIÁVEIS GLOBAIS ====================
let cart = [];
let currentUser = null;
let pixTimerInterval = null;

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há token salvo
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
        // Mostrar app
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'block';

        // Carregar dados
        loadDashboard();
        loadProducts();
        loadSales();
    }

    // Event Listeners
    setupEventListeners();
    checkServerStatus();
    setInterval(checkServerStatus, 30000); // Verificar servidor a cada 30s
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navegação entre tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Produtos
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openProductModal);
    }

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    }

    // Caixa/PDV
    const barcodeInput = document.getElementById('barcode-input');
    if (barcodeInput) {
        barcodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                scanProduct();
            }
        });
    }

    const finalizeSaleBtn = document.getElementById('finalize-sale');
    if (finalizeSaleBtn) {
        finalizeSaleBtn.addEventListener('click', finalizeSale);
    }

    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Métodos de pagamento
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => selectPaymentMethod(btn.dataset.method, e));
    });
}

// ==================== VERIFICAÇÃO DE SERVIDOR ====================
function checkServerStatus() {
    fetch('/api/health')
        .then(response => {
            const statusElement = document.getElementById('server-status');
            const clientStatusElement = document.getElementById('client-server-status');

            if (response.ok) {
                if (statusElement) {
                    statusElement.className = 'server-status online';
                    statusElement.innerHTML = '<span class="status-dot"></span><span class="status-text">Servidor Online</span>';
                }
                if (clientStatusElement) {
                    clientStatusElement.className = 'server-status online';
                    clientStatusElement.innerHTML = '<span class="status-dot"></span><span class="status-text">Servidor Online</span>';
                }
            } else {
                throw new Error('Servidor offline');
            }
        })
        .catch(() => {
            const statusElement = document.getElementById('server-status');
            const clientStatusElement = document.getElementById('client-server-status');

            if (statusElement) {
                statusElement.className = 'server-status offline';
                statusElement.innerHTML = '<span class="status-dot"></span><span class="status-text">Servidor Offline</span>';
            }
            if (clientStatusElement) {
                clientStatusElement.className = 'server-status offline';
                clientStatusElement.innerHTML = '<span class="status-dot"></span><span class="status-text">Servidor Offline</span>';
            }
        });
}

// ==================== NAVEGAÇÃO ====================
function switchTab(tabName) {
    // Remover active de todas as tabs
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Adicionar active na tab selecionada
    const navTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (navTab) navTab.classList.add('active');

    const contentTab = document.getElementById(`${tabName}-tab`);
    if (contentTab) contentTab.classList.add('active');

    if (tabName === 'dashboard') loadDashboard();
    if (tabName === 'products') loadProducts();
    if (tabName === 'sales') loadSales();
}

// ==================== LOGOUT ====================
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    cart = [];

    document.getElementById('app-screen').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
}

// ==================== CLIENT LOGIN ====================
function showClientLogin() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('client-login-screen').style.display = 'flex';
}

function backToMainLogin() {
    document.getElementById('client-login-screen').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
}

function clientLogin(e) {
    e.preventDefault();
    const email = document.getElementById('client-email').value;

    fetch('/api/client/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
        .then(response => response.json())
        .then(data => {
            if (data.client) {
                alert(`Bem-vindo, ${data.client.name}!\nSua dívida atual é: ${formatCurrency(data.client.debtAmount)}`);
            } else {
                alert(data.error || 'Erro ao entrar');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        });
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    const token = localStorage.getItem('authToken');

    fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-products').textContent = data.totalProducts || 0;
            document.getElementById('low-stock-products').textContent = data.lowStockProducts || 0;
            document.getElementById('out-of-stock-products').textContent = data.outOfStockProducts || 0;
            document.getElementById('total-sales-count').textContent = data.totalSales || 0;
            document.getElementById('total-sales-amount').textContent = formatCurrency(data.totalSalesAmount || 0);
        })
        .catch(error => console.error('Erro ao carregar dashboard:', error));
}

// ==================== PRODUTOS ====================
function loadProducts() {
    const token = localStorage.getItem('authToken');

    fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(products => {
            const tbody = document.getElementById('products-table-body');
            tbody.innerHTML = '';

            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-size: 1.5rem;">${product.icon || '📦'}</td>
                    <td>${product.barcode}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td class="${product.stock === 0 ? 'stock-zero' : product.stock <= 5 ? 'stock-low' : ''}">${product.stock}</td>
                    <td>
                        <button onclick="editProduct(${product.id})" class="btn-icon">✏️</button>
                        <button onclick="deleteProduct(${product.id})" class="btn-icon">🗑️</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');

    if (productId) {
        title.textContent = 'Editar Produto';
        // Carregar dados do produto
        const token = localStorage.getItem('authToken');
        fetch(`/api/products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(product => {
                document.getElementById('product-id').value = product.id;
                document.getElementById('product-barcode').value = product.barcode;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-category').value = product.category;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-stock').value = product.stock;
                document.getElementById('product-icon').value = product.icon || '';
            });
    } else {
        title.textContent = 'Novo Produto';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
    }

    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.getElementById('product-form').reset();
}

function saveProduct(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const productId = document.getElementById('product-id').value;
    const productData = {
        barcode: document.getElementById('product-barcode').value,
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        icon: document.getElementById('product-icon').value || '📦'
    };

    const url = productId ? `/api/products/${productId}` : '/api/products';
    const method = productId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.id || data.message) {
                alert(productId ? '✓ Produto atualizado!' : '✓ Produto cadastrado!');
                closeProductModal();
                loadProducts();
                loadDashboard();
            } else {
                alert(data.error || 'Erro ao salvar produto');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao salvar produto');
        });
}

function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    const token = localStorage.getItem('authToken');
    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('✓ Produto excluído!');
                loadProducts();
                loadDashboard();
            } else {
                alert(data.error || 'Erro ao excluir produto');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir produto');
        });
}

// ==================== CAIXA/PDV ====================
function scanProduct() {
    const barcode = document.getElementById('barcode-input').value.trim();
    if (!barcode) return;

    const token = localStorage.getItem('authToken');
    fetch(`/api/products/barcode/${barcode}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(product => {
            if (product.id) {
                addToCart(product);
                document.getElementById('barcode-input').value = '';

                // Mostrar info do produto escaneado
                const infoDiv = document.getElementById('scanned-product-info');
                infoDiv.innerHTML = `
                    <div class="product-scanned">
                        <span style="font-size: 2rem;">${product.icon || '📦'}</span>
                        <div>
                            <strong>${product.name}</strong>
                            <p>${formatCurrency(product.price)}</p>
                        </div>
                    </div>
                `;
                setTimeout(() => infoDiv.innerHTML = '', 3000);
            } else {
                alert('❌ Produto não encontrado!');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao buscar produto');
        });
}

function addToCart(product) {
    // Verificar estoque
    if (product.stock <= 0) {
        alert('❌ PRODUTO SEM ESTOQUE! Venda bloqueada.');
        return;
    }

    if (product.stock <= 5) {
        alert(`⚠️ ALERTA DE ESTOQUE BAIXO!\nRestam apenas ${product.stock} unidades.`);
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('⚠️ Estoque insuficiente!');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1,
            maxStock: product.stock
        });
    }

    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Carrinho vazio</p>';
        cartTotalSpan.textContent = 'R$ 0,00';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1;">
                <span style="font-size: 1.2rem;">${item.icon || '📦'}</span>
                <div style="flex: 1;">
                    <strong>${item.name}</strong>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">${formatCurrency(item.price)} x ${item.quantity}</p>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <strong>${formatCurrency(itemTotal)}</strong>
                <button onclick="removeFromCart(${index})" class="btn-icon" style="color: var(--danger);">🗑️</button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    cartTotalSpan.textContent = formatCurrency(total);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function clearCart() {
    if (cart.length === 0) return;
    if (!confirm('Deseja limpar o carrinho?')) return;

    cart = [];
    updateCartDisplay();
}

function selectPaymentMethod(method, event) {
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));

    // Se foi chamado pelo clique, usa o target, senão procura pelo método
    if (event) {
        event.currentTarget.classList.add('active');
    } else {
        const btn = document.querySelector(`.payment-btn[data-method="${method}"]`);
        if (btn) btn.classList.add('active');
    }

    document.getElementById('payment-method').value = method;

    // Lógica do PIX
    const pixArea = document.getElementById('pix-payment-area');
    if (method === 'pix') {
        pixArea.style.display = 'block';
        generatePixQr();
    } else {
        pixArea.style.display = 'none';
        if (pixTimerInterval) clearInterval(pixTimerInterval);
    }
}

function generatePixQr() {
    const qrContainer = document.getElementById('pix-qr-container');
    // Simulação de QR Code (em produção usaria uma lib como qrcode.js)
    qrContainer.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 8px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126360014BR.GOV.BCB.PIX0114628193580001065204000053039865802BR5913SUPERMERCADO6008BRASILIA62070503***6304${Math.floor(Math.random() * 9999)}" alt="QR Code PIX">
        </div>
    `;

    startPixTimer();
}

function startPixTimer() {
    if (pixTimerInterval) clearInterval(pixTimerInterval);

    let seconds = 300; // 5 minutos
    const timerDisplay = document.getElementById('pix-timer');

    pixTimerInterval = setInterval(() => {
        seconds--;
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `Atualiza em: ${min}:${sec}`;

        if (seconds <= 0) {
            generatePixQr(); // Regenera
        }
    }, 1000);
}

function finalizeSale() {
    if (cart.length === 0) {
        alert('⚠️ Carrinho vazio!');
        return;
    }

    const paymentMethod = document.getElementById('payment-method').value;
    const token = localStorage.getItem('authToken');

    const saleData = {
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        paymentMethod: paymentMethod,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    fetch('/api/sales', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(saleData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                alert(`✓ Venda finalizada!\nTotal: ${formatCurrency(data.total)}`);
                cart = [];
                updateCartDisplay();
                loadDashboard();
                loadProducts();

                // Resetar PIX se necessário
                if (paymentMethod === 'pix') {
                    selectPaymentMethod('dinheiro'); // Volta para dinheiro
                }
            } else {
                alert(data.error || 'Erro ao finalizar venda');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao finalizar venda');
        });
}

// ==================== VENDAS ====================
function loadSales() {
    const token = localStorage.getItem('authToken');

    fetch('/api/sales', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    // Verificar estoque
    if (product.stock <= 0) {
        alert('❌ PRODUTO SEM ESTOQUE! Venda bloqueada.');
        return;
    }

    if (product.stock <= 5) {
        alert(`⚠️ ALERTA DE ESTOQUE BAIXO!\nRestam apenas ${product.stock} unidades.`);
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('⚠️ Estoque insuficiente!');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1,
            maxStock: product.stock
        });
    }

    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Carrinho vazio</p>';
        cartTotalSpan.textContent = 'R$ 0,00';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1;">
                <span style="font-size: 1.2rem;">${item.icon || '📦'}</span>
                <div style="flex: 1;">
                    <strong>${item.name}</strong>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">${formatCurrency(item.price)} x ${item.quantity}</p>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <strong>${formatCurrency(itemTotal)}</strong>
                <button onclick="removeFromCart(${index})" class="btn-icon" style="color: var(--danger);">🗑️</button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    cartTotalSpan.textContent = formatCurrency(total);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function clearCart() {
    if (cart.length === 0) return;
    if (!confirm('Deseja limpar o carrinho?')) return;

    cart = [];
    updateCartDisplay();
}

function selectPaymentMethod(method, event) {
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));

    // Se foi chamado pelo clique, usa o target, senão procura pelo método
    if (event) {
        event.currentTarget.classList.add('active');
    } else {
        const btn = document.querySelector(`.payment-btn[data-method="${method}"]`);
        if (btn) btn.classList.add('active');
    }

    document.getElementById('payment-method').value = method;

    // Lógica do PIX
    const pixArea = document.getElementById('pix-payment-area');
    if (method === 'pix') {
        pixArea.style.display = 'block';
        generatePixQr();
    } else {
        pixArea.style.display = 'none';
        if (pixTimerInterval) clearInterval(pixTimerInterval);
    }
}

function generatePixQr() {
    const qrContainer = document.getElementById('pix-qr-container');
    // Simulação de QR Code (em produção usaria uma lib como qrcode.js)
    qrContainer.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 8px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126360014BR.GOV.BCB.PIX0114628193580001065204000053039865802BR5913SUPERMERCADO6008BRASILIA62070503***6304${Math.floor(Math.random() * 9999)}" alt="QR Code PIX">
        </div>
    `;

    startPixTimer();
}

function startPixTimer() {
    if (pixTimerInterval) clearInterval(pixTimerInterval);

    let seconds = 300; // 5 minutos
    const timerDisplay = document.getElementById('pix-timer');

    pixTimerInterval = setInterval(() => {
        seconds--;
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `Atualiza em: ${min}:${sec}`;

        if (seconds <= 0) {
            generatePixQr(); // Regenera
        }
    }, 1000);
}

function finalizeSale() {
    if (cart.length === 0) {
        alert('⚠️ Carrinho vazio!');
        return;
    }

    const paymentMethod = document.getElementById('payment-method').value;
    const token = localStorage.getItem('authToken');

    const saleData = {
        items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        paymentMethod: paymentMethod,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    fetch('/api/sales', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(saleData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                alert(`✓ Venda finalizada!\nTotal: ${formatCurrency(data.total)}`);
                cart = [];
                updateCartDisplay();
                loadDashboard();
                loadProducts();

                // Resetar PIX se necessário
                if (paymentMethod === 'pix') {
                    selectPaymentMethod('dinheiro'); // Volta para dinheiro
                }
            } else {
                alert(data.error || 'Erro ao finalizar venda');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao finalizar venda');
        });
}

// ==================== VENDAS ====================
function loadSales() {
    const token = localStorage.getItem('authToken');

    fetch('/api/sales', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(sales => {
            const tbody = document.getElementById('sales-table-body');
            tbody.innerHTML = '';

            sales.forEach(sale => {
                const tr = document.createElement('tr');
                const date = new Date(sale.createdAt);
                tr.innerHTML = `
                    <td>#${sale.id}</td>
                    <td>${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}</td>
                    <td>${sale.items?.length || 0} itens</td>
                    <td>${getPaymentMethodIcon(sale.paymentMethod)} ${sale.paymentMethod}</td>
                    <td><strong>${formatCurrency(sale.total)}</strong></td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao carregar vendas:', error));
}

function getPaymentMethodIcon(method) {
    const icons = {
        'dinheiro': '💵',
        'cartao': '💳',
        'pix': '📱'
    };
    return icons[method] || '💰';
}

// ==================== DEVEDORES ====================
function loadDebtors() {
    const token = localStorage.getItem('authToken');

    fetch('/api/debtors', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(debtors => {
            const tbody = document.getElementById('debtors-table-body');
            tbody.innerHTML = '';

            if (debtors.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">Nenhum devedor cadastrado</td></tr>';
                return;
            }

            debtors.forEach(debtor => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>${debtor.name}<br><small>${debtor.email}</small></td>
                <td style="color: var(--danger); font-weight: bold;">${formatCurrency(debtor.debtAmount)}</td>
                <td>${debtor.cardInfo ? '**** ' + debtor.cardInfo.slice(-4) : 'Não cadastrado'}</td>
                <td><span class="status-badge active">Ativo</span></td>
                <td>
                    <button class="btn-sm btn-primary">Cobrar</button>
                </td>
            `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao carregar devedores:', error));
}

// ==================== RELATÓRIOS ====================
function loadReports() {
    console.log('Relatórios em desenvolvimento');
}



// ==================== PWA ====================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('btn-install-pwa').style.display = 'flex';
});

window.installPWA = function () {
    if (!deferredPrompt) {
        alert('📱 Para instalar no iOS, toque em "Compartilhar" e depois em "Adicionar à Tela de Início"');
        return;
    }

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA instalado');
        }
        deferredPrompt = null;
    });
};

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker registrado'))
        .catch(err => console.log('Erro ao registrar Service Worker:', err));
}

// ==================== AUTHENTICATION & NAVIGATION ====================

window.showLogin = function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm && registerForm) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }
};

window.showRegister = function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm && registerForm) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
};

window.maskCPF = function (input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = value;
};

window.login = function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));

                currentUser = data.user; // Update global variable

                // Lógica de redirecionamento
                const user = data.user;
                const authScreen = document.getElementById('auth-screen');
                const appScreen = document.getElementById('app-screen');
                const adminTab = document.getElementById('admin-nav-tab');

                if (user.isAdmin) {
                    // Admin
                    if (authScreen) authScreen.style.display = 'none';
                    if (appScreen) appScreen.style.display = 'block';
                    if (adminTab) adminTab.style.display = 'block';
                    loadDashboard();
                    loadProducts();
                    loadSales();
                    loadAdminUsers();
                } else {
                    // Usuário regular
                    if (authScreen) authScreen.style.display = 'none';
                    if (appScreen) appScreen.style.display = 'block';
                    if (adminTab) adminTab.style.display = 'none';
                    loadDashboard();
                    loadProducts();
                    loadSales();
                }

                // Atualizar nome do usuário
                const userInfo = document.getElementById('user-info');
                if (userInfo) userInfo.textContent = user.username;

            } else {
                alert(data.error || 'Erro ao fazer login');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login');
        });
};

window.register = function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const cpf = document.getElementById('register-cpf').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!username || !email || !password || !cpf) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, cpf })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('✓ Conta criada! Faça login para continuar.');
                window.showLogin();
                document.getElementById('login-email').value = email;
            } else {
                alert(data.error || 'Erro ao criar conta');
            }
        })
        .catch(error => {
            alert('Erro ao criar conta');
        });
};

// ==================== BOLETOS ====================
let currentBoletoId = null;

// Carregar boletos
function loadBoletos() {
    const token = localStorage.getItem('authToken');
    const tbody = document.getElementById('boletos-table-body');
    if (!tbody) return;

    fetch('/api/boletos', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(boletos => {
            tbody.innerHTML = '';

            if (boletos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">Nenhum boleto cadastrado</td></tr>';
                return;
            }

            boletos.forEach(boleto => {
                const tr = document.createElement('tr');
                const dueDate = new Date(boleto.dueDate);
                const today = new Date();
                const diffTime = dueDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                let statusBadge = '';
                let diasRestantes = '';

                if (boleto.status === 'pago') {
                    statusBadge = '<span class="status-badge active">✓ Pago</span>';
                    diasRestantes = '-';
                } else if (diffDays < 0) {
                    statusBadge = '<span class="status-badge inactive">✗ Vencido</span>';
                    diasRestantes = `<span style="color: var(--accent-red);">${Math.abs(diffDays)} dias atrás</span>`;
                } else if (diffDays <= 7) {
                    statusBadge = '<span class="status-badge warning">⚠ Vencendo</span>';
                    diasRestantes = `<span style="color: var(--accent-orange);">${diffDays} dias</span>`;
                } else {
                    statusBadge = '<span class="status-badge">⏳ Pendente</span>';
                    diasRestantes = `${diffDays} dias`;
                }

                tr.innerHTML = `
                    <td>${boleto.description}</td>
                    <td>R$ ${parseFloat(boleto.value).toFixed(2)}</td>
                    <td>${dueDate.toLocaleDateString('pt-BR')}</td>
                    <td>${statusBadge}</td>
                    <td>${diasRestantes}</td>
                    <td>
                        ${boleto.status !== 'pago' ? `<button onclick="markBoletoAsPaid(${boleto.id})" class="btn-sm btn-success" title="Marcar como Pago">✓ Pagar</button>` : ''}
                        <button onclick="editBoleto(${boleto.id})" class="btn-sm btn-secondary" title="Editar">✎</button>
                        <button onclick="deleteBoleto(${boleto.id})" class="btn-sm btn-danger" title="Excluir">✗</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Atualizar alerta no dashboard
            checkBoletosVencendo(boletos);
        })
        .catch(err => console.error('Erro ao carregar boletos:', err));
}

// Verificar boletos vencendo
function checkBoletosVencendo(boletos) {
    const today = new Date();
    const boletosVencendo = boletos.filter(b => {
        if (b.status === 'pago') return false;
        const dueDate = new Date(b.dueDate);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    });

    const alertDiv = document.getElementById('boletos-alert');
    const countSpan = document.getElementById('boletos-vencendo-count');

    if (boletosVencendo.length > 0 && alertDiv && countSpan) {
        alertDiv.style.display = 'flex';
        countSpan.textContent = boletosVencendo.length;
    } else if (alertDiv) {
        alertDiv.style.display = 'none';
    }
}

// Abrir modal de boleto
function openBoletoModal() {
    currentBoletoId = null;
    document.getElementById('boleto-modal-title').textContent = 'Novo Boleto';
    document.getElementById('boleto-form').reset();
    document.getElementById('boleto-id').value = '';
    document.getElementById('boleto-modal').style.display = 'flex';
}

// Fechar modal de boleto
function closeBoletoModal() {
    document.getElementById('boleto-modal').style.display = 'none';
    currentBoletoId = null;
}

// Salvar boleto
document.getElementById('boleto-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const boletoId = document.getElementById('boleto-id').value;
    const boleto = {
        description: document.getElementById('boleto-description').value,
        value: parseFloat(document.getElementById('boleto-value').value),
        dueDate: document.getElementById('boleto-duedate').value,
        status: document.getElementById('boleto-status').value
    };

    const url = boletoId ? `/api/boletos/${boletoId}` : '/api/boletos';
    const method = boletoId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(boleto)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message || data.id) {
                alert(boletoId ? '✓ Boleto atualizado!' : '✓ Boleto cadastrado!');
                closeBoletoModal();
                loadBoletos();
                loadDashboard(); // Atualizar alertas
            } else {
                alert(data.error || 'Erro ao salvar boleto');
            }
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro ao salvar boleto');
        });
});

// Editar boleto
function editBoleto(id) {
    const token = localStorage.getItem('authToken');

    fetch(`/api/boletos/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(boleto => {
            currentBoletoId = id;
            document.getElementById('boleto-modal-title').textContent = 'Editar Boleto';
            document.getElementById('boleto-id').value = id;
            document.getElementById('boleto-description').value = boleto.description;
            document.getElementById('boleto-value').value = boleto.value;
            document.getElementById('boleto-duedate').value = boleto.dueDate.split('T')[0];
            document.getElementById('boleto-status').value = boleto.status;
            document.getElementById('boleto-modal').style.display = 'flex';
        })
        .catch(err => console.error('Erro:', err));
}

// Marcar boleto como pago
function markBoletoAsPaid(id) {
    if (!confirm('Marcar este boleto como pago?')) return;

    const token = localStorage.getItem('authToken');

    fetch(`/api/boletos/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'pago' })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('✓ Boleto marcado como pago!');
                loadBoletos();
                loadDashboard();
            }
        })
        .catch(err => console.error('Erro:', err));
}

// Excluir boleto
function deleteBoleto(id) {
    if (!confirm('Tem certeza que deseja excluir este boleto?')) return;

    const token = localStorage.getItem('authToken');

    fetch(`/api/boletos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('✓ Boleto excluído!');
                loadBoletos();
                loadDashboard();
            }
        })
        .catch(err => console.error('Erro:', err));
}

// Event listener para botão de adicionar boleto
document.getElementById('add-boleto-btn')?.addEventListener('click', openBoletoModal);

// Atualizar switchTab para carregar boletos
const originalSwitchTab = switchTab;
switchTab = function (tabName) {
    originalSwitchTab(tabName);
    if (tabName === 'boletos') {
        loadBoletos();
    }
    if (tabName === 'estoque') {
        loadStockMovements();
        loadStockSummary();
    }
};

// ==================== CONTROLE DE ESTOQUE ====================
// Carregar resumo de estoque
function loadStockSummary() {
    const token = localStorage.getItem('authToken');

    fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(products => {
            const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
            const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
            const zeroStock = products.filter(p => p.stock === 0).length;

            const totalEl = document.getElementById('total-stock-items');
            const lowEl = document.getElementById('low-stock-count');
            const zeroEl = document.getElementById('zero-stock-count');

            if (totalEl) totalEl.textContent = totalItems;
            if (lowEl) lowEl.textContent = lowStock;
            if (zeroEl) zeroEl.textContent = zeroStock;
        })
        .catch(err => console.error('Erro ao carregar resumo de estoque:', err));
}

// Carregar movimentações de estoque
function loadStockMovements() {
    const token = localStorage.getItem('authToken');
    const tbody = document.getElementById('stock-movements-table-body');
    if (!tbody) return;

    fetch('/api/stock-movements', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(movements => {
            tbody.innerHTML = '';

            if (movements.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">Nenhuma movimentação registrada</td></tr>';
                return;
            }

            movements.forEach(mov => {
                const tr = document.createElement('tr');
                const date = new Date(mov.createdAt);

                let typeBadge = '';
                if (mov.type === 'entrada') {
                    typeBadge = '<span class="status-badge active">➕ Entrada</span>';
                } else if (mov.type === 'saida') {
                    typeBadge = '<span class="status-badge inactive">➖ Saída</span>';
                } else {
                    typeBadge = '<span class="status-badge warning">🔧 Ajuste</span>';
                }

                tr.innerHTML = `
                    <td>${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>${mov.productName}</td>
                    <td>${typeBadge}</td>
                    <td><strong>${mov.quantity}</strong></td>
                    <td>${mov.previousStock}</td>
                    <td><strong>${mov.newStock}</strong></td>
                    <td>${mov.reason}</td>
                `;
                tbody.appendChild(tr);
            });

            loadStockSummary();
        })
        .catch(err => console.error('Erro ao carregar movimentações:', err));
}

// Abrir modal de movimentação
function openStockMovementModal() {
    const token = localStorage.getItem('authToken');

    // Carregar produtos no select
    fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(products => {
            const select = document.getElementById('stock-product-id');
            if (!select) return;

            select.innerHTML = '<option value="">Selecione um produto...</option>';

            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (Estoque atual: ${product.stock})`;
                option.dataset.currentStock = product.stock;
                select.appendChild(option);
            });
        });

    const form = document.getElementById('stock-movement-form');
    if (form) form.reset();

    const modal = document.getElementById('stock-movement-modal');
    if (modal) modal.style.display = 'flex';
}

// Fechar modal de movimentação
function closeStockMovementModal() {
    const modal = document.getElementById('stock-movement-modal');
    if (modal) modal.style.display = 'none';
}

// Salvar movimentação de estoque
document.getElementById('stock-movement-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const productId = document.getElementById('stock-product-id').value;
    const type = document.getElementById('stock-movement-type').value;
    const quantity = parseInt(document.getElementById('stock-quantity').value);
    const reason = document.getElementById('stock-reason').value;

    if (!productId) {
        alert('Selecione um produto');
        return;
    }

    const movement = {
        productId: parseInt(productId),
        type: type,
        quantity: quantity,
        reason: reason
    };

    fetch('/api/stock-movements', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movement)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message || data.id) {
                alert('✓ Movimentação registrada com sucesso!');
                closeStockMovementModal();
                loadStockMovements();
                loadProducts(); // Atualizar lista de produtos
            } else {
                alert(data.error || 'Erro ao registrar movimentação');
            }
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro ao registrar movimentação');
        });
});

// Event listener para botão de nova movimentação
document.getElementById('add-stock-movement-btn')?.addEventListener('click', openStockMovementModal);
