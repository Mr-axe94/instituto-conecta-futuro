// cep.js: integração com a API pública ViaCEP (preenche o endereço a partir do CEP)

import { validarCampo } from "./validacao.js";

// Consulta a API. Retorna o endereço, ou null se o CEP não existir.
async function buscarEndereco(cep) {
    const numeros = cep.replace(/\D/g, "");
    const resposta = await fetch(`https://viacep.com.br/ws/${numeros}/json/`);
    if (!resposta.ok) throw new Error(`ViaCEP respondeu ${resposta.status}`);

    const dados = await resposta.json();
    return dados.erro ? null : dados;
}

function preencherEndereco(form, endereco) {
    form.elements.logradouro.value = endereco.logradouro;
    form.elements.bairro.value = endereco.bairro;
    form.elements.cidade.value = endereco.localidade;

    // O select só tem alguns estados: se a UF não estiver na lista, marca "Outro estado"
    const uf = form.elements.uf;
    const existeNaLista = [...uf.options].some((opcao) => opcao.value === endereco.uf);
    uf.value = existeNaLista ? endereco.uf : "OUTRO";

    // Tira os avisos de erro dos campos que acabaram de ser preenchidos
    [form.elements.logradouro, form.elements.bairro, form.elements.cidade, uf]
        .filter((campo) => campo.hasAttribute("aria-invalid"))
        .forEach(validarCampo);

    // Avisa o resto da aplicação (ex.: o rascunho do storage) que o formulário mudou
    form.dispatchEvent(new Event("input", { bubbles: true }));
    form.elements.numero.focus();
}

export function iniciarBuscaCep() {
    document.addEventListener("input", async (evento) => {
        const campoCep = evento.target;
        if (campoCep.id !== "cep" || campoCep.value.length !== 9) return; // só com o CEP completo: 00000-000

        const form = campoCep.form;
        delete campoCep.dataset.naoEncontrado;
        campoCep.setAttribute("aria-busy", "true"); // indica "carregando" para leitores de tela

        try {
            const endereco = await buscarEndereco(campoCep.value);
            if (endereco) {
                preencherEndereco(form, endereco);
            } else {
                campoCep.dataset.naoEncontrado = "true";
            }
        } catch (erro) {
            // Sem internet ou API fora do ar: não bloqueia, a pessoa preenche o endereço à mão
            console.warn("Não foi possível consultar o CEP:", erro.message);
        } finally {
            campoCep.removeAttribute("aria-busy");
            validarCampo(campoCep);
        }
    });
}