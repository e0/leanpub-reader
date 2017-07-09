<template>
  <div class="wrapper">
    <div class="toc">
      <div v-for="chapter in chapters">
        <h1 class="title is-5">
          <a
            @click="goToChapter(chapter.id)"
          >{{ chapter.name }}</a>
        </h1>
        <ul
          <li class="title is-6" v-for="section in chapter.sections">
            <a
              :href="section.id"
              @click="goToSection(section.id)"
            >{{ section.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-html="currentSectionContent" class="content">
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
      }
    },
    goToChapter: function (chapterId) {
      this.currentSectionContent = ''

      const $ = cheerio.load(sampleBook)
      this.currentSectionContent += $(chapterId)

      let chapter = $(chapterId).nextUntil('h2')
      if (this.outerEl(chapter).find('h3').length > 0) {
        chapter = $(chapterId).nextUntil('h3')
      }
      chapter.each((i, nextPart) => {
        const outerHtml = this.outerEl($(nextPart)).html()
        this.currentSectionContent += outerHtml
      })
    },
    goToSection: function (sectionId) {
      this.currentSectionContent = ''

      const $ = cheerio.load(sampleBook)
      this.currentSectionContent += $(sectionId)

      const section = $(sectionId).nextUntil('h3')
      section.each((i, nextPart) => {
        const outerHtml = this.outerEl($(nextPart)).html()
        this.currentSectionContent += outerHtml
      })
    },
    outerEl: (el) => {
      return el.clone().wrap('<container />').parent()
    }
  }
}

</script>

<style lang='sass'>

.wrapper
  .toc
    position: fixed;
    height: 100vh;
    overflow-y: scroll
    width: 350px
    padding: 30px 20px
    background-color: #F9FAFA
    border-right: 1px solid #F4F5F5

    div:not(:first-child)
      margin-top: 1.5rem

    h1
      margin-bottom: .7rem

    li
      list-style: none
      margin-bottom: .7rem

  .content
    margin: 0 70px 20px 420px
    padding-top: 25px

    h2, h3
      font-size: 35px
      font-weight: 600

    p
      font-size: 18px

    pre
      background-color: #F9FAFA
      text-align: left

      code
        padding: 0
        display: inline
        font-family: 'Courier New';
        font-size: 13px;

</style>
