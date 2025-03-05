import Papa from 'papaparse'

export type SupportedType = 'text/csv' | 'application/json'

async function saveToFile(fileContents: string, fileName: string, fileType: SupportedType) {
  const blobURL = URL.createObjectURL(new Blob([fileContents], { type: fileType }))
  try {
    const link = document.createElement('a')
    link.href = blobURL
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } finally {
    URL.revokeObjectURL(blobURL)
  }
}

export async function saveToJsonFile(fileContents: unknown, fileName: string) {
  await saveToFile(JSON.stringify(fileContents, null, 2), fileName + '.json', 'application/json')
}

export async function saveToCsvFile(
  fileContents: unknown[],
  fileName: string,
  csvHeaders: string[] | undefined = undefined,
) {
  await saveToFile(
    Papa.unparse(fileContents, {
      quotes: true,
      delimiter: ';',
      header: false,
      skipEmptyLines: 'greedy',
      columns: csvHeaders,
      escapeFormulae: true,
    }),
    fileName + '.csv',
    'text/csv',
  )
}
