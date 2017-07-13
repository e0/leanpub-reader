export const state = () => ({
  bookUrl: '',
  list: []
})

export const mutations = {
  setBookUrl (state, url) {
    state.bookUrl = url
  },
  setChapters (state, chapters) {
    state.list = chapters
  },
  toggleChapter (state, chapter) {
    chapter.done = !chapter.done
  },
  toggleSection (state, section) {
    section.done = !section.done
  }
}
