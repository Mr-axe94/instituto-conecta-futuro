import { paginaProjetos, paginaDoTemplate } from "./templates.js";
import { fecharMenu } from "./ui.js";
// Mapa de rotas: o nome da página aponta para a função que gera o HTML
const rotas = {
    "": () => paginaDoTemplate("tpl-inicio"),
    projetos: paginaProjetos,
    cadastro: () => paginaDoTemplate("tpl-cadastro"),
};

const titulos = { "": "Início", projetos: "Projetos Sociais", cadastro: "Seja Voluntário" };

// EP IV: na primeira carga o foco fica no começo da página (comportamento normal do navegador)
let primeiraCarga = true;

function renderizar() {
    const hash = location.hash;

    // Âncoras internas (#modal-lgpd, #consentimento) não são rotas: ignora
    if (hash && !hash.startsWith("#/")) return;

    // "#/projetos/meninas" vira pagina = "projetos" e secao = "meninas"
    const [pagina = "", secao] = hash.slice(2).split("/");
    const gerarHtml = rotas[pagina] ?? rotas[""];

    document.getElementById("app").innerHTML = gerarHtml();
    document.title = `${titulos[pagina] ?? "Início"} | Instituto Conecta Futuro`;
    marcarLinkAtivo(pagina);
    fecharMenu();

    // Avisa o resto da aplicação que uma página nova foi montada
    document.dispatchEvent(new CustomEvent("paginaCarregada", { detail: { pagina } }));

    // EP IV: leva o foco ao conteúdo novo, assim o leitor de tela percebe a troca de página
    if (!primeiraCarga) moverFoco(secao);
    primeiraCarga = false;

    // EP IV: sem rolagem animada para quem desativou animações no sistema
    const suave = !matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (secao) {
        document.getElementById(secao)?.scrollIntoView({ behavior: suave ? "smooth" : "auto" });
    } else {
        window.scrollTo(0, 0);
    }
}

// EP IV: foca a seção pedida ou, sem seção, o primeiro título da página
function moverFoco(secao) {
    const alvo = (secao && document.getElementById(secao)) || document.querySelector("#app h1, #app h2");
    if (!alvo) return;
    alvo.setAttribute("tabindex", "-1");
    alvo.focus({ preventScroll: true });
}

function marcarLinkAtivo(pagina) {
    document.querySelectorAll(".menu > li > a").forEach((link) => {
        const destino = link.getAttribute("href").slice(2);
        if (destino === pagina) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

export function iniciarRouter() {
    window.addEventListener("hashchange", renderizar);
    renderizar();
}