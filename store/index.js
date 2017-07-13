export const state = () => ({
  book: {
    title: '',
    url: ''
  }
})

export const mutations = {
  setTitle (state, title) {
    state.book.title = title
  },
  setUrl (state, url) {
    state.book.url = url
  }
}
