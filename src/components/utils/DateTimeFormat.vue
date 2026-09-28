<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
	timestamp: {
		type: [Number, String, Date],
		required: true
	},
	dateOnly: {
		type: Boolean,
		default: false,
	}
})

const formattedDate = computed(() => {
	if (!props.timestamp) return ''

	const value = Number(props.timestamp)
	const date = new Date(value < 1e12 ? value * 1000 : value)
	
	if (isNaN(date.getTime())) return 'Incorrect date'

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: props.dateOnly ? undefined : '2-digit',
		minute: props.dateOnly ? undefined : '2-digit'
	}).format(date)
})
</script>

<template>
	<time :datetime="new Date(timestamp).toISOString()">
		{{ formattedDate }}
	</time>
</template>