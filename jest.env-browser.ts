import JSDOMEnvironment from 'jest-environment-jsdom'

// https://github.com/facebook/jest/blob/v29.4.3/website/versioned_docs/version-29.4/Configuration.md#testenvironment-string
export default class BrowserEnvironment extends JSDOMEnvironment {
  constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
    super(...args)

    // https://github.com/jsdom/jsdom/issues/1724#issuecomment-1446858041
    this.global.fetch = fetch
    this.global.Headers = Headers
    this.global.Request = Request
    this.global.Response = Response

    // TextEncoder and TextDecoder are not available in JSDOM
    const commonJsUtils = require('util')
    this.global.TextEncoder = commonJsUtils.TextEncoder
    this.global.TextDecoder = commonJsUtils.TextDecoder

    // Some stream classes are different in JSDOM
    const commonJsBuffer = require('buffer')
    this.global.ArrayBuffer = ArrayBuffer
    this.global.Blob = commonJsBuffer.Blob
    this.global.File = commonJsBuffer.File

    // URL implementation is different in JSDOM
    this.global.URL = require('url').URL
  }
}
