import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, empresa, email, telefone, mensagem } = body as {
      nome: string;
      empresa?: string;
      email: string;
      telefone?: string;
      mensagem: string;
    };

    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8" /></head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,sans-serif;">
      <div style="max-width:620px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <div style="background:#1a4f9c;padding:28px 32px;">
          <div style="color:#fff;font-size:18px;font-weight:700;">Partum Brasil</div>
          <div style="color:rgba(255,255,255,0.7);font-size:12px;margin-top:2px;">Nova mensagem de contato</div>
        </div>

        <div style="padding:32px;">
          <h2 style="margin:0 0 4px;font-size:22px;color:#1e293b;">Nova Mensagem de Contato</h2>
          <p style="margin:0 0 24px;color:#64748b;font-size:14px;">Recebida pelo formulário do site</p>

          <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
            <h3 style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;">Dados</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;width:100px;">Nome</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;">${nome}</td></tr>
              ${empresa ? `<tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Empresa</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;">${empresa}</td></tr>` : ""}
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">E-mail</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;"><a href="mailto:${email}" style="color:#1a4f9c;">${email}</a></td></tr>
              ${telefone ? `<tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Telefone</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;">${telefone}</td></tr>` : ""}
            </table>
          </div>

          <div style="padding:20px;background:#f8fafc;border-radius:10px;border-left:4px solid #1a4f9c;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;">Mensagem</p>
            <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.6;">${mensagem}</p>
          </div>
        </div>

        <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Partum Brasil · partumbrasil.com.br</p>
        </div>
      </div>
    </body>
    </html>`;

    await resend.emails.send({
      from: `Partum Brasil <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO!,
      replyTo: email,
      subject: `✉️ Contato — ${nome}${empresa ? ` (${empresa})` : ""}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/contato]", err);
    return NextResponse.json({ error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
