// ui.js: componentes de interface controlados por eventos (menu, modal, toast e contraste)

let ultimoFoco = null;   // elemento que abriu o modal, para devolver o foco ao fechar
let timerToast = null;   // guarda o temporizador que esconde o toast sozinho

// EP IV: partes da página que ficam "congeladas" enquanto o modal está aberto
const FUNDO_DO_MODAL = "body > header, body > main, body > footer, .pular-link";

export function abrirModal(id) {
    const modal = document.getElementById(id);
    ultimoFoco = document.activeElement;
    modal.classList.add("aberto");

    // EP IV: inert impede que o Tab (e o leitor de tela) saia do modal
    document.querySelectorAll(FUNDO_DO_MODAL).forEach((el) => (el.inert = true));

    // Espera um instante: enquanto a transição do CSS não começa, o modal
    // ainda está "invisível" e o navegador recusa o foco
    setTimeout(() => modal.querySelector(".modal-caixa").focus(), 50);
}

export function fecharModal() {
    const modal = document.querySelector(".modal.aberto");
    if (!modal) return;
    modal.classList.remove("aberto");

    // EP IV: libera o fundo ANTES de devolver o foco (elemento inerte não recebe foco)
    document.querySelectorAll(FUNDO_DO_MODAL).forEach((el) => (el.inert = false));
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

// EP IV: liga/desliga o alto contraste e avisa o leitor de tela pelo aria-pressed
export function aplicarContraste(ativo) {
    document.documentElement.classList.toggle("alto-contraste", ativo);
    document.getElementById("botao-contraste").setAttribute("aria-pressed", String(ativo));
    localStorage.setItem("altoContraste", ativo ? "sim" : "nao");
}

export function iniciarUI() {
    // EP IV: respeita a escolha salva; sem escolha, segue a configuração do sistema
    const salvo = localStorage.getItem("altoContraste");
    aplicarContraste(salvo ? salvo === "sim" : matchMedia("(prefers-contrast: more)").matches);

    // Delegação de eventos: um único ouvinte no document funciona também
    // para os elementos que o router cria depois, a cada troca de página
    document.addEventListener("click", (evento) => {
        const alvo = evento.target;

        // EP IV: o link de pular leva o foco ao conteúdo sem trocar a rota
        if (alvo.closest(".pular-link")) {
            evento.preventDefault();
            document.getElementById("app").focus();
            return;
        }

        if (alvo.closest("#botao-contraste")) {
            aplicarContraste(!document.documentElement.classList.contains("alto-contraste"));
            return;
        }

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