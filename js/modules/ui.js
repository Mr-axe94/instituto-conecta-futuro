// ui.js: componentes de interface controlados por eventos (menu, modal e toast)

let ultimoFoco = null;   // elemento que abriu o modal, para devolver o foco ao fechar
let timerToast = null;   // guarda o temporizador que esconde o toast sozinho

export function abrirModal(id) {
    const modal = document.getElementById(id);
    ultimoFoco = document.activeElement;
    modal.classList.add("aberto");

    // Espera um instante: enquanto a transição do CSS não começa, o modal
    // ainda está "invisível" e o navegador recusa o foco
    setTimeout(() => modal.querySelector(".modal-caixa").focus(), 50);
}

export function fecharModal() {
    const modal = document.querySelector(".modal.aberto");
    if (!modal) return;
    modal.classList.remove("aberto");
    ultimoFoco?.focus();
}

export function mostrarToast(titulo, mensagem) {
    const toast = document.getElementById("toast-sucesso");
    toast.querySelector("strong").textContent = titulo;
    toast.querySelector("span").textContent = mensagem;
    toast.classList.add("visivel");

    clearTimeout(timerToast);
    timerToast = setTimeout(fecharToast, 5000);
}

export function fecharToast() {
    document.getElementById("toast-sucesso").classList.remove("visivel");
}

export function fecharMenu() {
    document.getElementById("abrir-menu").checked = false;
}

export function iniciarUI() {
    // Delegação de eventos: um único ouvinte no document funciona também
    // para os elementos que o router cria depois, a cada troca de página
    document.addEventListener("click", (evento) => {
        const alvo = evento.target;

        const gatilhoModal = alvo.closest("[data-abrir-modal]");
        if (gatilhoModal) {
            evento.preventDefault();
            abrirModal(gatilhoModal.dataset.abrirModal);
            return;
        }

        // Fecha pelo botão "Entendi" ou clicando no fundo escuro
        if (alvo.closest("[data-fechar-modal]") || alvo.classList.contains("modal")) {
            evento.preventDefault();
            fecharModal();
            return;
        }

        if (alvo.closest("[data-fechar-toast]")) {
            evento.preventDefault();
            fecharToast();
            return;
        }

        // Clique fora da navegação fecha o menu mobile
        if (!alvo.closest("nav")) {
            fecharMenu();
        }
    });

    // Tecla Esc fecha o que estiver aberto
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            fecharModal();
            fecharMenu();
        }
    });
}