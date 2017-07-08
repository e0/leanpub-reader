<template>
  <div class="container">
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
      const $ = cheerio.load(sampleBook)
      const chapterHeading = $(chapterId).nextUntil('h2')
      this.currentSectionContent = ''
      chapterHeading.each((i, nextPart) => {
        this.currentSectionContent += $(nextPart).html()
      })
    },
    goToSection: function (sectionId) {
      const $ = cheerio.load(sampleBook)
      const sectionHeading = $(sectionId).nextUntil('h3')
      this.currentSectionContent = ''
      sectionHeading.each((i, nextPart) => {
        this.currentSectionContent += $(nextPart).html()
      })
    }
  }
}

</script>

<style>
.container {
  display: flex;
}

</style>
