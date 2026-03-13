// src/services/resumenService.js

/**
 * Capa de servicio para la sección Resumen.
 * Consume la REST API de WordPress y devuelve datos limpios.
 * Si la API no está disponible, devuelve un objeto con valores null.
 */

const WP_API_URL = import.meta.env.WP_API_URL;

/**
 * Objeto vacío que se devuelve cuando la API falla o no está configurada.
 * Garantiza que el frontend nunca rompa.
 */
function emptyData() {
    return {
        metricas: {
            ventas_mes: null,
            costo_producto: null,
            ticket_promedio: null,
            pizza_mas_vendida: null,
            venta_pickup: null,
            venta_delivery: null,
            venta_mesa: null,
        },
        noticias: [],
        usuario: {
            nombre: null,
            avatar_url: null,
            rol: null,
        },
        grafica_ventas: [],
    };
}

/**
 * Limpia y mapea la respuesta cruda de WordPress al schema esperado.
 * Todo el filtrado y procesamiento ocurre aquí, NO en los componentes.
 */
function mapResponse(raw) {
    return {
        metricas: {
            ventas_mes: raw?.metricas?.ventas_mes ?? null,
            costo_producto: raw?.metricas?.costo_producto ?? null,
            ticket_promedio: raw?.metricas?.ticket_promedio ?? null,
            pizza_mas_vendida: raw?.metricas?.pizza_mas_vendida ?? null,
            venta_pickup: raw?.metricas?.venta_pickup ?? null,
            venta_delivery: raw?.metricas?.venta_delivery ?? null,
            venta_mesa: raw?.metricas?.venta_mesa ?? null,
        },
        noticias: Array.isArray(raw?.noticias)
            ? raw.noticias.map((n) => ({
                id: n.id ?? 0,
                titulo: n.titulo ?? "",
                fecha: n.fecha ?? "",
                link: n.link ?? "#",
                icono_slug: n.icono_slug ?? "enlace+",
            }))
            : [],
        usuario: {
            nombre: raw?.usuario?.nombre ?? null,
            avatar_url: raw?.usuario?.avatar_url ?? null,
            rol: raw?.usuario?.rol ?? null,
        },
        grafica_ventas: Array.isArray(raw?.grafica_ventas)
            ? raw.grafica_ventas.map((g) => ({
                mes: g.mes ?? "",
                monto: typeof g.monto === "number" ? g.monto : null,
            }))
            : [],
    };
}

/**
 * Obtiene los datos del Resumen desde la REST API de WordPress.
 * @returns {Promise<import('../types/resumen').ResumenData>}
 */
export async function getResumenData() {
    // Si la URL no está configurada, devolver datos vacíos
    if (!WP_API_URL || WP_API_URL === "https://tu-dominio.com") {
        console.warn("[resumenService] WP_API_URL no configurada. Usando datos vacíos.");
        return emptyData();
    }

    try {
        const res = await fetch(`${WP_API_URL}/wp-json/pdv/v1/resumen`, {
            headers: { "Accept": "application/json" },
        });

        if (!res.ok) {
            console.error(`[resumenService] HTTP ${res.status}: ${res.statusText}`);
            return emptyData();
        }

        const raw = await res.json();
        return mapResponse(raw);
    } catch (err) {
        console.error("[resumenService] Error de conexión:", err.message);
        return emptyData();
    }
}
