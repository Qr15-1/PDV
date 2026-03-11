// src/types/biblioteca.ts

/** Tema/manual individual dentro de un rol */
export interface Manual {
    id: number;
    slug: string;
    titulo: string;
    categoria: string;
    rol: string;
    autor: string;
    contenido_html: string | null;
}

/** Sub-tema en el menú lateral */
export interface MenuTema {
    slug: string;
    titulo: string;
}

/** Rol (acordeón) con sus temas */
export interface MenuRol {
    slug: string;
    nombre: string;
    temas: MenuTema[];
}

/** Categoría con ícono y roles */
export interface MenuCategoria {
    slug: string;
    nombre: string;
    icono: string;
    roles: MenuRol[];
}
