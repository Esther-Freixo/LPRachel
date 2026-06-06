import { Client } from "minio";

const endPoint = process.env.MINIO_ENDPOINT ?? "localhost";
const port = Number(process.env.MINIO_PORT ?? 9100);
const useSSL = (process.env.MINIO_USE_SSL ?? "false") === "true";
const accessKey = process.env.MINIO_ACCESS_KEY ?? "rf_minio";
const secretKey = process.env.MINIO_SECRET_KEY ?? "rf_minio_local_dev";
const bucket = process.env.MINIO_BUCKET ?? "rachel-midia";

export const minio = new Client({ endPoint, port, useSSL, accessKey, secretKey });

export function urlPublica(nome: string): string {
  const proto = useSSL ? "https" : "http";
  const base = process.env.MINIO_PUBLIC_URL ?? `${proto}://${endPoint}:${port}/${bucket}`;
  return `${base}/${nome}`;
}

// Cria o bucket (se preciso) e libera leitura pública dos objetos.
export async function garantirBucket(): Promise<void> {
  const existe = await minio.bucketExists(bucket);
  if (!existe) await minio.makeBucket(bucket);
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };
  await minio.setBucketPolicy(bucket, JSON.stringify(policy));
}

export async function enviarArquivo(nome: string, buffer: Buffer, contentType: string): Promise<string> {
  await minio.putObject(bucket, nome, buffer, buffer.length, { "Content-Type": contentType });
  return urlPublica(nome);
}
