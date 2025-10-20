class Funcionario {
    constructor(nome, idade, cargo, salario) {
        this.nome = nome;
        this.idade = idade;
        this.cargo = cargo;
        this.salario = salario;
    }

    toString() {
        return `${this.nome} — ${this.idade} anos — ${this.cargo} — Salário: ${this.salario}`;
    }

    // Métodos para atualizar atributos conforme o enunciado
    setNome(nome) {
        this.nome = nome;
    }

    setIdade(idade) {
        this.idade = idade;
    }

    setCargo(cargo) {
        this.cargo = cargo;
    }

    setSalario(salario) {
        this.salario = salario;
    }

    // Atualiza múltiplos campos de uma vez
    updateFrom({ nome, idade, cargo, salario } = {}) {
        if (nome !== undefined) this.setNome(nome);
        if (idade !== undefined) this.setIdade(idade);
        if (cargo !== undefined) this.setCargo(cargo);
        if (salario !== undefined) this.setSalario(salario);
    }
}

const funcionarios = [];

let editingIndex = null; // índice do funcionário em edição (null quando não em edição)

// Funções auxiliares (arrow functions) para manipular o array de funcionários
const findByIndex = (i) => (i >= 0 && i < funcionarios.length) ? funcionarios[i] : null;

const findByName = (name) => funcionarios.filter(f => String(f.nome).toLowerCase().includes(String(name).toLowerCase()));

const removeByIndex = (i) => {
    if (i < 0 || i >= funcionarios.length) return false;
    funcionarios.splice(i, 1);
    // ajusta editingIndex se necessário
    if (editingIndex === i) {
        exitEditMode();
        clearForm();
    } else if (editingIndex !== null && editingIndex > i) {
        editingIndex -= 1;
    }
    renderTable();
    return true;
};

const updateByIndex = (i, data = {}) => {
    const f = findByIndex(i);
    if (!f) return false;
    f.updateFrom(data);
    return true;
};

const renderTable = () => {
    const tableBody = document.querySelector('#tabela-funcionarios tbody');
    tableBody.innerHTML = '';
    funcionarios.forEach((funcionario, index) => {
        const tr = document.createElement('tr');

        const tdNome = document.createElement('td');
        tdNome.textContent = funcionario.nome;

        const tdIdade = document.createElement('td');
        tdIdade.textContent = funcionario.idade;

        const tdCargo = document.createElement('td');
        tdCargo.textContent = funcionario.cargo;

        const tdSalario = document.createElement('td');
        tdSalario.textContent = Number(funcionario.salario).toFixed(2);

        const tdAcoes = document.createElement('td');

        // Botão Editar: carrega os dados no formulário para edição
        const btnEditar = document.createElement('button');
        btnEditar.type = 'button';
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => {
            document.getElementById('nome').value = funcionario.nome;
            document.getElementById('idade').value = funcionario.idade;
            document.getElementById('cargo').value = funcionario.cargo;
            document.getElementById('salario').value = funcionario.salario;
            editingIndex = index;
            if (typeof cadastrarBtn !== 'undefined' && cadastrarBtn) {
                cadastrarBtn.textContent = 'Atualizar';
            }
        };

        // Botão Excluir: remove o funcionário
        const btnExcluir = document.createElement('button');
        btnExcluir.type = 'button';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => {
            removeByIndex(index);
        };

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(document.createTextNode(' '));
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdNome);
        tr.appendChild(tdIdade);
        tr.appendChild(tdCargo);
        tr.appendChild(tdSalario);
        tr.appendChild(tdAcoes);

        tableBody.appendChild(tr);
    });
};

const clearForm = () => {
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('salario').value = '';
};

const exitEditMode = () => {
    editingIndex = null;
    if (typeof cadastrarBtn !== 'undefined' && cadastrarBtn) {
        cadastrarBtn.textContent = 'Cadastrar';
    }
};

const handleRegister = () => {
    const nomeEl = document.getElementById('nome');
    const idadeEl = document.getElementById('idade');
    const cargoEl = document.getElementById('cargo');
    const salarioEl = document.getElementById('salario');

    const nome = nomeEl.value.trim();
    const idade = parseInt(idadeEl.value, 10);
    const cargo = cargoEl.value.trim();
    const salario = parseFloat(salarioEl.value);

    if (!nome) {
        alert('Informe o nome.');
        return;
    }
    if (!Number.isInteger(idade) || idade <= 0) {
        alert('Informe uma idade válida.');
        return;
    }
    if (!cargo) {
        alert('Informe o cargo.');
        return;
    }
    if (Number.isNaN(salario) || salario < 0) {
        alert('Informe um salário válido (>= 0).');
        return;
    }

    if (editingIndex === null) {
        funcionarios.push(new Funcionario(nome, idade, cargo, salario));
    } else {
        if (updateByIndex(editingIndex, { nome, idade, cargo, salario })) {
            exitEditMode();
        }
    }

    clearForm();
    renderTable();
};

document.addEventListener('DOMContentLoaded', () => {
    const cadastrarBtn = document.getElementById('cadastrarBtn');
    const tabelaBody = document.querySelector('#tabela-funcionarios tbody');
    const formEl = document.getElementById('form-funcionario');

    // Clique no botão cadastrar
    cadastrarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleRegister();
    });

    // Permitir submissão ao pressionar Enter em qualquer campo do formulário
    formEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRegister();
        }
    });

    createReportsUI(); 
    renderTable();
});

const nomesOrdenados = () => funcionarios
    .map(s => s.nome)
    .slice()
    .sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' }));

const mediaIdades = () => {
    if (funcionarios.length === 0) return 0;
    const soma = funcionarios.reduce((acc, s) => acc + Number(s.idade || 0), 0);
    return soma / funcionarios.length;
};

const mediaSalarios = () => {
    if (funcionarios.length === 0) return 0;
    const soma = funcionarios.reduce((acc, s) => acc + Number(s.salario || 0), 0);
    return soma / funcionarios.length;
};

const listarAcimaMediaSalarial = () => {
    const media = mediaSalarios();
    return funcionarios.filter(s => Number(s.salario || 0) > media).map(s => `${s.nome} — ${Number(s.salario).toFixed(2)}`);
};

// Relatórios usando streams JS (map, filter, reduce) e new Set
const funcionariosComSalarioMaiorQue = (valor) =>
    funcionarios
        .filter(f => Number(f.salario || 0) > Number(valor))
        .map(f => `${f.nome} — R$ ${Number(f.salario).toFixed(2)}`);

const cargosUnicos = () => Array.from(
    new Set(
        funcionarios
            .map(f => (f.cargo || '').trim())
            .filter(c => c.length > 0)
    )
).sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' }));

const nomesMaiusculo = () => funcionarios.map(f => String(f.nome).toUpperCase());

const quantidadePorCargo = () => funcionarios.reduce((acc, s) => {
    const cargo = s.cargo || '—';
    acc[cargo] = (acc[cargo] || 0) + 1;
    return acc;
}, {});

const showReport = (title, content) => {
    let output = document.getElementById('relatorios-output');
    if (!output) {
        console.error('Elemento relatorios-output não encontrado');
        return;
    }
    const titleEl = document.createElement('h4');
    titleEl.textContent = title;
    const pre = document.createElement('pre');
    pre.textContent = content;
    output.innerHTML = '';
    output.appendChild(titleEl);
    output.appendChild(pre);
};

function createReportsUI() {
    // Reconstruir apenas os quatro botões de relatório obrigatórios
    const reportsControls = document.querySelector('#relatorios-container > div');
    if (!reportsControls) return console.warn('Área de controles de relatórios não encontrada');

    // limpar controles existentes
    reportsControls.innerHTML = '';

    // 1) Listar funcionários com salário > R$ 5.000,00
    const btnSalario5000 = document.createElement('button');
    btnSalario5000.type = 'button';
    btnSalario5000.textContent = 'Salário > R$ 5.000,00';
    btnSalario5000.addEventListener('click', () => {
        const lista = funcionariosComSalarioMaiorQue(5000);
        showReport('Funcionários com salário > R$ 5.000,00', lista.length ? lista.join('\n') : 'Nenhum funcionário');
    });
    reportsControls.appendChild(btnSalario5000);

    // 2) Média salarial dos funcionários
    const btnMediaSalarial = document.createElement('button');
    btnMediaSalarial.type = 'button';
    btnMediaSalarial.textContent = 'Média salarial';
    btnMediaSalarial.addEventListener('click', () => {
        showReport('Média dos salários', mediaSalarios().toFixed(2));
    });
    reportsControls.appendChild(btnMediaSalarial);

    // 3) Cargos únicos
    const btnCargosUnicos = document.createElement('button');
    btnCargosUnicos.type = 'button';
    btnCargosUnicos.textContent = 'Cargos únicos';
    btnCargosUnicos.addEventListener('click', () => {
        const cargos = cargosUnicos();
        showReport('Cargos únicos', cargos.length ? cargos.join('\n') : 'Nenhum cargo');
    });
    reportsControls.appendChild(btnCargosUnicos);

    // 4) Nomes em maiúsculo
    const btnNomesMaiusculo = document.createElement('button');
    btnNomesMaiusculo.type = 'button';
    btnNomesMaiusculo.textContent = 'Nomes MAIÚSCULOS';
    btnNomesMaiusculo.addEventListener('click', () => {
        const nomes = nomesMaiusculo();
        showReport('Nomes em MAIÚSCULO', nomes.length ? nomes.join('\n') : 'Nenhum funcionário');
    });
    reportsControls.appendChild(btnNomesMaiusculo);

    // botão Limpar
    const btnLimpar = document.createElement('button');
    btnLimpar.type = 'button';
    btnLimpar.id = 'btn-limpar-relatorio';
    btnLimpar.textContent = 'Limpar';
    btnLimpar.addEventListener('click', () => {
        const output = document.getElementById('relatorios-output');
        if (output) output.innerHTML = '';
    });
    reportsControls.appendChild(btnLimpar);
}
