
/* Métricas principales del dashboard */
export interface ResumenMetricas {
    ventas_mes: number | null;
    costo_producto: number | null;
    ticket_promedio: number | null;
    pizza_mas_vendida: string | null;
}

/* Noticia individual */
export interface Noticia {
    id: number;
    titulo: string;
    fecha: string;
    link: string;
    icono_slug: string;
}

/* Datos del usuario autenticado */
export interface Usuario {
    nombre: string;
    avatar_url: string | null;
    rol: string;
}

/* Punto de datos de la gráfica de ventas */
export interface GraficaVenta {
    mes: string;
    monto: number | null;
}

/* Objeto raíz de la respuesta del servicio */
export interface ResumenData {
    metricas: ResumenMetricas;
    noticias: Noticia[];
    usuario: Usuario;
    grafica_ventas: GraficaVenta[];
}
