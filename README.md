# Instituto Conecta Futuro

Site institucional de uma ONG fictícia de educação e tecnologia em Natal/RN, desenvolvido na disciplina de Desenvolvimento Front-end da graduação em Ciência da Computação (Cruzeiro do Sul).

O projeto foi construído em etapas: estrutura em HTML5 semântico, estilização com CSS3 (design system e layout responsivo), interatividade com JavaScript e, por fim, versionamento, acessibilidade e deploy.

## Funcionalidades

- Página inicial com apresentação do instituto
- Página de projetos
- Formulário de cadastro com validação em tempo real
- Preenchimento automático de endereço pelo CEP (API ViaCEP)
- Menu responsivo, modais e notificações (toast)
- Navegação entre páginas controlada por JavaScript (router)
- Dados do formulário salvos no navegador (localStorage)

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis nativas, Grid e Flexbox)
- JavaScript
- [Day.js](https://day.js.org/) para datas
- [ViaCEP](https://viacep.com.br/) para consulta de endereço

## Estrutura de pastas

```
instituto-conecta-futuro/
├── html/
│   ├── index.html        # página inicial
│   ├── projetos.html     # projetos do instituto
│   └── cadastro.html     # formulário de voluntários
├── css/
│   └── style.css         # design system e layout responsivo
├── js/
│   ├── main.js           # ponto de entrada, inicializa os módulos
│   └── modules/
│       ├── cep.js        # consulta de endereço na API ViaCEP
│       ├── router.js     # navegação entre páginas
│       ├── storage.js    # salvamento de dados no navegador
│       ├── templates.js  # geração de conteúdo dinâmico
│       ├── ui.js         # menu, modais e toasts
│       └── validacao.js  # validação do formulário
├── imagens/
│   └── turma-informatica.jpg
└── README.md
```

## Como executar

1. Clone o repositório:
   `git clone https://github.com/Mr-axe94/instituto-conecta-futuro.git`
2. Abra a pasta no VS Code.
3. Abra `html/index.html` no navegador, ou use a extensão **Live Server** (botão direito no arquivo → *Open with Live Server*).

Não precisa instalar dependências: as bibliotecas externas são carregadas por CDN.

## Como usar

- Navegue pelo menu entre Início, Projetos e Cadastro.
- No cadastro, digite o CEP e o endereço é preenchido sozinho.
- Os campos mostram erro ou confirmação enquanto você digita.

## Fluxo de versionamento

O projeto segue o **GitFlow**:

- `main`: versão estável, publicada
- `develop`: integração das funcionalidades
- `feature/*`: uma branch por tarefa, com merge na develop via pull request
- `hotfix/*`: correções urgentes a partir da main

Os commits seguem o padrão semântico: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `chore:`.

## Acessibilidade

O site segue as diretrizes **WCAG 2.1 nível AA**:

- **Estrutura semântica:** landmarks `header`, `nav`, `main`, `aside` e `footer`, com as duas navegações identificadas por `aria-label` ("Menu principal" e "Redes sociais").
- **Navegação por teclado:** link "Pular para o conteúdo" no primeiro Tab, foco visível em todos os elementos (branco sobre o azul do cabeçalho e do rodapé) e tecla Esc fechando menu e modal.
- **Modal acessível:** `role="dialog"`, `aria-modal`, `aria-labelledby` e `aria-describedby`; o foco fica preso no modal (`inert` no fundo) e volta para quem o abriu.
- **Leitor de tela na SPA:** a cada troca de rota o foco vai para o título da página nova, e o link ativo recebe `aria-current="page"`.
- **Formulário:** `label` em todos os campos, grupos com `fieldset` e `legend`, erros ligados ao campo por `aria-invalid` e `aria-describedby`, resumo de erros com `role="alert"` e contador de cadastros com `aria-live`.
- **Contraste:** todas as cores do design system passam de 4.5:1. Há ainda um botão **Alto contraste** (`aria-pressed`), acima de 7:1, que segue a preferência do sistema (`prefers-contrast`) e fica salvo no navegador.
- **Movimento reduzido:** animações e rolagem suave desligadas para quem ativou `prefers-reduced-motion`.

## Deploy

_Em breve._

## Autor

Rony Machado ([@Mr-axe94](https://github.com/Mr-axe94))