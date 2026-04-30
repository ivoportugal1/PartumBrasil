import { Resend } from "resend";
import { NextResponse } from "next/server";

type CartItem = {
  name: string;
  code: string;
  quantity: number;
};

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { nome, empresa, email, whatsapp, observacoes, items } = body as {
      nome: string;
      empresa?: string;
      email: string;
      whatsapp: string;
      observacoes?: string;
      items: CartItem[];
    };

    if (!nome || !email || !whatsapp || !items?.length) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#1e293b;">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;">${item.code}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:700;color:#1a4f9c;text-align:center;">${item.quantity}</td>
        </tr>`
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8" /></head>
    <body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,sans-serif;">
      <div style="max-width:620px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#1a4f9c;padding:28px 32px;display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#1a4f9c;font-size:13px;text-align:center;line-height:40px;">PB</div>
          <div>
            <div style="color:#fff;font-size:18px;font-weight:700;">Partum Brasil</div>
            <div style="color:rgba(255,255,255,0.7);font-size:12px;">Nova solicitação de orçamento</div>
          </div>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <h2 style="margin:0 0 4px;font-size:22px;color:#1e293b;">Nova Solicitação de Orçamento</h2>
          <p style="margin:0 0 24px;color:#64748b;font-size:14px;">Recebida pelo site partumbrasil.com.br</p>

          <!-- Cliente -->
          <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:24px;">
            <h3 style="margin:0 0 14px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;">Dados do Cliente</h3>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;width:100px;">Nome</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;">${nome}</td></tr>
              ${empresa ? `<tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Empresa</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;">${empresa}</td></tr>` : ""}
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">E-mail</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;"><a href="mailto:${email}" style="color:#1a4f9c;">${email}</a></td></tr>
              <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">WhatsApp</td><td style="padding:4px 0;font-size:14px;font-weight:600;color:#1e293b;"><a href="https://wa.me/55${whatsapp.replace(/\D/g, "")}" style="color:#22c55e;">${whatsapp}</a></td></tr>
            </table>
          </div>

          <!-- Produtos -->
          <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;">Produtos Solicitados</h3>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Produto</th>
                <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Código</th>
                <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;">Qtd.</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          ${observacoes ? `
          <div style="margin-top:20px;padding:16px;background:#fffbeb;border-left:4px solid #f97316;border-radius:0 8px 8px 0;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;">Observações</p>
            <p style="margin:0;font-size:14px;color:#1e293b;">${observacoes}</p>
          </div>` : ""}
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Partum Brasil · Fardamentos Industriais e EPIs</p>
          <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Este email foi gerado automaticamente pelo site.</p>
        </div>
      </div>
    </body>
    </html>`;

    await resend.emails.send({
      from: `Partum Brasil <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO!,
      replyTo: email,
      subject: `🛒 Novo Orçamento — ${nome}${empresa ? ` (${empresa})` : ""}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/orcamento]", err);
    return NextResponse.json({ error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
