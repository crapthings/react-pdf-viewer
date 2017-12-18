import React, { Component } from 'react'

import { AutoSizer, List } from 'react-virtualized'

class Page extends Component {
  async componentDidMount() {
    const {
      pdf,
      index,
      pageWidth,
      pageHeight,
      scale,
    } = this.props
    const page = await pdf.getPage(index + 1)
    var viewport = page.getViewport(scale)
    var canvas = this.refs.page
    var context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width

    // Render PDF page into canvas context.
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    }
    page.render(renderContext)
  }

  render() {
    const {
      index,
      style,
    } = this.props

    const pageNumber = index + 1

    return (
      <div className='watermark-layer' key={index} style={style}>
        <canvas ref='page'></canvas>
      </div>
    )
  }
}

export default class Index extends Component {
  state = {
    pageWidth: 0,
    pageHeight: 0,
    pdf: null,
    numPages: 0,
  }

  style = {
    minHeight: '100vh',
  }

  fullwidth = async pdf => {
    const page = await pdf.getPage(1)
    const { width, height } = page.getViewport(1)
    const { pdfdiv } = this.refs
    const pageWidth = pdfdiv.clientWidth
    const pageHeight = pageWidth * height /  width
    const scale = pageWidth / width
    return {
      pageWidth,
      pageHeight,
      scale,
    }
  }

  fullheight = async pdf => {
    const page = await pdf.getPage(1)
    const { width, height } = page.getViewport(1)
    const { pdfdiv } = this.refs
    const pageHeight = pdfdiv.clientHeight
    const pageWidth = pageHeight * width / height
    const scale = pageWidth / width
    return {
      pageWidth,
      pageHeight,
      scale,
    }
  }

  async componentDidMount() {
    const { file } = this.props
    const pdf = await PDFJS.getDocument(file)
    const { numPages } = pdf
    const { pageWidth, pageHeight, scale } = await this.fullheight(pdf)
    this.setState({
      pdf,
      numPages,
      pageWidth,
      pageHeight,
      scale,
    })
  }

  render() {
    const { pdf, numPages, pageWidth, pageHeight, scale, } = this.state
    return (
      <div ref='pdfdiv' style={this.style}>
        <List
          style={{ margin: '0 auto' }}
          width={pageWidth}
          height={pageHeight}
          rowCount={numPages}
          rowHeight={pageHeight}
          rowRenderer={({ index, style, }) => {
            return (
              <Page
                pdf={pdf}
                pageWidth={pageWidth}
                pageHeight={pageHeight}
                scale={scale}
                key={index}
                index={index}
                style={style}
              />
            )
          }}
        />
      </div>
    )
  }
}
