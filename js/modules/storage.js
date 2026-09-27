// storage.js: leitura e gravação dos dados no localStorage do navegador

const CHAVE_CADASTROS = "conectaFuturo:cadastros";
const CHAVE_RASCUNHO = "conectaFuturo:rascunho";

// O localStorage só guarda texto: JSON.stringify para gravar, JSON.parse para ler
function ler(chave, valorPadrao) {
    try {
        return JSON.parse(localStorage.getItem(chave)) ?? valorPadrao;
    } catch {
        return valorPadrao; // dado corrompido ou storage bloqueado: segue sem quebrar
    }
}

function gravar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

// Transforma o formulário num objeto simples { nome: "...", cpf: "...", ... }
export function lerDadosDoFormulario(form) {
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData);
    dados.disponibilidade = formData.getAll("disponibilidade"); // vários checkboxes com o mesmo name
    return dados;
}

// ---------- Cadastros concluídos ----------
export function listarCadastros() {
    return ler(CHAVE_CADASTROS, []);
}

export function salvarCadastro(dados) {
    const cadastros = listarCadastros();
    cadastros.push({ ...dados, id: Date.now(), criadoEm: new Date().toISOString() });
    gravar(CHAVE_CADASTROS, cadastros);
}

export function cpfJaCadastrado(cpf) {
    return listarCadastros().some((cadastro) => cadastro.cpf === cpf);
}

// ---------- Rascunho: guarda o preenchimento para não perder se a pessoa sair ----------
export function salvarRascunho(form) {
    const { lgpd, ...rascunho } = lerDadosDoFormulario(form); // o consentimento não fica salvo
    gravar(CHAVE_RASCUNHO, rascunho);
}

export function restaurarRascunho(form) {
    const rascunho = ler(CHAVE_RASCUNHO, null);
    if (!rascunho) return;

    for (const [nome, valor] of Object.entries(rascunho)) {
        if (nome === "disponibilidade") {
            form.querySelectorAll('input[name="disponibilidade"]')
                .forEach((opcao) => { opcao.checked = valor.includes(opcao.value); });
        } else if (form.elements[nome]) {
            form.elements[nome].value = valor; // funciona também para o grupo de radios "tipo"
        }
    }
}

export function apagarRascunho() {
    localStorage.removeItem(CHAVE_RASCUNHO);
}