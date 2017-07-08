<template>
  <div>
    <div class="toc">
      <div v-for="chapter in chapters">
        <h2>
          <a
            :href="chapter.id"
            @click="goToChapter(chapter.id)"
          >{{ chapter.name }}</a>
        </h2>
        <ul
          <li v-for="section in chapter.sections">
            <a
              :href="section.id"
              @click="goToSection(section.id)"
            >{{ section.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-html="currentSectionContent" class="current-section">
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
