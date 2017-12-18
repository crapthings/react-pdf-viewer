import React, { Component } from 'react'

import { Document, Page } from 'react-pdf/build/entry.noworker'

import { AutoSizer, List } from 'react-virtualized'

export default class Index extends Component {
  state = {
    numPages: 0,
    pageWidth: 0,
    pageHeight: 0,
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
    return {
      pageWidth,
      pageHeight,
    }
  }

  fullheight = async pdf => {
    const page = await pdf.getPage(1)
    const { width, height } = page.getViewport(1)
    const { pdfdiv } = this.refs
    const pageHeight = pdfdiv.clientHeight
    const pageWidth = pageHeight * width / height
    return {
      pageWidth,
      pageHeight,
    }
  }

  onLoadSuccess = async pdf => {
    const { numPages } = pdf
    const { pageWidth, pageHeight } = await this.fullheight(pdf)
    this.setState({
      numPages,
      pdf,
      pageWidth,
      pageHeight,
    })
  }

  rowRenderer = ({ pdf, pageWidth, pageHeight }) => ({ key, index, style, isScrolling }) => {
    const pageNumber = index + 1
    return (
      <div className='watermark-layer' key={key}>
        <Page
          pdf={pdf}
          renderAnnotations={false}
          renderTextLayer={false}
          pageNumber={pageNumber}
          width={pageWidth}
          onLoadError={error => console.error(error)} />
        />
      </div>
    )
  }

  componentDidMount() {
    this.setState({
      pageWidth: this.refs.pdfdiv.clientWidth,
      pageHeight: this.refs.pdfdiv.clientHeight,
    })
  }

  render() {
    const {
      numPages,
      pdf,
      pageWidth,
      pageHeight,
    } = this.state

    const {
      file,
    } = this.props

    return (
      <div ref='pdfdiv' style={this.style}>
        <Document
          file={file}
          onLoadSuccess={this.onLoadSuccess}
        >
          {<List
            width={pageWidth}
            height={pageHeight}
            rowCount={numPages}
            rowHeight={pageHeight}
            rowRenderer={this.rowRenderer({ pdf, pageWidth, pageHeight })}
          />}
        </Document>
      </div>
    )
  }
}
