import path from 'node:path'
import fs from 'node:fs'
import csv from 'csvtojson'
import { createInterface } from 'node:readline'

class FileDatasource {
  #streamData = []

  #gps_filename = null
  #accelerometer_filename = null
  #parking_filename = null

  constructor(...files) {
    this.#accelerometer_filename = path.resolve(files[0])
    this.#gps_filename = path.resolve(files[1])
    this.#parking_filename = path.resolve(files[2])
  }

  async #createStream(filename) {
    try {
      await fs.promises.access(filename, fs.promises.constants.R_OK | fs.promises.constants.W_OK);
    } catch {
      throw new Error("Can't read the file", filename)
    } 
 
    return createInterface({
      input: fs.createReadStream(filename).pipe(csv()),
    })
  }

  async startReading() {
    this.#streamData.push({
      stream: await this.#createStream(this.#accelerometer_filename),
      file: this.#accelerometer_filename,
      name: 'accelerometer',
    })
   
    this.#streamData.push({
      stream: await this.#createStream(this.#gps_filename),
      file: this.#gps_filename,
      name: 'gps',
    })
   
    this.#streamData.push({
      stream: await this.#createStream(this.#parking_filename),
      file: this.#parking_filename,
      name: 'parking',
    })
    
  }

  async stopReading() {
  
    for (const streamData of this.#streamData) {
      streamData.stream.close()
    }
    this.#streamData = []
  }

  async read() {
    if(!this.#streamData.length) return null

    const readData = {} 


    for (const streamData of this.#streamData) {
      const iterator = streamData.stream[Symbol.asyncIterator]()
      
      let data = await iterator.next()
  
      if (data.done) {
        console.log('create new')
        const newStream = await this.#createStream(streamData.file)
        data = await newStream[Symbol.asyncIterator]().next()
        streamData.stream = newStream
      }
   
      readData[streamData.name] = JSON.parse(data.value)

    }

 
    return readData
  }
}

export default FileDatasource
