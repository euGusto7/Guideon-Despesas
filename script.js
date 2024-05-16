const formReceita = document.getElementById('formReceita');
const formDespesa = document.getElementById('formDespesa');
const listaReceitas = document.getElementById('listaReceitas');
const listaDespesas = document.getElementById('listaDespesas');
const saldoTotal = document.getElementById('saldoTotal');
const mesDespesas = document.getElementById('mesDespesas');
const botaoFiltrar = document.getElementById('botaoFiltrar');

let saldo = localStorage.getItem('saldo') ? parseFloat(localStorage.getItem('saldo')) : 0;
let receitas = localStorage.getItem('receitas') ? JSON.parse(localStorage.getItem('receitas')) : [];
let despesas = localStorage.getItem('despesas') ? JSON.parse(localStorage.getItem('despesas')) : [];

atualizarSaldo();
atualizarListaReceitas();
atualizarListaDespesas();

formReceita.addEventListener('submit', (e) => {
    e.preventDefault();
    const valorReceita = parseFloat(document.getElementById('valorReceita').value);
    const dataReceita = document.getElementById('dataReceita').value || new Date().toISOString().slice(0, 10);
    saldo += valorReceita;
    localStorage.setItem('saldo', saldo);
    receitas.push({valor: valorReceita, data: dataReceita});
    localStorage.setItem('receitas', JSON.stringify(receitas));
    atualizarSaldo();
    atualizarListaReceitas();
    document.getElementById('valorReceita').value = "";
    document.getElementById('dataReceita').value = "";
});

formDespesa.addEventListener('submit', (e) => {
    e.preventDefault();
    const nomeDespesa = document.getElementById('nomeDespesa').value;
    const valorDespesa = parseFloat(document.getElementById('valorDespesa').value);
    const dataDespesa = document.getElementById('dataDespesa').value || new Date().toISOString().slice(0, 10);
    saldo -= valorDespesa;
    localStorage.setItem('saldo', saldo);
    despesas.push({nome: nomeDespesa, valor: valorDespesa, data: dataDespesa});
    localStorage.setItem('despesas', JSON.stringify(despesas));
    atualizarSaldo();
    atualizarListaDespesas();
    document.getElementById('nomeDespesa').value = "";
    document.getElementById('valorDespesa').value = "";
    document.getElementById('dataDespesa').value = "";
});

botaoFiltrar.addEventListener('click', () => {
    const mesSelecionado = mesDespesas.value;
    const receitasFiltradas = receitas.filter(receita => receita.data.startsWith(mesSelecionado));
    const despesasFiltradas = despesas.filter(despesa => despesa.data.startsWith(mesSelecionado));
    atualizarSaldo(receitasFiltradas, despesasFiltradas);
    atualizarListaReceitas(receitasFiltradas);
    atualizarListaDespesas(despesasFiltradas);
});

function atualizarSaldo(receitasArray = receitas, despesasArray = despesas) {
    const saldoReceitas = receitasArray.reduce((total, receita) => total + receita.valor, 0);
    const saldoDespesas = despesasArray.reduce((total, despesa) => total + despesa.valor, 0);
    saldo = saldoReceitas - saldoDespesas;
    saldoTotal.textContent = `Saldo: R$ ${saldo.toFixed(2)}`;
}

function atualizarListaReceitas(receitasArray = receitas) {
    listaReceitas.innerHTML = "";
    receitasArray.forEach((receita, index) => {
        const novaReceita = document.createElement('li');
        novaReceita.textContent = `Receita: R$ ${receita.valor.toFixed(2)} - ${receita.data}`;
        const botaoDeletar = document.createElement('button');
        botaoDeletar.textContent = 'Deletar';
        botaoDeletar.addEventListener('click', () => {
            saldo -= receita.valor;
            localStorage.setItem('saldo', saldo);
            receitas.splice(index, 1);
            localStorage.setItem('receitas', JSON.stringify(receitas));
            atualizarSaldo();
            atualizarListaReceitas();
        });
        novaReceita.appendChild(botaoDeletar);
        listaReceitas.appendChild(novaReceita);
    });
}

function atualizarListaDespesas(despesasArray = despesas) {
    listaDespesas.innerHTML = "";
    despesasArray.forEach((despesa, index) => {
        const novaDespesa = document.createElement('li');
        novaDespesa.textContent = `${despesa.nome}: R$ ${despesa.valor.toFixed(2)} - ${despesa.data}`;
        const botaoDeletar = document.createElement('button');
        botaoDeletar.textContent = 'Deletar';
        botaoDeletar.addEventListener('click', () => {
            saldo += despesa.valor;
            localStorage.setItem('saldo', saldo);
            despesas.splice(index, 1);
            localStorage.setItem('despesas', JSON.stringify(despesas));
            atualizarSaldo();
            atualizarListaDespesas();
        });
        novaDespesa.appendChild(botaoDeletar);
        listaDespesas.appendChild(novaDespesa);
    });
}
