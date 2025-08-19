import * as XLSX from 'xlsx'

export async function loadCutoffDataFromURL(url) {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)

    const result = {
        yearCutoff: {},
        monthCutoffDay: {},
        /*monthCutoffAngel: {},*/
    }

    rows.forEach((row) => {
        const { type, key, value } = row
        if (result[type]) {
            result[type][key] = value
        }
    })

    //console.log(result)
    return result
}
