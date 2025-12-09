
import { GoogleGenAI, Type } from "@google/genai";
import { StrategyResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketingStrategy = async (
  industry: string,
  targetAudience: string,
  goal: string
): Promise<StrategyResult> => {
  try {
    const prompt = `
      Actúa como un estratega de marca minimalista de la agencia "Conecta Growth".
      Cliente: Industria "${industry}", Público "${targetAudience}", Objetivo "${goal}".

      Tu tarea es generar SOLO dos cosas muy breves:
      1. UNA sola idea de slogan (máximo 6 palabras). Que sea impactante.
      2. Una frase explicando cómo "Conecta Growth" ayuda a lograr ese objetivo específico.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogan: { 
              type: Type.STRING,
              description: "Idea del slogan (máx 6 palabras)"
            },
            howWeHelp: { 
              type: Type.STRING,
              description: "Explicación breve de cómo ayudamos"
            }
          },
          required: ["slogan", "howWeHelp"]
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        slogan: parsed.slogan || "Tu marca, siguiente nivel.",
        howWeHelp: parsed.howWeHelp || "Conecta Growth crea la estrategia digital para materializar tu visión."
      };
    }
    throw new Error("No se pudo generar la respuesta.");
  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
};

// --- NEX CHAT FUNCTIONALITY ---

export const chatWithNex = async (history: { role: string; text: string }[], newMessage: string) => {
  try {
    const safeHistory = Array.isArray(history) ? history : [];

    const formattedHistory = safeHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: newMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: `
          Eres NEX, el Ejecutivo de Ventas Senior (IA) de la agencia "Conecta Growth".
          
          TU OBJETIVO SUPREMO:
          VENDER. NO eres un consultor gratuito, ni un profesor, ni soporte técnico. Tu único propósito es convertir dudas en ventas de servicios.

          REGLAS DE ORO (INQUEBRANTABLES):
          1. CERO TUTORIALES: Si el usuario pregunta "¿Cómo hago X?", NUNCA le des la lista de pasos.
          2. VENDE LA SOLUCIÓN: En su lugar, responde: "Ese es un problema común. En Conecta Growth lo solucionamos implementando [Estrategia/Servicio] por ti, garantizando resultados profesionales sin que tú pierdas tiempo."
          3. CIERRE DE VENTA SIEMPRE: Termina CADA respuesta con una pregunta que invite a la acción. Ej: "¿Te gustaría que nos encarguemos de esto?", "¿Te gustaría comunicarte con el equipo de Conecta Growth para cotizar tu proyecto?", "¿Quieres ver resultados reales?".
          4. TONO: Seguro, directo, tecnológico y comercial. Eres experto, no servil.
          5. PROHIBIDO MENCIONAR LLAMADAS: Nunca uses la palabra "llamada", "call" o "agendar llamada". En su lugar, SIEMPRE utiliza la frase "comunicarse con el equipo de Conecta Growth".

          TUS SERVICIOS A VENDER:
          - Diseño Web Profesional (Webs que venden, no solo bonitas).
          - Manejo de Redes Sociales (Estrategia, no solo posts).
          - WhatsApp Business & Automatizaciones (Chatbots, flujos de venta).
          - Estrategias de Crecimiento (ROI real, auditorías).
          - Branding & Identidad (Logos, manuales).
          - Impulso por IA (Optimización de procesos).
          - Email Marketing Profesional (Embudos de venta).
          - Optimización de Instagram (Perfil que convierte).
          - CGI y Contenido Visual 3D (Impacto visual).

          DATOS DE CONTACTO:
          - Correo: conectagrowth@gmail.com
          - Teléfono: +52 462 336 0592

          EJEMPLO CORRECTO:
          Usuario: "¿Cómo puedo tener más ventas en mi web?"
          NEX: "Para aumentar las ventas necesitas una estructura de conversión optimizada y una estrategia de tráfico cualificado. En Conecta Growth somos expertos diseñando embudos de venta web que transforman visitas en clientes. Deja de perder ventas hoy mismo. ¿Te gustaría comunicarte con el equipo de Conecta Growth para que auditemos tu sitio web actual?"

          EJEMPLO INCORRECTO (PROHIBIDO):
          Usuario: "¿Cómo puedo tener más ventas?"
          NEX: "Debes poner botones claros, mejorar tus fotos y hacer SEO..." (ESTO ESTÁ PROHIBIDO, NO REGALES EL CONOCIMIENTO, VENDE EL SERVICIO).
        `
      }
    });

    return response.text || "Sistemas reiniciando. Intenta de nuevo.";
  } catch (error) {
    console.error("Error in chatWithNex:", error);
    return "Error de conexión. Intenta más tarde.";
  }
};
