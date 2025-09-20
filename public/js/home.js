const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    window.location.href = '/';
    return;
  }
  
  try {
    const userData = JSON.parse(user);
    document.getElementById('userName').textContent = userData.nome;
    document.getElementById('welcomeUserName').textContent = userData.nome;
    
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      document.getElementById('profilePhoto').src = savedPhoto;
    }
    
    carregarEmpenhosRecentes();
      } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
});

document.getElementById('photoInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoUrl = e.target.result;
      document.getElementById('profilePhoto').src = photoUrl;
      localStorage.setItem('profilePhoto', photoUrl);
    };
    reader.readAsDataURL(file);
  }
});

async function carregarEmpenhosRecentes() {
  try {
    const empenhosMock = [
      { id: 1, numero: '1012', descricao: 'Secretaria de Saúde - Material hospitalar' },
      { id: 2, numero: '1015', descricao: 'Secretaria de Educação - Material escolar' },
      { id: 3, numero: '1018', descricao: 'Secretaria de Urbanismo - Obras públicas' }
    ];
    
    exibirEmpenhosRecentes(empenhosMock);
    
    // Descomentar quando API estiver funcionando:
    /*
    const response = await fetch(`${API_BASE_URL}/empenhos?limit=5`);
    if (response.ok) {
      const empenhos = await response.json();
      exibirEmpenhosRecentes(empenhos);
    }
    */
  } catch (error) {
    console.error('Erro ao carregar empenhos:', error);
  }
}

function exibirEmpenhosRecentes(empenhos) {
  const container = document.getElementById('empenhosRecentes');
  container.innerHTML = '';
  
        empenhos.forEach(empenho => {
        const link = document.createElement('a');
        link.href = `/detalhes-empenho?id=${empenho.id}`;
        link.className = 'empenho-link';
        link.innerHTML = `
          <strong>Empenho ${empenho.numero}</strong><br>
          <small>${empenho.descricao.substring(0, 30)}...</small>
        `;
        container.appendChild(link);
      });
}

    function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profilePhoto');
      window.location.href = '/';
    }

