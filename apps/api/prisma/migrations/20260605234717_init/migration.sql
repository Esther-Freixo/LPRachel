-- CreateTable
CREATE TABLE "timeline" (
    "id" SERIAL NOT NULL,
    "ano" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicacoes" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "meta" TEXT,
    "resumo" TEXT,
    "link" TEXT,

    CONSTRAINT "publicacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda" (
    "id" SERIAL NOT NULL,
    "dia" TEXT,
    "mes" TEXT,
    "ano" TEXT,
    "tipo" TEXT,
    "titulo" TEXT NOT NULL,
    "local" TEXT,
    "descricao" TEXT,
    "link" TEXT,
    "status" TEXT,

    CONSTRAINT "agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insights" (
    "id" SERIAL NOT NULL,
    "data" TEXT,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "link_original" TEXT,
    "media_url" TEXT,

    CONSTRAINT "insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citacoes" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "bg" TEXT,
    "text_col" TEXT,
    "border" TEXT,
    "quote_mark" TEXT,

    CONSTRAINT "citacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "midias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descricao" TEXT,
    "thumbnail_url" TEXT,
    "plataforma" TEXT,
    "ordem" INTEGER,

    CONSTRAINT "midias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "assunto" TEXT,
    "mensagem" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
