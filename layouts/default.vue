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
  background-color: #FFF
pre
  background-color: #F9FAFA
  code
    padding: 0
    display: inline
.title
  font-weight: 600
  &.is-6
    font-weight: 400

a:hover
  text-decoration: underline

</style>
