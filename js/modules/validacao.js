// validacao.js: máscaras, regras de consistência e mensagens de erro do cadastro
import { cpfJaCadastrado } from "./storage.js";
// ---------- Máscaras: formatam o valor enquanto a pessoa digita ----------
const mascaras = {
    cpf: (valor) => valor.replace(/\D/g, "").slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
    telefone: (valor) => valor.replace(/\D/g, "").slice(0, 11)
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2"),
    cep: (valor) => valor.replace(/\D/g, "").slice(0, 8)
        .replace(/(\d{5})(\d)/, "$1-$2"),
};

// ---------- Funções de apoio ----------
function somenteNumeros(texto) {
    return texto.replace(/\D/g, "");
}

// Confere os dois dígitos verificadores do CPF (não basta ter o formato certo)
function cpfValido(cpf) {
    const numeros = somenteNumeros(cpf);
    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) return false; // 111.111.111-11 etc.

    const calcularDigito = (base) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
            soma += Number(base[i]) * (base.length + 1 - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    return calcularDigito(numeros.slice(0, 9)) === Number(numeros[9])
        && calcularDigito(numeros.slice(0, 10)) === Number(numeros[10]);
}

function calcularIdade(dataTexto) {
    const nascimento = new Date(dataTexto + "T00:00");
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const aindaNaoFezAniversario =
        hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
    if (aindaNaoFezAniversario) idade--;
    return idade;
}

// ---------- Regras específicas de cada campo (retornam a mensagem de erro ou "") ----------
const regras = {
    nome: (campo) =>
        campo.value.trim().split(/\s+/).length < 2 ? "Informe nome e sobrenome." : "",
    cpf: (campo) => {
        if (!cpfValido(campo.value)) return "CPF inválido. Confira os números digitados.";
        if (cpfJaCadastrado(campo.value)) return "Este CPF já está cadastrado.";
        return "";
    },
    nascimento: (campo) => {
        const idade = calcularIdade(campo.value);
        if (idade < 0) return "A data de nascimento não pode ser no futuro.";
        if (idade < 14) return "É preciso ter pelo menos 14 anos para se cadastrar.";
        if (idade > 105) return "Confira o ano de nascimento.";
        return "";
    },
    telefone: (campo) =>
        somenteNumeros(campo.value).length === 11 ? "" : "Informe DDD + 9 dígitos. Ex.: (84) 99999-0000.",
    cep: (campo) =>
        somenteNumeros(campo.value).length === 8 ? "" : "O CEP deve ter 8 números. Ex.: 59123-399.",
    email: (campo) =>
        campo.validity.typeMismatch ? "Informe um e-mail válido. Ex.: maria@exemplo.com.br." : "",
};

// ---------- Exibição das mensagens ----------
function exibirErro(campo, mensagem) {
    const emGrupo = campo.type === "radio" || campo.type === "checkbox";
    const local = emGrupo ? campo.closest("fieldset") : campo.parentElement;
    const idAviso = `erro-${campo.name}`;
    let aviso = document.getElementById(idAviso);

    if (!mensagem) {
        aviso?.remove();
        campo.removeAttribute("aria-invalid");
        campo.removeAttribute("aria-describedby");
        return;
    }

    if (!aviso) {
        aviso = document.createElement("span");
        aviso.id = idAviso;
        aviso.className = "erro-campo";
        local.append(aviso);
    }
    aviso.textContent = mensagem;
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", idAviso); // leitor de tela lê a mensagem junto com o campo
}

// Valida um campo: primeiro o obrigatório, depois a regra específica
function validarCampo(campo) {
    campo.setCustomValidity("");
    let mensagem = "";

    if (campo.validity.valueMissing) {
        mensagem = campo.type === "radio" ? "Escolha uma das opções."
                 : campo.type === "checkbox" ? "Marque esta opção para continuar."
                 : "Este campo é obrigatório.";
    } else if (campo.value && regras[campo.name]) {
        mensagem = regras[campo.name](campo);
    }

    if (!mensagem && !campo.validity.valid) {
        mensagem = campo.validationMessage; // demais regras nativas (minlength, min, max...)
    }

    campo.setCustomValidity(mensagem);
    exibirErro(campo, mensagem);
    return mensagem === "";
}

// Consistência entre campos: quem vai ser voluntário precisa dizer quando pode ajudar
function validarConsistencia(form) {
    const tipo = form.elements.tipo.value;
    const querVoluntariar = tipo === "voluntario" || tipo === "ambos";

    const horas = form.elements.horas;
    const msgHoras = querVoluntariar && !horas.value
        ? "Voluntários precisam informar as horas disponíveis por semana." : "";
    if (msgHoras || horas.validity.customError) {
        horas.setCustomValidity(msgHoras);
        exibirErro(horas, msgHoras);
    }

    const opcoes = [...form.querySelectorAll('input[name="disponibilidade"]')];
    const algumaMarcada = opcoes.some((opcao) => opcao.checked);
    const msgDisp = querVoluntariar && !algumaMarcada
        ? "Marque pelo menos um período de disponibilidade." : "";
    opcoes[0].setCustomValidity(msgDisp);
    exibirErro(opcoes[0], msgDisp);

    return !msgHoras && !msgDisp;
}

// Caixa de resumo no topo do formulário (usa o estilo .alerta-erro do design system)
function mostrarResumo(form, quantidade) {
    let resumo = document.getElementById("resumo-erros");
    if (quantidade === 0) {
        resumo?.remove();
        return;
    }
    if (!resumo) {
        resumo = document.createElement("div");
        resumo.id = "resumo-erros";
        resumo.className = "alerta alerta-erro";
        resumo.setAttribute("role", "alert");
        form.before(resumo);
    }
    resumo.innerHTML = `<strong>Não foi possível enviar:</strong> confira ${quantidade === 1 ? "o campo marcado" : `os ${quantidade} campos marcados`} em vermelho.`;
}

function limparErros(form) {
    form.querySelectorAll(".erro-campo").forEach((aviso) => aviso.remove());
    [...form.elements].forEach((campo) => {
        campo.setCustomValidity?.("");
        campo.removeAttribute("aria-invalid");
        campo.removeAttribute("aria-describedby");
    });
    mostrarResumo(form, 0);
    delete form.dataset.enviado;
}

// ---------- Eventos (delegação: o formulário é recriado pelo router a cada visita) ----------
export function iniciarValidacao(aoEnviarComSucesso) {
    document.addEventListener("input", (evento) => {
        const campo = evento.target;
        const form = campo.closest("#form-cadastro");
        if (!form) return;

        if (mascaras[campo.name]) campo.value = mascaras[campo.name](campo.value);
        if (campo.hasAttribute("aria-invalid")) validarCampo(campo); // corrige o aviso em tempo real
        if (form.dataset.enviado) validarConsistencia(form);
    });

    // focusout "borbulha" até o document (o blur não), por isso é usado aqui
    document.addEventListener("focusout", (evento) => {
        const campo = evento.target;
        if (!campo.closest("#form-cadastro") || !campo.name) return;
        if (campo.type === "radio" || campo.type === "checkbox") return;
        validarCampo(campo);
    });

    document.addEventListener("change", (evento) => {
        const campo = evento.target;
        const form = campo.closest("#form-cadastro");
        if (!form || (campo.type !== "radio" && campo.type !== "checkbox")) return;
        if (document.getElementById(`erro-${campo.name}`)) validarCampo(campo);
        if (form.dataset.enviado) validarConsistencia(form);
    });

    document.addEventListener("submit", (evento) => {
        const form = evento.target;
        if (form.id !== "form-cadastro") return;
        evento.preventDefault(); // SPA: nada de recarregar a página
        form.dataset.enviado = "true";

        const campos = [...form.elements].filter((campo) => campo.name && campo.willValidate);
        campos.forEach(validarCampo);
        validarConsistencia(form);

        const invalidos = campos.filter((campo) => !campo.validity.valid);
        const quantidade = new Set(invalidos.map((campo) => campo.name)).size;
        mostrarResumo(form, quantidade);

        if (quantidade > 0) {
            invalidos[0].focus();
            return;
        }
        aoEnviarComSucesso(form);
    });

    document.addEventListener("reset", (evento) => {
        if (evento.target.id === "form-cadastro") limparErros(evento.target);
    });
}