#!/usr/bin/env phantomjs

var url = 'http://localhost:4000/resume.html';
var output = 'resume.pdf';

var page = require('webpage').create();

page.open(url, function(status) {
  if (status != 'success') {
    console.log('Could not open URL');
    phantom.exit(1);
  }

  page.paperSize = {
    format: 'Letter',
    orientation: 'protrait',
    border: '0.5in'
  };

  page.render(output, {format: 'pdf'});
  phantom.exit();
});
