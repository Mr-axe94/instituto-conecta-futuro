// main.js: ponto de entrada. Inicia os módulos e conecta um ao outro.

import { iniciarUI, mostrarToast } from "./modules/ui.js";
import { iniciarRouter } from "./modules/router.js";
import { iniciarValidacao } from "./modules/validacao.js";
import { iniciarBuscaCep } from "./modules/cep.js";
import {
    lerDadosDoFormulario, salvarCadastro, listarCadastros,
    salvarRascunho, restaurarRascunho, apagarRascunho,
} from "./modules/storage.js";

function atualizarContador() {
    const contador = document.getElementById("contador-cadastros");
    if (!contador) return;
    const total = listarCadastros().length;
    contador.textContent = total === 0
        ? "Seja a primeira pessoa a se cadastrar por aqui!"
        : `${total} ${total === 1 ? "pessoa já se cadastrou" : "pessoas já se cadastraram"} por este site.`;
}

// Toda vez que o router monta a página de cadastro: devolve o rascunho e atualiza o contador
document.addEventListener("paginaCarregada", (evento) => {
    if (evento.detail.pagina !== "cadastro") return;
    restaurarRascunho(document.getElementById("form-cadastro"));
    atualizarContador();
});

// Cada tecla digitada atualiza o rascunho salvo
document.addEventListener("input", (evento) => {
    const form = evento.target.closest("#form-cadastro");
    if (form) salvarRascunho(form);
});

// "Limpar formulário" também apaga o rascunho
document.addEventListener("reset", (evento) => {
    if (evento.target.id === "form-cadastro") apagarRascunho();
});

iniciarUI();
iniciarValidacao((form) => {
    salvarCadastro(lerDadosDoFormulario(form));
    form.reset(); // dispara o evento reset: limpa erros e apaga o rascunho
    atualizarContador();
    mostrarToast("Cadastro recebido", "Seus dados foram salvos. Obrigado por se juntar ao Conecta Futuro!");
});
iniciarBuscaCep(); // depois da validação: a máscara do CEP precisa rodar antes da busca
iniciarRouter(); // por último: quando ele montar a primeira página, os ouvintes acima já existem