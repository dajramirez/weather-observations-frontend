<template>
    <HelpPage title="Estaciones" role="Admin"
        description="La sección de estaciones permite gestionar de forma completa las estaciones meteorológicas del sistema. Desde aquí puedes crear, editar, eliminar y asignar observers a cada estación."
        :actions="actions"
        notes="Al eliminar una estación se eliminarán también todas sus observaciones, alertas y reportes asociados. Esta acción no se puede deshacer." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar estaciones',
        description: 'Visualiza el listado completo de estaciones con su nombre, ubicación, altitud y los observers asignados a cada una.'
    },
    {
        icon: '➕',
        title: 'Crear nueva estación',
        description: 'Haz clic en "Nueva estación" para abrir el formulario de creación. Rellena el nombre, ubicación, altitud y descripción opcionales y guarda.'
    },
    {
        icon: '✏️',
        title: 'Editar estación',
        description: 'Haz clic en "Editar" en la fila de la estación que desees modificar para actualizar sus datos.'
    },
    {
        icon: '🗑️',
        title: 'Eliminar estación',
        description: 'Haz clic en "Eliminar" para borrar una estación. Se pedirá confirmación antes de proceder.'
    },
    {
        icon: '👤',
        title: 'Asignar observer',
        description: 'Haz clic en "+ Asignar" en la columna de observadores para asignar un observer existente a la estación.'
    },
    {
        icon: '❌',
        title: 'Desasignar observer',
        description: 'Haz clic en la "x" junto al nombre del observer en la columna de observadores para desasignarlo de esa estación.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para abrir un modal con toda la información detallada de la estación, incluyendo los observers asignados.'
    },
]
</script>