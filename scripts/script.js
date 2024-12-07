let isEditing = false;
let editId = null;
let confirmCallback = null;
const baseURL = 'http://localhost:3000';

listarAgendametos();
listarSelectStatus();
listarSelectTreino();

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
    document.getElementById('formAgendamento').reset();
    document.getElementById('formTitle').textContent = 'Cadastro de Agendametos';
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

function excluirAgendamento(id,usuario) {
    openConfirmModal(`Tem certeza que deseja excluir o agendamento "${id} - ${usuario}" ?`, () => {
        
        let endpoint = baseURL+"/agendamento/deletar/"+id
        
        axios.delete(endpoint, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(`agendamento "${id}" excluído com sucesso!`, 'success');
                listarAgendametos();
            })
            .catch((error) => {
                showToast('Erro ao excluir agendamento!', 'error');
                console.error(error);
            });
    });
}

function listarAgendametos() {
    let endpoint = baseURL+"/agendamento"


    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            const tableBody = document.getElementById('tableBodyAgendamento');
            tableBody.innerHTML = '';     
            response.data.forEach((agendamento) => {
                const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${agendamento.id_agendamento}</td>
                    <td>${agendamento.usuario}</td>
                    <td>${agendamento.treino.nome}</td>
                    <td>${agendamento.data}</td>
                    <td>${agendamento.horario}</td>
                    <td>${agendamento.status.descricao}</td>
                    <td>
                        <button class="buttonAcoes" onclick="editarAgendamento(${agendamento.id_agendamento})">
                            <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Editar">
                        </button>
                        <button class="buttonAcoes" onclick="excluirAgendamento(${agendamento.id_agendamento}, '${agendamento.usuario}')">
                            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Excluir">
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            showToast('Agendametos carregados com sucesso!', 'success');
        })
        .catch((error) => {
            const tableBody = document.getElementById('tableBodyAgendamento');
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

function editarAgendamento(id) {
    
    let endpoint = baseURL+"/agendamento/"+id;

    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            console.log(response)
            const agendamento = response.data;
            if (!agendamento) throw new Error('agendamento não encontrado');
            
            openForm();
            document.getElementById('usuario').value = agendamento.usuario;
            document.getElementById('treino').value = agendamento.treino.id_treino;
            document.getElementById('data').value = agendamento.data;
            document.getElementById('horario').value = agendamento.horario;
            document.getElementById('status').value = agendamento.status.id_status;

            document.getElementById('formTitle').textContent = 'Editar agendamento';
            document.querySelector('.buttonCad').textContent = 'Gravar Alterações';

            isEditing = true;
            editId = id;
            
        })
        .catch((error) => {
            showToast('Erro ao carregar agendamento para edição!', 'error');
            console.error(error);
        });
}

function addAgendamento(){
    const form = document.getElementById('formAgendamento');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

   
    const agendamento = {
        usuario: document.getElementById('usuario').value,
        id_treino: parseInt(document.getElementById('treino').value),
        data: document.getElementById('data').value,
        horario: document.getElementById('horario').value,
        id_status: parseInt(document.getElementById('status').value)
    };



    if (isEditing == false){
        endpoint = baseURL+ "/agendamento/novo" 

console.log(isEditing)
console.log(endpoint)

        axios.post(endpoint, agendamento, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(isEditing ? 'agendamento atualizado com sucesso!' : 'agendamento cadastrado com sucesso!', 'success');
                closeForm();
                listarAgendametos();
            })
            .catch((error) => {
                showToast('Erro ao salvar agendamento!', 'error');
                console.error(error);
            });
    }
    else if (isEditing == true){{
        endpoint = baseURL+ "/agendamento/" + editId
        

        axios.put(endpoint, agendamento, {
            headers: {
                'Content-Type': 'application/json', // Cabeçalhos comuns
            }
        })
            .then(() => {
                showToast(isEditing ? 'Agendamento atualizado com sucesso!' : 'agendamento cadastrado com sucesso!', 'success');
                closeForm();
                listarAgendametos();
            })
            .catch((error) => {
                showToast('Erro ao salvar agendamento!', 'error');
                console.error(error);
            });
            isEditing = false
    }}
}

function listarSelectStatus(){
    let endpoint = baseURL+"/status"


    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            const selectStatus = document.getElementById('status');
            selectStatus.innerHTML = ''; // Limpa o conteúdo existente no select
            response.data.forEach((item) => {
                const option = document.createElement('option');
                option.textContent = item.descricao; // Substitua por um atributo correto, como `nome_status`
                option.setAttribute('value', item.id_status);
                selectStatus.appendChild(option); // Adiciona a nova opção ao select
            });
            showToast('Status carregados com sucesso!', 'success');
        })
        .catch((error) => {
            const status = document.getElementById('status');
            status.innerHTML = '';
            showToast('Erro ao listar Treinos!', 'error');
            console.error(error);
        });
}

function listarSelectTreino(){
    let endpoint = baseURL+"/treino"


    axios.get(endpoint, {
        headers: {
            'Content-Type': 'application/json', // Cabeçalhos comuns
        }
    })
        .then((response) => {
            const selectTreino = document.getElementById('treino');
            selectTreino.innerHTML = ''; // Limpa o conteúdo existente no select
            response.data.forEach((item) => {
                const option = document.createElement('option');
                option.textContent = item.nome; // Substitua por um atributo correto, como `nome_status`
                option.setAttribute('value', item.id_treino);
                selectTreino.appendChild(option); // Adiciona a nova opção ao select
            });
            showToast('Treino carregados com sucesso!', 'success');
        })
        .catch((error) => {
            const treino = document.getElementById('treino');
            treino.innerHTML = '';
            showToast('Erro ao listar Treinos!', 'error');
            console.error(error);
        });
}

