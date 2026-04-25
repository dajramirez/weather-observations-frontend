<template>
    <HelpPage title="Observaciones" role="Admin"
        description="La sección de observaciones muestra todas las observaciones meteorológicas registradas en el sistema por cualquier observador. Puedes crear nuevas observaciones en cualquier estación, consultarlas, editarlas y eliminarlas."
        :actions="actions" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar observaciones',
        description: 'Visualiza el listado paginado de todas las observaciones con su fecha, estación, observador y valores meteorológicos. Usa los botones "Anterior" y "Siguiente" para navegar entre páginas.'
    },
    {
        icon: '➕',
        title: 'Crear nueva observación',
        description: 'Haz clic en "Nueva observación" para registrar una observación en cualquier estación del sistema. Como administrador puedes registrar observaciones en todas las estaciones, sin necesidad de tenerlas asignadas.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para abrir un modal con todos los valores de la observación: temperatura, humedad, presión, viento y precipitación.'
    },
    {
        icon: '✏️',
        title: 'Editar observación',
        description: 'Haz clic en "Editar" para modificar los valores de una observación existente. Puedes actualizar cualquier campo meteorológico.'
    },
    {
        icon: '🗑️',
        title: 'Eliminar observación',
        description: 'Haz clic en "Eliminar" para borrar una observación del sistema. Se pedirá confirmación antes de proceder. Esta acción no se puede deshacer.'
    },
]
</script>