let isEditing = false;
let editId = null;
let confirmCallback = null;
const baseURL = 'http://localhost:3000';

listarStatus();

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
    document.getElementById('formStatus').reset();
    document.getElementById('formTitle').textContent = 'Cadastro de Status';
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

function excluirStatus(id,descricao) {
    openConfirmModal(`Tem certeza que deseja excluir o Status "${id} - ${descricao}" ?`, () => {
        
        let endpoint = baseURL+"/status/deletar/"+id
        
        axios.delete(endpoint, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(`Status "${id}" excluído com sucesso!`, 'success');
                listarStatus();
            })
            .catch((error) => {
                showToast('Erro ao excluir Status!', 'error');
                console.error(error);
            });
    });
}

function listarStatus() {
    let endpoint = baseURL+"/status"


    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            const tableBody = document.getElementById('tableBodyStatus');
            tableBody.innerHTML = '';     
            response.data.forEach((status) => {
                const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${status.id_status}</td>
                    <td>${status.descricao}</td>
                    <td>
                        <button class="buttonAcoes" onclick="editarStatus(${status.id_status})">
                            <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Editar">
                        </button>
                        <button class="buttonAcoes" onclick="excluirStatus(${status.id_status}, '${status.descricao}')">
                            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Excluir">
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            showToast('Agendametos carregados com sucesso!', 'success');
        })
        .catch((error) => {
            const tableBody = document.getElementById('tableBodyStatus');
            tableBody.innerHTML = '';
            showToast('Erro ao listar Agendametos!', 'error');
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

function editarStatus(id) {
    
    let endpoint = baseURL+"/status/"+id;

    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            console.log(response)
            const status = response.data;
            if (!status) throw new Error('status não encontrado');
            
            openForm();
            document.getElementById('descricao').value = status.descricao;

            document.getElementById('formTitle').textContent = 'Editar Status';
            document.querySelector('.buttonCad').textContent = 'Gravar Alterações';

            isEditing = true;
            editId = id;
            
        })
        .catch((error) => {
            showToast('Erro ao carregar status para edição!', 'error');
            console.error(error);
        });
}

function addStatus(){
    const form = document.getElementById('formStatus');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

   
    const status = {
        descricao: document.getElementById('descricao').value,
    };



    if (isEditing == false){
        endpoint = baseURL+ "/status/novo" 

console.log(isEditing)
console.log(endpoint)

        axios.post(endpoint, status, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(isEditing ? 'Status atualizado com sucesso!' : 'Status cadastrado com sucesso!', 'success');
                closeForm();
                listarStatus();
            })
            .catch((error) => {
                showToast('Erro ao salvar status!', 'error');
                console.error(error);
            });
    }
    else if (isEditing == true){{
        endpoint = baseURL+ "/status/" + editId
        

        axios.put(endpoint, status, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(isEditing ? 'Status atualizado com sucesso!' : 'Status cadastrado com sucesso!', 'success');
                closeForm();
                listarStatus();
            })
            .catch((error) => {
                showToast('Erro ao salvar Status!', 'error');
                console.error(error);
            });
            isEditing = false
    }}
}

