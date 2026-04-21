<template>
    <HelpPage title="Alertas" role="User"
        description="La sección de alertas te muestra las alertas meteorológicas activas en el sistema. Esta sección es de solo lectura — no puedes modificar ni gestionar las alertas."
        :actions="actions" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar alertas activas',
        description: 'Visualiza el listado paginado de todas las alertas activas con información sobre la estación afectada, el tipo de alerta, el mensaje descriptivo y la fecha de creación.'
    },
    {
        icon: '🏷️',
        title: 'Niveles de alerta',
        description: 'Las alertas se clasifican en cuatro niveles según su gravedad: verde (informativo), amarillo (precaución), naranja (advertencia seria) y rojo (peligro extremo).'
    },
    {
        icon: '📄',
        title: 'Paginación',
        description: 'Usa los botones "Anterior" y "Siguiente" en la parte inferior de la tabla para navegar entre páginas cuando hay muchas alertas activas.'
    },
]
</script>