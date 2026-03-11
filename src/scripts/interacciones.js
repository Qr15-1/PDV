
document.addEventListener("astro:page-load", () => {
  // Re-añade app-lista para mantener las transiciones suaves en cada página
  requestAnimationFrame(() => {
    document.documentElement.classList.add("app-lista");
  });

  // Actualiza el ítem activo del menú
  const currentPath = window.location.pathname;
  document.querySelectorAll(".menu-item").forEach((item) => {
    const href = item.getAttribute("href");
    if (href === currentPath) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
});


