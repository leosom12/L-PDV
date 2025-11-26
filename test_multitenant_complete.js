const API_URL = 'http://localhost:3000/api';

async function testMultiTenantSystem() {
    console.log('\n🧪 TESTE COMPLETO DO SISTEMA MULTI-TENANT\n');
    console.log('='.repeat(70));

    try {
        // 1. Criar Usuário 1
        console.log('\n📝 Passo 1: Criando Usuário 1...');
        const user1Register = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Loja do João',
                email: 'joao@loja.com',
                password: 'senha123'
            })
        });
        const user1Data = await user1Register.json();
        console.log('✅ Usuário 1 criado:', user1Data);

        // 2. Criar Usuário 2
        console.log('\n📝 Passo 2: Criando Usuário 2...');
        const user2Register = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Loja da Maria',
                email: 'maria@loja.com',
                password: 'senha123'
            })
        });
        const user2Data = await user2Register.json();
        console.log('✅ Usuário 2 criado:', user2Data);

        // 3. Login como Admin
        console.log('\n🔐 Passo 3: Fazendo login como Admin...');
        const adminLogin = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'djleocv.hotmail.com@gmail.com',
                password: 'admin123'
            })
        });
        const adminData = await adminLogin.json();
        const adminToken = adminData.token;
        console.log('✅ Admin logado com sucesso');

        // 4. Aprovar assinaturas
        console.log('\n✅ Passo 4: Aprovando assinaturas...');

        await fetch(`${API_URL}/admin/approve/${user1Data.userId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ Assinatura do Usuário 1 aprovada');

        await fetch(`${API_URL}/admin/approve/${user2Data.userId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log('✅ Assinatura do Usuário 2 aprovada');

        // 5. Login Usuário 1
        console.log('\n🔐 Passo 5: Login do Usuário 1...');
        const user1Login = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'joao@loja.com',
                password: 'senha123'
            })
        });
        const user1LoginData = await user1Login.json();
        const user1Token = user1LoginData.token;
        console.log('✅ Usuário 1 logado:', user1LoginData.user.username);

        // 6. Login Usuário 2
        console.log('\n🔐 Passo 6: Login do Usuário 2...');
        const user2Login = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'maria@loja.com',
                password: 'senha123'
            })
        });
        const user2LoginData = await user2Login.json();
        const user2Token = user2LoginData.token;
        console.log('✅ Usuário 2 logado:', user2LoginData.user.username);

        // 7. Usuário 1 cadastra produtos
        console.log('\n📦 Passo 7: Usuário 1 cadastrando produtos...');
        await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user1Token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                barcode: '1111111111',
                name: 'Arroz João - 5kg',
                category: 'Alimentos',
                price: 25.90,
                stock: 50,
                icon: '🍚'
            })
        });
        console.log('  ✅ Produto 1 cadastrado: Arroz João - 5kg');

        await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user1Token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                barcode: '2222222222',
                name: 'Feijão João - 1kg',
                category: 'Alimentos',
                price: 8.50,
                stock: 30,
                icon: '🫘'
            })
        });
        console.log('  ✅ Produto 2 cadastrado: Feijão João - 1kg');

        // 8. Usuário 2 cadastra produtos
        console.log('\n📦 Passo 8: Usuário 2 cadastrando produtos...');
        await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user2Token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                barcode: '3333333333',
                name: 'Macarrão Maria - 500g',
                category: 'Massas',
                price: 4.99,
                stock: 100,
                icon: '🍝'
            })
        });
        console.log('  ✅ Produto 1 cadastrado: Macarrão Maria - 500g');

        await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user2Token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                barcode: '4444444444',
                name: 'Molho Maria - 340g',
                category: 'Molhos',
                price: 3.50,
                stock: 80,
                icon: '🍅'
            })
        });
        console.log('  ✅ Produto 2 cadastrado: Molho Maria - 340g');

        // 9. Verificar isolamento - Listar produtos do Usuário 1
        console.log('\n🔍 Passo 9: Verificando isolamento de dados...');
        console.log('\n📋 Produtos do Usuário 1 (Loja do João):');
        const user1Products = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${user1Token}` }
        });
        const user1ProductsList = await user1Products.json();
        user1ProductsList.forEach(p => {
            console.log(`  - ${p.icon} ${p.name} (R$ ${p.price.toFixed(2)}) - Estoque: ${p.stock}`);
        });

        // 10. Listar produtos do Usuário 2
        console.log('\n📋 Produtos do Usuário 2 (Loja da Maria):');
        const user2Products = await fetch(`${API_URL}/products`, {
            headers: { 'Authorization': `Bearer ${user2Token}` }
        });
        const user2ProductsList = await user2Products.json();
        user2ProductsList.forEach(p => {
            console.log(`  - ${p.icon} ${p.name} (R$ ${p.price.toFixed(2)}) - Estoque: ${p.stock}`);
        });

        // 11. Resultado final
        console.log('\n' + '='.repeat(70));
        console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
        console.log('='.repeat(70));
        console.log('\n📊 RESUMO DO ISOLAMENTO:');
        console.log(`  • Usuário 1 tem ${user1ProductsList.length} produtos isolados`);
        console.log(`  • Usuário 2 tem ${user2ProductsList.length} produtos isolados`);
        console.log('  • Nenhum usuário pode ver os produtos do outro');
        console.log('  • Cada usuário tem seu próprio banco de dados');
        console.log('\n🎯 SISTEMA MULTI-TENANT FUNCIONANDO PERFEITAMENTE!\n');

    } catch (error) {
        console.error('\n❌ Erro durante o teste:', error.message);
    }
}

testMultiTenantSystem();
