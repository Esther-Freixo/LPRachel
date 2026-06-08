import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const timeline = [
  { ano: "Set/2024 – Atual", titulo: "Conselheira Titular", descricao: "Conselho Administrativo de Recursos Fiscais (CARF). Julgamento de recursos administrativos fiscais." },
  { ano: "Set/2023 – Atual", titulo: "Vogal Titular (Governo Federal)", descricao: "Representante do Governo Federal na Junta Comercial do Estado do Espírito Santo (JUCEES)." },
  { ano: "Nov/2019 – Set/2025", titulo: "Subsecretária de Competitividade", descricao: "Governo do Estado do Espírito Santo. Liderança na modernização do ambiente de negócios." },
  { ano: "Jan/2018 – Jul/2024", titulo: "Professora", descricao: "FUCAPE Business School." },
  { ano: "Ago/2014 – Nov/2019", titulo: "Professora de Direito", descricao: "Faculdade Multivix." },
  { ano: "Jan/2012 – Nov/2019", titulo: "Comitê Jurídico", descricao: "Associação Brasileira de Empresas de Comércio Exterior (ABECE)." },
  { ano: "Fev/2014 – Fev/2015", titulo: "Advogada", descricao: "Moussallem e Campos Advogados." },
  { ano: "Set/2013 – Jan/2014", titulo: "Advogada", descricao: "De Goeye." },
  { ano: "Abr/2012 – Ago/2013", titulo: "Advogada Associada", descricao: "Araujo e Policastro Advogados." },
  { ano: "Mar/2007 – Mar/2012", titulo: "Advogada", descricao: "Target Trading S.A." },
  { ano: "Atual", titulo: "Doutorado em Gestão e Economia", descricao: "FUCAPE Business School. (Em andamento)" },
  { ano: "2016 – 2019", titulo: "Mestrado em Ciências Contábeis", descricao: "FUCAPE Business School. Foco em Planejamento Tributário." },
  { ano: "2012 – 2014", titulo: "Especialização", descricao: "Instituto Brasileiro de Estudos Tributários (IBET). Direito Tributário." },
  { ano: "2005 – 2010", titulo: "Graduação em Direito", descricao: "Faculdades Integradas de Vitória (FDV)." },
];

const publicacoes = [
  { tipo: "artigo", titulo: "Impulsionando o Sucesso Empresarial: A Importância da Diversidade nos Conselhos", meta: "Fev/2024", resumo: "Artigo destacando o valor da diversidade na liderança corporativa.", link: "https://www.linkedin.com/in/rachelfreixo/" },
  { tipo: "livro", titulo: "Questões Controvertidas no CARF — Vol. 2", meta: "Editora Jurídica Nacional", resumo: "Análise de teses tributárias julgadas pelo CARF.", link: null },
  { tipo: "opiniao", titulo: "Reforma Tributária e Equidade: o que o IBS muda para as pequenas empresas", meta: "Gazeta Online · Mar/2024", resumo: "Análise do impacto da Reforma Tributária no contexto das micro e pequenas empresas capixabas.", link: null },
  { tipo: "imprensa", titulo: '"Diversidade no CARF é questão de legitimidade institucional"', meta: "JOTA · Fev/2024", resumo: "Rachel Freixo fala sobre representatividade feminina nos órgãos de julgamento tributário.", link: null },
];

const agenda = [
  { dia: "15", mes: "Abr", ano: "2026", tipo: "Painel", titulo: "Brazil Summit on Tax", local: "George Washington University", descricao: "Liderança de discussões sobre o futuro da tributação internacional transfronteiriça.", link: "https://www.linkedin.com/in/rachelfreixo/", status: "proximo" },
];

const insights = [
  {
    data: "Publicado recentemente",
    titulo: "Hoje foi publicada a Portaria COANA nº 188/2026",
    texto:
      "Hoje foi publicada a Portaria COANA nº 188/2026, que regulamenta a simplificação dos procedimentos de trânsito aduaneiro e estabelece requisitos para o monitoramento de veículos terrestres e de unidades de carga.\n\nMais do que um novo normativo, ela representa a consolidação de uma mudança real na forma de pensar o trânsito aduaneiro no Brasil.\n\nDepois de tanto trabalho, debates, testes e construção conjunta, ver esse projeto ganhar forma normativa é motivo de muita alegria, e também de reconhecimento coletivo.\n\nUm abraço,\nRachel Freixo\n\nÍntegra da Portaria: https://lnkd.in/dk_xEvug",
    linkOriginal: "https://www.linkedin.com/feed/update/urn:li:activity:7453414735804362752/",
    mediaUrl: null,
  },
];

const citacoes = [
  { texto: "O rigor científico é a bússola que orienta a excelência na estratégia tributária.", bg: "bg-white/60", textCol: "text-brand-dark", border: "border-brand-red", quoteMark: "text-brand-dark/10" },
  { texto: "A governança não é apenas um selo, é o alicerce para negócios duradouros.", bg: "bg-brand-dark/90", textCol: "text-white", border: "border-[#E5E5E5]", quoteMark: "text-white/10" },
  { texto: "Desenvolver soluções exige integrar eficiência fiscal e responsabilidade sustentável.", bg: "bg-brand-red/90", textCol: "text-white", border: "border-brand-dark", quoteMark: "text-brand-dark/20" },
  { texto: "O debate acadêmico oxigena e impulsiona as transformações do setor produtivo.", bg: "bg-[#EFECE8]/90", textCol: "text-brand-dark", border: "border-brand-dark", quoteMark: "text-brand-dark/10" },
];

async function main() {
  // Idempotente: limpa antes de inserir.
  await prisma.$transaction([
    prisma.timeline.deleteMany(),
    prisma.publicacao.deleteMany(),
    prisma.evento.deleteMany(),
    prisma.insight.deleteMany(),
    prisma.citacao.deleteMany(),
  ]);
  await prisma.timeline.createMany({ data: timeline });
  await prisma.publicacao.createMany({ data: publicacoes });
  await prisma.evento.createMany({ data: agenda });
  await prisma.insight.createMany({ data: insights });
  await prisma.citacao.createMany({ data: citacoes });

  // Usuário admin (idempotente) — substitui o login hardcoded do código antigo.
  const email = process.env.ADMIN_EMAIL ?? "rachel@exemplo.com";
  const senha = process.env.ADMIN_SENHA ?? "trocar-no-deploy";
  const senhaHash = await argon2.hash(senha);
  await prisma.usuario.upsert({
    where: { email },
    update: { senhaHash },
    create: { email, senhaHash, papel: "admin" },
  });
  console.log(`[seed] admin garantido: ${email}`);

  console.log("[seed] dados recuperados inseridos.");
}

main()
  .catch((e) => {
    console.error("[seed] erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
