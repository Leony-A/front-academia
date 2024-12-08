let isEditing = false;
let editId = null;
let confirmCallback = null;
const baseURL = 'http://localhost:3000';

listarTreino();

function openForm() {
    const modal = document.getElementById('modalForm');
    modal.classList.add('visible');
    modal.classList.remove('hidden');
    resetForm();
}

function closeForm() {
    const modal = document.getElementById('modalForm');
    modal.classList.remove('visible');
    modal.classList.add('hidden');
}

function resetForm() {
    document.getElementById('formTreino').reset();
    document.getElementById('formTitle').textContent = 'Cadastro de Treino';
    document.querySelector('.buttonCad').textContent = 'Gravar';
    // document.getElementById('ativo').value = 'S';
    isEditing = false;
    editId = null;
}

function openConfirmModal(message, callback) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = message;

    modal.classList.add('visible');
    modal.classList.remove('hidden');

    confirmCallback = callback;

    document.getElementById('confirmYes').onclick = () => {
        if (confirmCallback) confirmCallback();
        closeConfirmModal();
    };
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    confirmCallback = null;
}

function excluirTreino(id,usuario) {
    openConfirmModal(`Tem certeza que deseja excluir o Treino "${id} - ${usuario}" ?`, () => {
        
        let endpoint = baseURL+"/treino/delete/"+id
        
        axios.delete(endpoint, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(`Treino "${id}" excluído com sucesso!`, 'success');
                listarTreino();
            })
            .catch((error) => {
                showToast('Erro ao excluir Treino!', 'error');
                console.error(error);
            });
    });
}

function listarTreino() {
    let endpoint = baseURL+"/treino"


    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            const tableBody = document.getElementById('tableBodyTreino');
            tableBody.innerHTML = '';     
            response.data.forEach((Treino) => {
                let intensidade =  '';
                switch(Treino.intensidade){
                    case 1:
                        intensidade = 'Baixa'
                        break;
                    case 2:
                        intensidade = 'Moderada'
                        break;
                    case 3:
                        intensidade = 'Alta'
                        break;
                    default:
                        intensidade = 'nenhuma'
                        break;
                }
                
                const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${Treino.id_treino}</td>
                    <td>${Treino.nome}</td>
                    <td>${Treino.duracao}</td>
                    <td>${intensidade}</td>
                    <td>${Treino.usuario}</td>
                    <td>
                        <button class="buttonAcoes" onclick="editarTreino(${Treino.id_treino})">
                            <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Editar">
                        </button>
                        <button class="buttonAcoes" onclick="excluirTreino(${Treino.id_treino}, '${Treino.nome}')">
                            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Excluir">
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            showToast('Treino carregados com sucesso!', 'success');
        })
        .catch((error) => {
            const tableBody = document.getElementById('tableBodyTreino');
            tableBody.innerHTML = '';
            showToast('Erro ao listar Treino!', 'error');
            console.error(error);
        });
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');

    // Cria o elemento de notificação
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Adiciona ao container
    toastContainer.appendChild(toast);

    // Remove após 4 segundos
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function openConfirmModal(message, callback) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').textContent = message;

    modal.classList.add('visible');
    modal.classList.remove('hidden');

    confirmCallback = callback;
    document.getElementById('confirmYes').onclick = () => {
        if (confirmCallback) confirmCallback();
        closeConfirmModal();
    };
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    confirmCallback = null;
}

function editarTreino(id) {
    
    let endpoint = baseURL+"/treino/"+id;

    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            console.log(response)
            const Treino = response.data;
            if (!Treino) throw new Error('Treino não encontrado');
            
            openForm();
            document.getElementById('nome').value = Treino.nome;
            document.getElementById('descricao').value = Treino.descricao;
            document.getElementById('duracao').value = Treino.duracao;
            document.getElementById('intensidade').value = Treino.intensidade;
            document.getElementById('usuario').value = Treino.usuario;

            document.getElementById('formTitle').textContent = 'Editar Treino';
            document.querySelector('.buttonCad').textContent = 'Gravar Alterações';

            isEditing = true;
            editId = id;
            
        })
        .catch((error) => {
            showToast('Erro ao carregar Treino para edição!', 'error');
            console.error(error);
        });
}

function addTreino(){
    const form = document.getElementById('formTreino');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

   
    const Treino = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        duracao: parseInt(document.getElementById('duracao').value),
        intensidade: parseInt(document.getElementById('intensidade').value),
        usuario: document.getElementById('usuario').value,
    };



    if (isEditing == false){
        endpoint = baseURL+ "/treino/novo" 

console.log(isEditing)
console.log(endpoint)

        axios.post(endpoint, Treino, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(isEditing ? 'Treino atualizado com sucesso!' : 'Treino cadastrado com sucesso!', 'success');
                closeForm();
                listarTreino();
            })
            .catch((error) => {
                showToast('Erro ao salvar Treino!', 'error');
                console.error(error);
            });
    }
    else if (isEditing == true){{
        endpoint = baseURL+ "/treino/" + editId
        

        axios.put(endpoint, Treino, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(isEditing ? 'Treino atualizado com sucesso!' : 'Treino cadastrado com sucesso!', 'success');
                closeForm();
                listarTreino();
            })
            .catch((error) => {
                showToast('Erro ao salvar Treino!', 'error');
                console.error(error);
            });
            isEditing = false
    }}
}
