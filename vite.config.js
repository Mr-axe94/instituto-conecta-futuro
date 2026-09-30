// vite.config.js: configuração do build de produção (EP IV)
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
    root: "html",   // as páginas ficam na pasta html/
    base: "./",     // caminhos relativos: funciona no GitHub Pages
    build: {
        outDir: "../dist",   // o site pronto sai em dist/, na raiz do projeto
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: "html/index.html",
                cadastro: "html/cadastro.html",
                projetos: "html/projetos.html",
            },
        },
    },
    plugins: [ViteMinifyPlugin()], // minifica o HTML (o Vite já minifica CSS e JS)
});