<template>
    <HelpPage title="Reportes" role="Observer"
        description="La sección de reportes te permite generar informes de tus propias observaciones en una estación y rango de fechas determinados. También puedes consultar el historial de reportes generados y los reportes públicos de otros usuarios."
        :actions="actions"
        notes="Solo se incluyen en el reporte las observaciones que tú has registrado. Si no hay observaciones tuyas en el rango seleccionado, el reporte no mostrará resultados." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📊',
        title: 'Generar reporte',
        description: 'Selecciona una estación, una fecha de inicio y una fecha de fin y haz clic en "Generar reporte". Se mostrarán tus observaciones del período con estadísticas de temperatura y precipitación.'
    },
    {
        icon: '📄',
        title: 'Descargar PDF',
        description: 'Una vez generado el reporte, haz clic en "Descargar PDF" para abrir el diálogo de impresión del navegador y guardar el reporte como PDF.'
    },
    {
        icon: '✖️',
        title: 'Cerrar reporte',
        description: 'Haz clic en "Cerrar" para ocultar los resultados. El reporte quedará guardado automáticamente en el historial.'
    },
    {
        icon: '📋',
        title: 'Historial de reportes',
        description: 'La tabla inferior muestra tus reportes generados y los reportes públicos de otros observers, con su estación, período y estado de visibilidad.'
    },
    {
        icon: '🔍',
        title: 'Ver reporte del historial',
        description: 'Haz clic en "Ver" en cualquier reporte del historial para consultar las observaciones de ese período.'
    },
    {
        icon: '🌐',
        title: 'Cambiar visibilidad',
        description: 'Haz clic en "Hacer público" o "Hacer privado" para controlar si tu reporte es visible para los usuarios con rol User. Solo puedes cambiar la visibilidad de tus propios reportes.'
    },
]
</script>