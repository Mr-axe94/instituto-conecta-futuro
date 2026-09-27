import { iniciarUI, mostrarToast } from "./modules/ui.js";
import { iniciarRouter } from "./modules/router.js";
import { iniciarValidacao } from "./modules/validacao.js";

iniciarUI();
iniciarRouter();

// Por enquanto, cadastro válido só mostra o aviso e limpa o formulário.
// Na próxima etapa o storage.js entra aqui para salvar os dados.
iniciarValidacao((form) => {
    mostrarToast("Cadastro recebido", "Obrigado por se juntar ao Conecta Futuro.");
    form.reset();
});