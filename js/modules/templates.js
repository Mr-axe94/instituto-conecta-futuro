// Fonte única de dados: os cartões são gerados a partir desta lista
export const projetos = [
    {
        id: "informatica",
        titulo: "Informática Básica",
        status: { texto: "Inscrições abertas", tipo: "sucesso" },
        descricao: "Curso introdutório de quatro meses cobrindo sistema operacional, editor de texto, planilhas e uso seguro da internet. Turmas de até 20 alunos, com computador individual.",
        detalhes: [
            ["Público-alvo", "Jovens e adultos a partir de 14 anos"],
            ["Duração", "4 meses, dois encontros semanais"],
            ["Unidade", "Capim Macio, Natal/RN"],
        ],
    },
        {
        id: "reforco",
        titulo: "Reforço Escolar",
        status: { texto: "Inscrições abertas", tipo: "sucesso" },
        descricao: "Acompanhamento em Matemática e Língua Portuguesa para alunos do ensino fundamental, alinhado ao conteúdo da rede municipal. Grupos pequenos, com monitoria individualizada.",
        detalhes: [
            ["Público-alvo", "Estudantes do 6º ao 9º ano"],
            ["Duração", "Contínuo, durante o ano letivo"],
            ["Unidade", "Capim Macio e Nova Parnamirim"],
        ],
    },
    {
        id: "meninas",
        titulo: "Meninas na Tecnologia",
        status: { texto: "Últimas vagas", tipo: "alerta" },
        // Crases no lugar de aspas porque o texto tem aspas duplas dentro (datetime="2023")
        descricao: `Oficinas de lógica de programação e desenvolvimento web voltadas a meninas, com mentoria de profissionais mulheres da área. Criado em <time datetime="2023">2023</time> para enfrentar a baixa presença feminina em cursos de tecnologia.`,
        detalhes: [
            ["Público-alvo", "Meninas de 12 a 17 anos"],
            ["Duração", "6 meses, encontros aos sábados"],
            ["Unidade", "Capim Macio, Natal/RN"],
        ],
    },
    {
        id: "recondiciona",
        titulo: "Recondiciona",
        status: { texto: "Fluxo contínuo", tipo: "neutro" },
        descricao: "Laboratório que recebe computadores e notebooks doados por empresas e pessoas físicas, recupera o que é aproveitável e destina os equipamentos às salas de aula dos demais projetos.",
        detalhes: [
            ["Como participar", "Doação de equipamentos ou voluntariado técnico"],
            ["Funcionamento", "Segunda a sexta, das 8h às 17h"],
            ["Unidade", "Capim Macio, Natal/RN"],
        ],
    },
];

// Componente reutilizável: recebe um projeto e devolve o HTML do cartão
export function cardProjeto(projeto) {
    const detalhes = projeto.detalhes
        .map(([termo, valor]) => `<dt>${termo}</dt><dd>${valor}</dd>`)
        .join("");

    return `
        <article class="card-projeto" id="${projeto.id}">
            <h2>${projeto.titulo}</h2>
            <span class="badge badge-${projeto.status.tipo}">${projeto.status.texto}</span>
            <p>${projeto.descricao}</p>
            <dl>${detalhes}</dl>
        </article>`;
}

export function paginaProjetos() {
    return `
        <h1>Projetos Sociais</h1>
        <p>Atuamos em quatro frentes complementares. Todos os projetos são gratuitos e abertos a moradores das comunidades atendidas.</p>
        ${projetos.map(cardProjeto).join("")}
        <p><a href="#/cadastro" class="botao-cta">Quero apoiar um destes projetos</a></p>`;
}

// Lê o HTML guardado numa tag <template> do index.html
export function paginaDoTemplate(id) {
    return document.getElementById(id).innerHTML;
}