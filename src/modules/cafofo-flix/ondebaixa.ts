import axios from 'axios'
import cheerio from 'cheerio'

export async function search(query: string): Promise<{ title: string; url: string }[]> {
    const transformedQuery = query.split(' ').join('+')

    const response = await axios.get(`https://ondebaixa.com/index.php?s=${transformedQuery}`)

    var $ = cheerio.load(response.data)
    const links = $('#capas_pequenas a')
    const result: { title: string; url: string }[] = []

    $(links).each((_i, value) => {
        const title = $(value).attr('title')!
        const url = $(value).attr('href')!
        result.push({ title, url })
    })

    return result
}

export async function list(url: string): Promise<{ title: string; url: string }[]> {
    const response = await axios.get(url)

    var $ = cheerio.load(response.data)
    const links = $('#lista_download a')
    const result: { title: string; url: string }[] = []

    $(links).each((_i, value) => {
        const title = $(value).attr('title')!
        const url = $(value).attr('href')!
        result.push({ title, url })
    })

    return result.filter((result) => result.url.startsWith('magnet'))
}
