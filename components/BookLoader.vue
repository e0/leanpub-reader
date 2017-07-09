<template>
  <div class="wrapper">
    <div class="toc-wrapper">
      <div class="toc">
        <div v-for="chapter in chapters">
          <h1
            :class="{ current: chapter.id === currentSectionId }"
            class="title is-5"
            @click="goToSection(chapter.id)"
          >{{ chapter.name }}</h1>
          <ul
            <li
              v-for="section in chapter.sections"
              @click="goToSection(section.id)"
              :class="{ current: section.id === currentSectionId }"
              class="title is-6"
            >{{ section.name }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div
        :disabled="isFirstSection"
        @click="goToPrevSection"
        class="icon page-turner"
      >
        <i class="fa fa-angle-left"></i>
      </div>
      <div v-html="currentSectionContent" class="content">
      </div>
      <div
        :disabled="isLastSection"
        @click="goToNextSection"
        class="icon page-turner"
      >
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script>

// import axios from 'axios'
import cheerio from 'cheerio'
import sampleBook from '~static/sample-book.txt'

export default {
  data () {
    return {
      chapters: [],
      currentSectionId: '',
      currentSectionContent: ''
    }
  },
  created () {
    this.findBookNode()
    // const bookUrl = 'https://leanpub.com/haskell-cookbook/read'
    // axios.get(bookUrl)
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
  },
  mounted () {
    window.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case 37:
          this.goToPrevSection()
          break
        case 39:
          this.goToNextSection()
          break
      }
    })
  },
  computed: {
    isFirstSection () {
      return this.currentSectionId === this.chapters[0].id
    },
    isLastSection () {
      const lastChapter = this.chapters[this.chapters.length - 1]
      let lastSectionId = lastChapter.id
      if (lastChapter.sections.length > 0) {
        lastSectionId = lastChapter.sections[lastChapter.sections.length - 1].id
      }
      return this.currentSectionId === lastSectionId
    }
  },
  methods: {
    findBookNode: function () {
      const $ = cheerio.load(sampleBook)
      const toc = $('.toc.no-parts > li')

      if (toc.length > 0) {
        this.chapters = []

        toc.each((i, chapterNode) => {
          let chapterNodeLink = $(chapterNode).find('a')[0]
          let chapter = {
            id: $(chapterNodeLink).attr('href'),
            name: $(chapterNodeLink).text(),
            sections: []
          }
          let sectionNodes = $(chapterNode).find('ul > li')
          sectionNodes.each((j, sectionNode) => {
            let sectionNodeLink = $(sectionNode).find('a')[0]
            let section = {
              id: $(sectionNodeLink).attr('href'),
              name: $(sectionNodeLink).text()
            }

            chapter.sections.push(section)
          })

          this.chapters.push(chapter)
        })

        this.goToSection(this.chapters[0].id)
      }
    },
    goToSection: function (sectionId) {
      this.currentSectionContent = ''
      this.currentSectionId = sectionId

      const $ = cheerio.load(sampleBook)
      this.currentSectionContent += $(sectionId)

      let section = $(sectionId).nextUntil('h2')
      if (this.outerEl(section).find('h3').length > 0) {
        section = $(sectionId).nextUntil('h3')
      }
      section.each((i, nextPart) => {
        const outerHtml = this.outerEl($(nextPart)).html()
        this.currentSectionContent += outerHtml
      })
    },
    goToNextSection: function () {
      for (let i = 0; i < this.chapters.length; i += 1) {
        const chapter = this.chapters[i]
        if (chapter.id === this.currentSectionId) { // is a chapter
          if (chapter.sections.length > 0) { // first section of chapter
            this.goToSection(chapter.sections[0].id)
            return
          }
          // next chapter
          if (i === this.chapters.length - 1) {
            return
          }
          this.goToSection(this.chapters[i + 1].id)
          return
        }

        // is a section
        for (let j = 0; j < chapter.sections.length; j += 1) {
          const section = chapter.sections[j]
          if (section.id === this.currentSectionId) {
            if (j !== chapter.sections.length - 1) {
              this.goToSection(chapter.sections[j + 1].id)
              return
            }
            // next chapter
            if (i === this.chapters.length - 1) {
              return
            }
            this.goToSection(this.chapters[i + 1].id)
            return
          }
        }
      }
    },
    goToPrevSection: function () {
      for (let i = 0; i < this.chapters.length; i += 1) {
        const chapter = this.chapters[i]
        if (chapter.id === this.currentSectionId) { // is a chapter
          if (i === 0) {
            return
          }
          const prevChapter = this.chapters[i - 1]
          if (prevChapter.sections.length > 0) { // last section of prev chapter
            this.goToSection(prevChapter.sections[prevChapter.sections.length - 1].id)
            return
          }
          // last chapter
          this.goToSection(prevChapter.id)
          return
        }

        // is a section
        for (let j = 0; j < chapter.sections.length; j += 1) {
          const section = chapter.sections[j]
          if (section.id === this.currentSectionId) {
            if (j !== 0) { // not first section
              this.goToSection(chapter.sections[j - 1].id)
              return
            }
            this.goToSection(chapter.id)
            return
          }
        }
      }
    },
    outerEl: (el) => {
      return el.clone().wrap('<container />').parent()
    }
  }
}

</script>

<style lang='sass'>

.wrapper
  background-color: #FFFEF9

  .toc-wrapper
    position: fixed
    height: 100vh
    overflow-y: scroll
    width: 350px
    padding: 0 25px 70px
    background-color: #FFF
    border-right: 1px solid #F4F5F5

    .toc
      padding-top: 25px

      div
        margin-top: 1.8rem

      li
        list-style: none

      h1, li
        padding: 5px 10px
        margin: -5px -10px
        cursor: pointer
        margin-bottom: 5px

        &.current, &:hover
          background: rgba(214, 212, 200, 0.42)
          border-radius: 3px

  .content-wrapper
    display: flex
    margin-left: 350px
    height: 100vh

    .page-turner
      position: fixed
      display: flex
      flex-direction: column
      justify-content: center
      height: 100%
      width: 100px
      cursor: pointer
      &:hover
        background: rgba(214, 212, 200, 0.2)
      &[disabled]
        opacity: 0.3
      &:last-child
        right: 0

    .content
      margin-left: 100px
      padding: 42px 10px 65px 10px
      height: 100%
      width: calc(100% - 200px)
      overflow-y: auto

      h2, h3
        font-size: 35px
        font-weight: 600

      h4
        font-size: 25px
        font-weight: 600
        margin-top: 25px

      p
        font-size: 18px

      figure.code
        margin-bottom: 18px

      pre
        background-color: #F4F5F5
        text-align: left

        code
          padding: 0
          display: inline
          font-family: 'Courier New'
          font-size: 16px

</style>
