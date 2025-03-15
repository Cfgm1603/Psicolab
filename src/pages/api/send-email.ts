export const prerender = false;
import type { APIRoute } from 'astro';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Debugging - Mostrar la API key que se está usando
    const apiKey = import.meta.env.MAILGUN_API_KEY || process.env.MAILGUN_API_KEY || 'API_KEY';
    console.log('API Key (primeros 4 caracteres):', apiKey.substring(0, 4));
    
    // 1. Inicializa Mailgun con tu clave privada
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: 'api',
      key: apiKey,
      // url: 'https://api.eu.mailgun.net/v3'  // Descomenta si tu dominio es EU
    });
    
    // Más debugging
    console.log('Dominio Mailgun:', 'sandboxeabd55435e5b4a419df95dd8f3492e44.mailgun.org');
    console.log('Correo destino:', 'cesarfelipe0316@gmail.com');

    // 2. Obtén los datos del formulario
    const formData = await request.formData();
    const name = formData.get('name')?.toString() || 'Sin nombre';
    const email = formData.get('email')?.toString() || 'Sin correo';
    const message = formData.get('message')?.toString() || 'Sin mensaje';
    
    console.log('Datos del formulario recibidos:', { name, email });

    // 3. Envía el correo con Mailgun
    const response = await mg.messages.create(
      'sandboxeabd55435e5b4a419df95dd8f3492e44.mailgun.org',
      {
        from: 'Mailgun Sandbox <postmaster@sandboxeabd55435e5b4a419df95dd8f3492e44.mailgun.org>',
        to: ['cesarfelipe0316@gmail.com'],
        subject: `Nuevo mensaje de ${name}`,
        text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`
      }
    );

    // 4. Retorna una respuesta al navegador
    return new Response(JSON.stringify({
      success: true,
      data: response
    }), { status: 200 });
  } catch (error) {
    console.error('Error completo enviando correo:', error);
    return new Response(JSON.stringify({
      success: false,
      error: String(error)
    }), { status: 500 });
  }
};