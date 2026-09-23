<script lang="ts">
  const { name = '', value = {}, updateArg = null } = $props()

  let invalidJson = $state(false)

  let valueAsString = $state('{}')
  $effect(() => {
    invalidJson = false

    try {
      valueAsString = JSON.stringify(value, null, 2)
    } catch (e) {
      invalidJson = true
    }
  })

  const handleInput = (event) => {
    invalidJson = false

    try {
      const data = JSON.parse(event.currentTarget.value)
      return updateArg(data)
    } catch (e) {
      invalidJson = true
    }
  }
</script>

<span>{name}</span>
<textarea class={{ error: invalidJson }} rows="4" value={valueAsString} oninput={handleInput}
></textarea>

<style>
  .error {
    border-color: red;
  }
</style>
