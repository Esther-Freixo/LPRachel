// Envio de e-mail via Resend (HTTP, sem dependência extra — usa fetch nativo).
// Se RESEND_API_KEY não estiver definido, loga o conteúdo (modo dev) em vez de enviar.

const RESEND_URL = "https://api.resend.com/emails";

function templateResetSenha(linkReset: string): string {
  // Estética do site: cream + teal (#00B4A6) + tipografia editorial (serif no título).
  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#F7F6F3;font-family:'Inter',Arial,Helvetica,sans-serif;color:#1C1C1C;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F3;padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #ECE7E0;border-radius:18px;overflow:hidden;">
          <tr><td style="height:4px;background:#00B4A6;"></td></tr>
          <tr><td style="padding:40px 40px 8px 40px;">
            <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#00B4A6;font-weight:700;">Área de Gestão</p>
            <h1 style="margin:0;font-family:Georgia,'Cormorant Garamond',serif;font-size:30px;line-height:1.15;color:#1C1C1C;font-weight:600;">Redefinição de senha</h1>
          </td></tr>
          <tr><td style="padding:16px 40px 8px 40px;">
            <p style="margin:0 0 18px 0;font-size:15px;line-height:1.65;color:#4A4A4A;">Recebemos um pedido para redefinir a senha de acesso à área administrativa do site da Professora Esther. Clique no botão abaixo para escolher uma nova senha.</p>
          </td></tr>
          <tr><td style="padding:8px 40px 8px 40px;">
            <a href="${linkReset}" style="display:inline-block;background:#00B4A6;color:#ffffff;text-decoration:none;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;padding:16px 32px;border-radius:10px;">Redefinir senha</a>
          </td></tr>
          <tr><td style="padding:24px 40px 8px 40px;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#8F8F8F;">Este link expira em 1 hora e só pode ser usado uma vez. Se você não solicitou a redefinição, ignore este e-mail — sua senha continua a mesma.</p>
          </td></tr>
          <tr><td style="padding:18px 40px 36px 40px;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#B0AAA2;word-break:break-all;">Se o botão não funcionar, copie e cole este endereço no navegador:<br/><span style="color:#00B4A6;">${linkReset}</span></p>
          </td></tr>
          <tr><td style="padding:18px 40px;background:#1C1C1C;">
            <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:16px;color:#ffffff;">Esther</p>
            <p style="margin:4px 0 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8F8F8F;">Professora · Pesquisadora · Palestrante</p>
          </td></tr>
        </table>
        <p style="margin:18px 0 0 0;font-size:11px;color:#B0AAA2;">E-mail automático — não responda.</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

export async function enviarEmailResetSenha(para: string, linkReset: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Professora Esther <nao-responder@rachelfreixo.com.br>";
  const html = templateResetSenha(linkReset);

  if (!key) {
    console.warn(`[Email] RESEND_API_KEY ausente — link de reset (dev) para ${para}: ${linkReset}`);
    return;
  }

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [para],
      subject: "Redefinição de senha — Área de Gestão",
      html,
    }),
  });

  if (!res.ok) {
    const detalhe = await res.text().catch(() => "");
    console.error(`[Email] falha ao enviar (${res.status}): ${detalhe}`);
    throw new Error("Falha ao enviar e-mail de redefinição");
  }
}
