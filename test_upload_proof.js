const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api';

// Criar uma imagem de teste simples (1x1 pixel PNG)
const createTestImage = () => {
    // PNG de 1x1 pixel vermelho em base64
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    return base64Image;
};

async function testUploadProof() {
    console.log('='.repeat(60));
    console.log('🧪 TESTE DE ENVIO DE COMPROVANTE');
    console.log('='.repeat(60));
    console.log('');

    try {
        // 1. Fazer login com usuário de teste
        console.log('1️⃣ Fazendo login...');
        const loginResponse = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'teste@teste.com',
                password: '123456'
            })
        });

        let authToken;
        let userId;

        if (loginResponse.status === 400) {
            // Usuário não existe, vamos criar
            console.log('   ℹ️  Usuário não existe, criando novo usuário...');
            
            const registerResponse = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'Teste Upload',
                    email: 'teste@teste.com',
                    password: '123456'
                })
            });

            if (!registerResponse.ok) {
                const error = await registerResponse.json();
                throw new Error(`Erro ao registrar: ${error.error}`);
            }

            console.log('   ✅ Usuário criado com sucesso!');
            
            // Fazer login novamente
            const loginRetry = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'teste@teste.com',
                    password: '123456'
                })
            });

            const loginData = await loginRetry.json();
            authToken = loginData.token;
            userId = loginData.user.id;
            console.log('   ✅ Login realizado com sucesso!');
        } else {
            const loginData = await loginResponse.json();
            authToken = loginData.token;
            userId = loginData.user.id;
            console.log('   ✅ Login realizado com sucesso!');
        }

        console.log(`   📧 Email: teste@teste.com`);
        console.log(`   🆔 User ID: ${userId}`);
        console.log('');

        // 2. Enviar comprovante
        console.log('2️⃣ Enviando comprovante...');
        const proofData = createTestImage();
        
        const uploadResponse = await fetch(`${API_URL}/subscription/upload-proof`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                proofData: proofData,
                fileName: 'comprovante_teste.png',
                fileType: 'image/png'
            })
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok) {
            console.log('   ✅ Comprovante enviado com sucesso!');
            console.log(`   📝 Mensagem: ${uploadResult.message}`);
            console.log('');

            // 3. Verificar se o comprovante foi salvo (como admin)
            console.log('3️⃣ Verificando comprovante (como admin)...');
            
            // Login como admin
            const adminLoginResponse = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'djleocv.hotmail.com@gmail.com',
                    password: 'admin123'
                })
            });

            const adminData = await adminLoginResponse.json();
            const adminToken = adminData.token;

            // Buscar comprovante
            const proofResponse = await fetch(`${API_URL}/admin/proof/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (proofResponse.ok) {
                const proofResult = await proofResponse.json();
                console.log('   ✅ Comprovante encontrado no banco de dados!');
                console.log(`   📄 Tipo: ${proofResult.fileType}`);
                console.log(`   📊 Tamanho dos dados: ${proofResult.proofData.length} caracteres`);
                console.log('');

                // 4. Verificar status da assinatura
                console.log('4️⃣ Verificando status da assinatura...');
                const usersResponse = await fetch(`${API_URL}/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                });

                const users = await usersResponse.json();
                const testUser = users.find(u => u.id === userId);

                if (testUser) {
                    console.log('   ✅ Status da assinatura:');
                    console.log(`   📌 Status: ${testUser.sub_status || 'nenhum'}`);
                    console.log(`   📅 Expira em: ${testUser.sub_expires || 'N/A'}`);
                    console.log('');
                }

                console.log('='.repeat(60));
                console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
                console.log('='.repeat(60));
                console.log('');
                console.log('📋 Resumo:');
                console.log('   ✓ Login funcionando');
                console.log('   ✓ Upload de comprovante funcionando');
                console.log('   ✓ Armazenamento no banco de dados funcionando');
                console.log('   ✓ Visualização de comprovante (admin) funcionando');
                console.log('');
                console.log('🎉 O sistema de envio de comprovante está FUNCIONANDO!');
                console.log('');

            } else {
                const error = await proofResponse.json();
                console.log('   ❌ Erro ao buscar comprovante:', error.error);
            }

        } else {
            console.log('   ❌ Erro ao enviar comprovante!');
            console.log(`   📝 Erro: ${uploadResult.error}`);
        }

    } catch (error) {
        console.log('');
        console.log('❌ ERRO NO TESTE:', error.message);
        console.log('');
    }
}

// Executar teste
testUploadProof();
