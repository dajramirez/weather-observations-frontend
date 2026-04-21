<template>
    <HelpPage title="Reportes" role="Admin"
        description="La sección de reportes permite generar informes meteorológicos de cualquier estación en un rango de fechas determinado. Los reportes generados quedan registrados en el historial y pueden hacerse públicos para que otros usuarios los consulten."
        :actions="actions"
        notes="Los reportes muestran todas las observaciones de la estación en el rango indicado, independientemente del observer que las registró." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📊',
        title: 'Generar reporte',
        description: 'Selecciona una estación, una fecha de inicio y una fecha de fin y haz clic en "Generar reporte". Se mostrarán todas las observaciones del período con estadísticas de temperatura y precipitación.'
    },
    {
        icon: '📄',
        title: 'Descargar PDF',
        description: 'Una vez generado el reporte, haz clic en "Descargar PDF" para abrir el diálogo de impresión del navegador y guardar el reporte como PDF.'
    },
    {
        icon: '✖️',
        title: 'Cerrar reporte',
        description: 'Haz clic en "Cerrar" para ocultar los resultados del reporte generado. El reporte quedará guardado automáticamente en el historial.'
    },
    {
        icon: '📋',
        title: 'Historial de reportes',
        description: 'La tabla inferior muestra todos los reportes generados anteriormente con su estación, período y estado de visibilidad.'
    },
    {
        icon: '🔍',
        title: 'Ver reporte del historial',
        description: 'Haz clic en "Ver" en cualquier reporte del historial para consultar las observaciones de ese período.'
    },
    {
        icon: '🌐',
        title: 'Cambiar visibilidad',
        description: 'Haz clic en "Hacer público" o "Hacer privado" para controlar si el reporte es visible para los usuarios con rol User.'
    },
]
</script>