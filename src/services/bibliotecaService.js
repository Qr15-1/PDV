// src/services/bibliotecaService.js

/**
 * Capa de servicio para la Biblioteca.
 * Provee la estructura del menú y el contenido de cada manual.
 * Incluye datos de ejemplo mientras la API de WordPress no esté conectada.
 */

const WP_API_URL = import.meta.env.WP_API_URL;
const API_READY = WP_API_URL && WP_API_URL !== "https://tu-dominio.com";

// ══════════════════════════════════════════════════════
// DATOS DE EJEMPLO (se usan cuando la API no está lista)
// ══════════════════════════════════════════════════════

const SAMPLE_MENU = [
  {
    slug: "manuales",
    nombre: "Manuales operativos",
    icono: "RESUMEN",
    roles: [
      {
        slug: "supervisor",
        nombre: "Supervisor",
        temas: [
          { slug: "coordinar-personal", titulo: "¿Cómo coordinar el personal?" },
          { slug: "realizar-inventario", titulo: "¿Cómo realizar un inventario?" },
          { slug: "higiene-seguridad", titulo: "Normas de higiene y seguridad" },
          { slug: "horarios-atencion", titulo: "Horarios y atención" },
        ],
      },
      {
        slug: "atencion",
        nombre: "Atención al cliente",
        temas: [
          { slug: "protocolo-atencion", titulo: "Protocolo de atención" },
          { slug: "manejo-quejas", titulo: "Manejo de quejas" },
        ],
      },
      {
        slug: "cajero",
        nombre: "Cajero",
        temas: [
          { slug: "cierre-caja", titulo: "Cierre de caja" },
          { slug: "facturacion", titulo: "Facturación" },
        ],
      },
      {
        slug: "pizzero",
        nombre: "Maestro pizzero",
        temas: [
          { slug: "preparacion-masa", titulo: "Preparación de masa" },
          { slug: "uso-horno", titulo: "Uso del horno" },
        ],
      },
    ],
  },
  {
    slug: "identidad",
    nombre: "Identidad de marca",
    icono: "MARKETING",
    roles: [
      {
        slug: "diseno",
        nombre: "Diseño y comunicación",
        temas: [
          { slug: "uso-logo", titulo: "Uso correcto del logo" },
          { slug: "paleta-colores", titulo: "Paleta de colores oficial" },
          { slug: "tono-comunicacion", titulo: "Tono de comunicación" },
        ],
      },
    ],
  },
  {
    slug: "legales",
    nombre: "Documentos legales",
    icono: "SOPORTE",
    roles: [
      {
        slug: "administracion",
        nombre: "Administración",
        temas: [
          { slug: "contrato-trabajo", titulo: "Contrato de trabajo" },
          { slug: "politica-privacidad", titulo: "Política de privacidad" },
        ],
      },
    ],
  },
];

const SAMPLE_MANUALS = {
  "coordinar-personal": {
    id: 1,
    slug: "coordinar-personal",
    titulo: "¿Cómo coordinar el personal?",
    categoria: "Manuales operativos",
    rol: "Supervisor",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Objetivo</h2>
      <div class="bib-highlight">
        <p>Garantizar que cada turno cuente con el personal necesario, correctamente asignado y motivado para ofrecer el mejor servicio al cliente.</p>
      </div>
      <p>El supervisor es responsable de organizar los turnos semanales, asegurándose de que cada estación (cocina, caja, salón y delivery) tenga al menos un empleado capacitado.</p>

      <h2>Asignación de turnos</h2>
      <p>Los turnos se publican cada viernes para la semana siguiente. Utiliza la plantilla de turnos disponible en el sistema interno. Cada empleado debe confirmar su disponibilidad antes del miércoles.</p>
      <p>En caso de ausencia no planificada, el supervisor debe contactar al personal de respaldo dentro de los primeros 30 minutos del turno.</p>

      <h2>Reunión de inicio de turno</h2>
      <p>Cada turno comienza con una reunión de 5 minutos donde se revisan: metas del día, promociones activas, y cualquier novedad operativa. Esta reunión es obligatoria y debe documentarse en el libro de turno.</p>

      <h2>Evaluación del desempeño</h2>
      <div class="bib-highlight">
        <p>Cada mes se realiza una evaluación individual. Los criterios incluyen: puntualidad, actitud, velocidad de servicio y cumplimiento de normas de higiene.</p>
      </div>
    `,
  },
  "realizar-inventario": {
    id: 2,
    slug: "realizar-inventario",
    titulo: "¿Cómo realizar un inventario?",
    categoria: "Manuales operativos",
    rol: "Supervisor",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Frecuencia del inventario</h2>
      <div class="bib-highlight">
        <p>El inventario completo se realiza todos los lunes antes de las 10:00 AM. Se hace un conteo parcial de ingredientes perecederos todos los días al cierre.</p>
      </div>

      <h2>Procedimiento paso a paso</h2>
      <p><strong>1.</strong> Descarga la plantilla de inventario desde el sistema POS.</p>
      <p><strong>2.</strong> Recorre cada zona de almacenamiento: refrigerador, congelador, almacén seco y barra de preparación.</p>
      <p><strong>3.</strong> Cuenta cada ítem y registra la cantidad exacta. No redondees.</p>
      <p><strong>4.</strong> Compara con el inventario teórico del sistema. Si hay diferencias mayores al 5%, documenta y reporta al gerente.</p>

      <h2>Ingredientes críticos</h2>
      <p>Los siguientes ingredientes nunca deben estar por debajo del stock mínimo: harina (50 kg), queso mozzarella (20 kg), salsa de tomate (30 L), pepperoni (10 kg). Si alguno está en nivel crítico, hacer pedido inmediato.</p>
    `,
  },
  "higiene-seguridad": {
    id: 3,
    slug: "higiene-seguridad",
    titulo: "Normas de higiene y seguridad",
    categoria: "Manuales operativos",
    rol: "Supervisor",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Equipo obligatorio</h2>
      <div class="bib-highlight">
        <p>Es obligatorio usar guantes, redecillas para el cabello y delantal limpio durante todo el turno. Los utensilios deben desinfectarse cada 2 horas sin excepción.</p>
      </div>
      <p>El área de preparación debe mantenerse libre de objetos personales. Las superficies de trabajo se limpian con solución desinfectante al inicio y final de cada turno.</p>

      <h2>Control de temperatura</h2>
      <p>La temperatura del refrigerador debe verificarse cada mañana (máximo 4°C). El congelador debe mantenerse a -18°C o menos. Registra las temperaturas en el formulario diario.</p>

      <h2>Lavado de manos</h2>
      <p>Todo el personal debe lavarse las manos: al llegar, después de ir al baño, después de tocar dinero, antes de manipular alimentos, y cada 30 minutos durante la preparación.</p>
    `,
  },
  "horarios-atencion": {
    id: 4,
    slug: "horarios-atencion",
    titulo: "Horarios y atención",
    categoria: "Manuales operativos",
    rol: "Supervisor",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Horario de operación</h2>
      <div class="bib-highlight">
        <p>Lunes a sábado: 11:00 AM – 10:00 PM. Domingos: 12:00 PM – 9:00 PM. Todo el personal debe presentarse 30 minutos antes del inicio de su turno.</p>
      </div>

      <h2>Apertura del local</h2>
      <p>El encargado de apertura debe llegar a las 10:30 AM para: encender hornos, verificar limpieza, revisar inventario del día y preparar la masa fresca del turno. El local debe estar listo para recibir clientes a las 11:00 AM en punto.</p>

      <h2>Cierre del local</h2>
      <p>El cierre comienza 30 minutos antes de la hora de cierre. Se deja de aceptar pedidos en salón 15 minutos antes. Las tareas de cierre incluyen: limpieza profunda, cierre de caja, apagado de equipos y activación de alarma.</p>
    `,
  },
  "protocolo-atencion": {
    id: 5,
    slug: "protocolo-atencion",
    titulo: "Protocolo de atención",
    categoria: "Manuales operativos",
    rol: "Atención al cliente",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Bienvenida al cliente</h2>
      <div class="bib-highlight">
        <p>Todo cliente debe ser recibido con un saludo cálido dentro de los primeros 10 segundos de entrar al local: "¡Bienvenido a Pizza de Verdad! ¿Mesa para cuántos?"</p>
      </div>

      <h2>Toma de pedido</h2>
      <p>Acércate a la mesa dentro de los primeros 2 minutos. Presenta el menú del día y las promociones activas. Repite el pedido completo antes de confirmarlo. Siempre sugiere una bebida o complemento.</p>

      <h2>Entrega y seguimiento</h2>
      <p>La comida debe entregarse en máximo 15 minutos para pedidos en salón. Después de la entrega, pasa a verificar la satisfacción del cliente dentro de los primeros 3 minutos.</p>

      <h2>Despedida</h2>
      <p>Al momento de pagar, agradece la visita: "¡Gracias por visitarnos! Esperamos verte pronto." Siempre menciona las redes sociales de la marca.</p>
    `,
  },
  "manejo-quejas": {
    id: 6,
    slug: "manejo-quejas",
    titulo: "Manejo de quejas",
    categoria: "Manuales operativos",
    rol: "Atención al cliente",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Principio fundamental</h2>
      <div class="bib-highlight">
        <p>El cliente siempre tiene la oportunidad de ser escuchado. Nunca discutas, nunca interrumpas, nunca tomes una queja como algo personal.</p>
      </div>

      <h2>Protocolo de 4 pasos</h2>
      <p><strong>1. Escucha:</strong> Deja que el cliente se exprese por completo sin interrumpirlo.</p>
      <p><strong>2. Discúlpate:</strong> "Lamento mucho la situación. Vamos a solucionarlo de inmediato."</p>
      <p><strong>3. Actúa:</strong> Ofrece una solución concreta (reposición, descuento, o invitación futura).</p>
      <p><strong>4. Documenta:</strong> Registra la queja en el sistema con: fecha, motivo, solución dada y nombre del empleado.</p>
    `,
  },
  "cierre-caja": {
    id: 7,
    slug: "cierre-caja",
    titulo: "Cierre de caja",
    categoria: "Manuales operativos",
    rol: "Cajero",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Procedimiento de cierre</h2>
      <div class="bib-highlight">
        <p>El cierre de caja se realiza al final de cada turno. Nunca debe haber más de un turno sin cerrar. El cajero es responsable directo del cuadre.</p>
      </div>

      <h2>Pasos del cierre</h2>
      <p><strong>1.</strong> Imprime el reporte Z del punto de venta.</p>
      <p><strong>2.</strong> Cuenta el efectivo en caja separando por denominación.</p>
      <p><strong>3.</strong> Verifica los pagos electrónicos contra los vouchers.</p>
      <p><strong>4.</strong> Si hay diferencia mayor a $1, documenta y notifica al supervisor.</p>
      <p><strong>5.</strong> Deposita el efectivo en la caja fuerte y firma el libro de cierres.</p>
    `,
  },
  "facturacion": {
    id: 8,
    slug: "facturacion",
    titulo: "Facturación",
    categoria: "Manuales operativos",
    rol: "Cajero",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Emisión de facturas</h2>
      <div class="bib-highlight">
        <p>Toda venta debe generar un comprobante fiscal. El cliente puede solicitar factura con datos fiscales; en ese caso, pide el RIF antes de procesar el pago.</p>
      </div>

      <h2>Tipos de comprobante</h2>
      <p><strong>Ticket de venta:</strong> Se emite automáticamente para toda transacción.</p>
      <p><strong>Factura fiscal:</strong> Se genera cuando el cliente lo solicita. Requiere: nombre o razón social, RIF, y dirección fiscal.</p>

      <h2>Correcciones</h2>
      <p>Si se comete un error en la factura, NO la taches. Emite una nota de crédito y genera una nueva factura. Toda corrección debe llevar la firma del supervisor.</p>
    `,
  },
  "preparacion-masa": {
    id: 9,
    slug: "preparacion-masa",
    titulo: "Preparación de masa",
    categoria: "Manuales operativos",
    rol: "Maestro pizzero",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Receta base (10 bolas de masa)</h2>
      <div class="bib-highlight">
        <p>Ingredientes: 1 kg harina 00, 600 ml agua tibia (26°C), 25 g sal, 3 g levadura seca, 30 ml aceite de oliva. Tiempo total de preparación: 2 horas (incluye reposo).</p>
      </div>

      <h2>Procedimiento</h2>
      <p><strong>1.</strong> Disuelve la levadura en el agua tibia. Deja reposar 5 minutos hasta que haga espuma.</p>
      <p><strong>2.</strong> En la mezcladora, coloca la harina y la sal. Agrega el agua con levadura gradualmente.</p>
      <p><strong>3.</strong> Mezcla a velocidad baja por 4 minutos, luego a velocidad media por 6 minutos.</p>
      <p><strong>4.</strong> Agrega el aceite y mezcla 2 minutos más. La masa debe despegarse de las paredes.</p>
      <p><strong>5.</strong> Divide en bolas de 250 g. Coloca en bandejas engrasadas, cubre con film y refrigera mínimo 1 hora.</p>

      <h2>Señales de una buena masa</h2>
      <p>Lisa, elástica, no se pega a las manos. Al estirarla con los dedos, debe poder formar una ventana translúcida sin romperse (prueba de la ventana).</p>
    `,
  },
  "uso-horno": {
    id: 10,
    slug: "uso-horno",
    titulo: "Uso del horno",
    categoria: "Manuales operativos",
    rol: "Maestro pizzero",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Encendido y precalentamiento</h2>
      <div class="bib-highlight">
        <p>El horno debe encenderse 45 minutos antes de la primera pizza. Temperatura objetivo: 300°C para horno industrial, 400°C para horno de leña.</p>
      </div>

      <h2>Tiempos de cocción</h2>
      <p><strong>Pizza tradicional (30 cm):</strong> 6-8 minutos a 300°C.</p>
      <p><strong>Pizza napolitana:</strong> 90 segundos a 400°C (horno de leña).</p>
      <p><strong>Calzone:</strong> 8-10 minutos a 280°C.</p>

      <h2>Seguridad</h2>
      <p>Siempre usa guantes térmicos certificados. Nunca dejes la puerta del horno abierta más de 10 segundos. En caso de humo excesivo, apaga el horno y ventila el área antes de investigar.</p>
    `,
  },
  "uso-logo": {
    id: 11,
    slug: "uso-logo",
    titulo: "Uso correcto del logo",
    categoria: "Identidad de marca",
    rol: "Diseño y comunicación",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Versiones del logo</h2>
      <div class="bib-highlight">
        <p>El logo de Pizza de Verdad tiene 3 versiones oficiales: completo (isotipo + texto), isotipo solo (Beto), y texto solo. El uso depende del contexto y el espacio disponible.</p>
      </div>

      <h2>Zona de protección</h2>
      <p>El logo debe tener un espacio libre alrededor equivalente a la altura de la letra "P" del logotipo. Ningún elemento gráfico, texto o borde debe invadir esta zona.</p>

      <h2>Usos prohibidos</h2>
      <p>No rotar el logo. No cambiar los colores. No estirar ni comprimir. No colocar sobre fondos que dificulten la lectura. No agregar sombras, contornos ni efectos.</p>
    `,
  },
  "paleta-colores": {
    id: 12,
    slug: "paleta-colores",
    titulo: "Paleta de colores oficial",
    categoria: "Identidad de marca",
    rol: "Diseño y comunicación",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Colores primarios</h2>
      <div class="bib-highlight">
        <p>Rojo Pizza de Verdad: #D11A1A — Es el color principal de la marca. Se usa en fondos, botones y elementos destacados.</p>
      </div>
      <p><strong>Crema suave:</strong> #FFF8F1 — Fondo de paneles y tarjetas.</p>
      <p><strong>Negro marca:</strong> #1A1A1A — Textos principales y elementos de contraste.</p>

      <h2>Colores secundarios</h2>
      <p><strong>Dorado acento:</strong> #D4A017 — Gráficas, highlights y barras de cita.</p>
      <p><strong>Gris texto:</strong> #666666 — Textos secundarios y metadatos.</p>

      <h2>Regla de uso</h2>
      <p>El rojo no debe ocupar más del 30% de una composición. El crema es el color dominante en interfaces. El dorado se usa exclusivamente para acentos y nunca como fondo.</p>
    `,
  },
  "tono-comunicacion": {
    id: 13,
    slug: "tono-comunicacion",
    titulo: "Tono de comunicación",
    categoria: "Identidad de marca",
    rol: "Diseño y comunicación",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Personalidad de marca</h2>
      <div class="bib-highlight">
        <p>Pizza de Verdad habla como un amigo cercano que sabe de pizza: cercano, divertido, orgulloso de su producto y siempre honesto. Nunca corporativo, nunca frío.</p>
      </div>

      <h2>Ejemplos de tono</h2>
      <p><strong> Correcto:</strong> "¡Tu pizza está en camino!  Fresquita del horno, como debe ser."</p>
      <p><strong> Incorrecto:</strong> "Su pedido ha sido procesado y se encuentra en tránsito."</p>

      <h2>Reglas clave</h2>
      <p>Tutear siempre al cliente. Usar emojis con moderación (máximo 2 por mensaje). Evitar tecnicismos. Las publicaciones en redes sociales deben incluir al menos una referencia a "de verdad" como juego de palabras.</p>
    `,
  },
  "contrato-trabajo": {
    id: 14,
    slug: "contrato-trabajo",
    titulo: "Contrato de trabajo",
    categoria: "Documentos legales",
    rol: "Administración",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Tipo de contrato</h2>
      <div class="bib-highlight">
        <p>Todo empleado de Pizza de Verdad firma un contrato a término fijo de 6 meses, renovable automáticamente. Incluye período de prueba de 30 días.</p>
      </div>

      <h2>Cláusulas principales</h2>
      <p><strong>Jornada laboral:</strong> 8 horas diarias, 44 horas semanales. Horas extra se pagan al 150%.</p>
      <p><strong>Beneficios:</strong> Almuerzo incluido durante el turno, uniforme proporcionado por la empresa, descuento del 30% en productos para consumo personal.</p>
      <p><strong>Confidencialidad:</strong> Las recetas y procesos internos son propiedad exclusiva de Pizza de Verdad y no pueden compartirse.</p>
    `,
  },
  "politica-privacidad": {
    id: 15,
    slug: "politica-privacidad",
    titulo: "Política de privacidad",
    categoria: "Documentos legales",
    rol: "Administración",
    autor: "Pizza de Verdad",
    contenido_html: `
      <h2>Datos que recopilamos</h2>
      <div class="bib-highlight">
        <p>Pizza de Verdad recopila: nombre, teléfono, dirección de entrega y correo electrónico. Estos datos se usan exclusivamente para procesar pedidos y mejorar el servicio.</p>
      </div>

      <h2>Almacenamiento</h2>
      <p>Los datos se almacenan en servidores seguros con encriptación SSL. No se comparten con terceros salvo para procesamiento de pagos (proveedor certificado PCI DSS).</p>

      <h2>Derechos del cliente</h2>
      <p>Todo cliente puede solicitar: acceso a sus datos, corrección de información errónea, y eliminación completa de sus datos. Las solicitudes se procesan en un máximo de 5 días hábiles.</p>
    `,
  },
};

// ══════════════════════════════════════════════════════
// FUNCIONES PÚBLICAS
// ══════════════════════════════════════════════════════

/**
 * Menú de categorías con estructura completa.
 * @returns {Promise<import('../types/biblioteca').MenuCategoria[]>}
 */
export async function getCategoriasMenu() {
  if (API_READY) {
    try {
      const res = await fetch(`${WP_API_URL}/wp-json/pdv/v1/biblioteca/menu`, {
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        const raw = await res.json();
        return mapMenu(raw);
      }
    } catch (err) {
      console.error("[bibliotecaService] Error menu:", err.message);
    }
  }
  // Devolver datos de ejemplo
  return SAMPLE_MENU;
}

/**
 * Obtiene un manual por su slug.
 * @param {string} slug
 * @returns {Promise<import('../types/biblioteca').Manual | null>}
 */
export async function getManualBySlug(slug) {
  if (!slug) return null;

  if (API_READY) {
    try {
      const res = await fetch(`${WP_API_URL}/wp-json/pdv/v1/manuales/${encodeURIComponent(slug)}`, {
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        const raw = await res.json();
        return mapManual(raw);
      }
    } catch (err) {
      console.error("[bibliotecaService] Error manual:", err.message);
    }
  }
  // Devolver manual de ejemplo si existe
  return SAMPLE_MANUALS[slug] ?? null;
}

/**
 * Devuelve todos los manuales como diccionario slug → manual.
 * Se usa para inyectar el contenido en el cliente (modo estático).
 * @returns {Promise<Record<string, import('../types/biblioteca').Manual>>}
 */
export async function getAllManuales() {
  if (API_READY) {
    try {
      const res = await fetch(`${WP_API_URL}/wp-json/pdv/v1/manuales`, {
        headers: { "Accept": "application/json" },
      });
      if (res.ok) {
        const raw = await res.json();
        const result = {};
        if (Array.isArray(raw)) {
          raw.forEach((m) => {
            const mapped = mapManual(m);
            if (mapped && mapped.slug) result[mapped.slug] = mapped;
          });
        }
        return result;
      }
    } catch (err) {
      console.error("[bibliotecaService] Error all manuales:", err.message);
    }
  }
  return SAMPLE_MANUALS;
}

// ── Mappers ──

function mapMenu(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((cat) => ({
    slug: cat.slug ?? "",
    nombre: cat.nombre ?? "",
    icono: cat.icono ?? "RESUMEN",
    roles: Array.isArray(cat.roles)
      ? cat.roles.map((r) => ({
        slug: r.slug ?? "",
        nombre: r.nombre ?? "",
        temas: Array.isArray(r.temas)
          ? r.temas.map((t) => ({
            slug: t.slug ?? "",
            titulo: t.titulo ?? "",
          }))
          : [],
      }))
      : [],
  }));
}

function mapManual(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? 0,
    slug: raw.slug ?? "",
    titulo: raw.titulo ?? "",
    categoria: raw.categoria ?? "",
    rol: raw.rol ?? "",
    autor: raw.autor ?? "Pizza de Verdad",
    contenido_html: raw.contenido_html ?? null,
  };
}

