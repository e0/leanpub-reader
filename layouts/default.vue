<template>
  <div>
    <nuxt/>
  </div>
</template>

<style lang='sass'>

$primary: #141517

@import '~bulma'

html body
  color: $primary
  background-color: #FFFEF9

.title
  font-weight: 600
  &.is-6
    font-weight: 400
[disabled]
  pointer-events: none

</style>
