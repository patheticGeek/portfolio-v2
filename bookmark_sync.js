import { JSDOM } from 'jsdom'
import { readFileSync } from 'fs'
import crypto from 'crypto'

/**
 * Goto your browser > Bookmarks Manager > Export > save as bookmarks.html
 */
const rawData = readFileSync('./bookmarks.html')

const { window } = new JSDOM(rawData)

/**
 * @param {string} text
 */
const getId = (text) => {
  return crypto.createHash('md5').update(text).digest('hex')
}

const blacklisted = ['Personal', (b) => b.url?.startsWith('chrome://')]
const checkBlacklisted = (node) => {
  return blacklisted.some((b) =>
    typeof b === 'function' ? b(node) : b === node.textContent
  )
}

const ITEM_TYPE = {
  FOLDER: 'folder',
  BOOKMARK: 'bookmark'
}

const bookmarks = []
const folders = []

/**
 * Creates bookmarks tree and fills bookmarks & folders array
 * @param {HTMLElement} node
 * @param {object} parentNodes
 */
const processNode = (node, parentNodes) => {
  if (!['DT'].includes(node?.tagName)) return undefined

  let data = {}

  for (const child of node.childNodes) {
    if (child.tagName === 'A') {
      data = {
        type: ITEM_TYPE.BOOKMARK,
        name: child.textContent,
        url: child.getAttribute('href'),
        createdAt: child.getAttribute('add_date')
      }
      break
    } else if (child.tagName === 'DL') {
      data.children = [...child.childNodes]
    } else if (child.tagName === 'H3') {
      data.type = ITEM_TYPE.FOLDER
      data.name = child.textContent
      data.createdAt = child.getAttribute('add_date')
    }
  }

  data.id = getId(parentNodes.map((p) => p.name).join('>') + `>${data.name}`)
  data.level = parentNodes.length
  data.createdAt = parseInt(data.createdAt) * 1000
  // create this object fully first then send to children
  if (data.children) {
    data.children = data.children
      .map((child) => processNode(child, [...parentNodes, data]))
      .filter(Boolean)
  }

  if (checkBlacklisted(data)) return undefined

  if (data.type === ITEM_TYPE.BOOKMARK) {
    bookmarks.push({
      ...data,
      level: undefined,
      type: undefined,
      folderId: parentNodes[parentNodes.length - 1]?.id
    })
  } else if (data.type === ITEM_TYPE.FOLDER) {
    folders.push({
      ...data,
      children: undefined,
      type: undefined,
      parentId: parentNodes[parentNodes.length - 1]?.id
    })
  }

  return data
}

const rootNode = [...window.document.querySelectorAll('dt')].find((node) => [
  [...node.childNodes].find((child) => {
    child.tagName === 'H3' && child.getAttribute('personal_toolbar_folder')
  })
])

processNode(rootNode, [])

console.log(`Bookmarks`, bookmarks.length, 'Folders', folders.length)
console.log(`Calling api...`)

const response = await fetch(`http://localhost:4321/api/bookmark`, {
  method: 'POST',
  headers: {
    'x-api-key': process.env.BOOKMARKS_API_KEY
  },
  body: JSON.stringify({ folders, bookmarks })
})

console.log(`Response`, await response.json())
