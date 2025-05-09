export const prerender = false;
import type { APIRoute } from 'astro';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export const POST: APIRoute = async ({ request }) => {
  try {

    const apiKey = import.meta.env.MAILGUN_API_KEY ;
    if (!apiKey) {
      throw new Error("MAILGUN_API_KEY no está definido en las variables de entorno.");
    }


    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: apiKey
    });

    const DOMAIN = 'paramoprograming.com';


    const formData = await request.formData();
    const name = formData.get('name')?.toString() || 'Sin nombre';
    const email = formData.get('email')?.toString() || 'Sin correo';
    const message = formData.get('message')?.toString() || 'Sin mensaje';
    const empresa = formData.get('company')?.toString() || 'Sin empresa';

    console.log('Datos del formulario recibidos:', { name, email });


    const response = await mg.messages.create(
      DOMAIN,
      {
        from: `Contacto ParamoPrograming <postmaster@${DOMAIN}>`,
        to: ['info@psicolab.com.co', 'cesarfelipe0316@gmail.com'],
        subject: `${empresa} quiere contactarte`,
        template: "psicolab",
        "h:X-Mailgun-Variables": JSON.stringify({
          nombre: name,
          correo: email,
          mensaje: message,
          Empresa: empresa
        })
      }
    );


    return new Response(JSON.stringify({
      success: true,
      data: response
    }), { status: 200, headers:{"Access-Control-Allow-Origin": "*", // o tu dominio
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"} 
    });

  } catch (error) {
    console.error('Error enviando correo:', error);
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), { status: 500 });
  }
};
