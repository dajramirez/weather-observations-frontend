<template>
    <HelpPage title="Estaciones" role="Admin"
        description="La sección de estaciones permite gestionar de forma completa las estaciones meteorológicas del sistema. Desde aquí puedes crear, editar, eliminar y asignar observers a cada estación."
        :actions="actions"
        notes="Al eliminar una estación se eliminarán también todas sus observaciones, alertas y reportes asociados. Esta acción no se puede deshacer. Los administradores tienen acceso a todas las estaciones por defecto — aparecen indicados como '+ Administradores' en la columna de observadores." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar estaciones',
        description: 'Visualiza el listado completo de estaciones con su nombre, ubicación, altitud y los observers asignados. Los administradores aparecen como "+ Administradores" indicando que tienen acceso completo a todas las estaciones.'
    },
    {
        icon: '➕',
        title: 'Crear nueva estación',
        description: 'Haz clic en "Nueva estación" para abrir el formulario de creación. Rellena el nombre, ubicación, altitud y descripción opcional y guarda.'
    },
    {
        icon: '✏️',
        title: 'Editar estación',
        description: 'Haz clic en "Editar" para actualizar los datos de una estación existente.'
    },
    {
        icon: '🗑️',
        title: 'Eliminar estación',
        description: 'Haz clic en "Eliminar" para borrar una estación. Se pedirá confirmación antes de proceder.'
    },
    {
        icon: '👤',
        title: 'Asignar observer',
        description: 'Haz clic en "+ Asignar" en la columna de observadores para asignar un observer a la estación. Solo se pueden asignar usuarios con rol Observador.'
    },
    {
        icon: '❌',
        title: 'Desasignar observer',
        description: 'Haz clic en la "x" junto al nombre del observer para desasignarlo de esa estación.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para abrir un modal con toda la información detallada de la estación, incluyendo los observers asignados.'
    },
]
</script>