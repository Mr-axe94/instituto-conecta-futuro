import { paginaProjetos, paginaDoTemplate } from "./templates.js";
import { fecharMenu } from "./ui.js";
// Mapa de rotas: o nome da página aponta para a função que gera o HTML
const rotas = {
    "": () => paginaDoTemplate("tpl-inicio"),
    projetos: paginaProjetos,
    cadastro: () => paginaDoTemplate("tpl-cadastro"),
};

const titulos = { "": "Início", projetos: "Projetos Sociais", cadastro: "Seja Voluntário" };

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
    
       if (secao) {
        document.getElementById(secao)?.scrollIntoView({ behavior: "smooth" });
    } else {
        window.scrollTo(0, 0);
    }
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