<script lang="ts">
  let { onclick, onkeydown }: { onclick: () => void; onkeydown: () => void } = $props()
</script>

<button {onclick} {onkeydown}>Press</button>
