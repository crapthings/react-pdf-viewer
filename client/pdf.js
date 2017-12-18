import React, { Component } from 'react'
import { AutoSizer, List } from 'react-virtualized'

class Page extends Component {
  componentDidMount() {
    this.renderPDF()
  }

  renderPDF = async () => {
    const { pdf, pageNumber, pageWidth, pageHeight, scale, } = this.props
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport(scale)
    const canvas = this.refs.page
    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width
    page.render({
      canvasContext: context,
      viewport: viewport,
    })
  }

  render() {
    const { index, style, } = this.props
    return (
      <div className='watermark-layer' key={index} style={style}>
        <canvas ref='page'></canvas>
      </div>
    )
  }
}

export default class PDFViewer extends Component {
  state = {
    pdf: null,
    numPages: 0,
    pageWidth: 0,
    pageHeight: 0,
    scale: 0,
  }

  style = {
    minHeight: '100vh',
  }

  async componentDidMount() {
    const { file } = this.props
    const pdf = await PDFJS.getDocument(file)
    const { numPages } = pdf
    const { pageWidth, pageHeight, scale } = await this.getSize(pdf)
    this.setState({ pdf, numPages, pageWidth, pageHeight, scale, })
  }

  getSize = async (pdf, full) => {
    const page = await pdf.getPage(1)
    const { width, height } = page.getViewport(1)
    const { pdfdiv } = this.refs
    let pageWidth, pageHeight, scale

    if (full) {
      pageWidth = pdfdiv.clientWidth
      pageHeight = pageWidth * height /  width
      scale = pageWidth / width
    } else {
      pageHeight = pdfdiv.clientHeight
      pageWidth = pageHeight * width / height
      scale = pageWidth / width
    }

    return {
      pageWidth,
      pageHeight,
      scale,
    }
  }

  render() {
    const { pdf, numPages, pageWidth, pageHeight, scale, } = this.state
    return (
      <div ref='pdfdiv' style={this.style}>
        <List
          style={{ margin: '0 auto' }}
          width={pageWidth}
          height={pageHeight}
          rowHeight={pageHeight}
          rowCount={numPages}
          rowRenderer={({ index, style, }) => {
            return (
              <Page
                key={index}
                index={index}
                style={style}
                pdf={pdf}
                pageNumber={index + 1}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
                scale={scale}
              />
            )
          }}
        />
      </div>
    )
  }
}
