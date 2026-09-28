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

_Em andamento._

## Deploy

_Em breve._

## Autor

Rony Machado ([@Mr-axe94](https://github.com/Mr-axe94))