import React, { Component } from 'react'
import { render } from 'react-dom'

import Index from './pdf'

Meteor.startup(function () {
  render(
    <Index file='http://localhost:3000/1.pdf' />
  , document.getElementById('app'))
})
