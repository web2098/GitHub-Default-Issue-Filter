import helpers from '../helpers/helpers';
import $ from 'jquery';
import * as browser from 'webextension-polyfill';

console.log('Content scripts has loaded');

browser.runtime.onMessage.addListener(function (message) {
  var repo = helpers.getRepoFromUrl(window.location.href);
  var host = helpers.ghConvert(window.location.href).host;
  if(message.issueFilter)
  {
    window.location.href = 'https://' + host + '/' + repo + '/issues?q='+message.issueFilter;
  }
  else if(message.pullFilter)
  {
    window.location.href = 'https://' + host + '/' + repo + '/issues?q='+message.pullFilter;
  }
});

var repo = helpers.ghConvert(window.location.href).repo;
var host = helpers.ghConvert(window.location.href).host;
var url = window.location.href;

if(url.toLowerCase().endsWith('/issues') || url.toLowerCase().endsWith('/issues/'))
{
  redirectToIssueUrl(false);
}
else if(url.toLowerCase().endsWith('/pulls') || url.toLowerCase().endsWith('/pulls/'))
{
  redirectToPullUrl(false);
}

function redirectToIssueUrl(needsRedirect)
{
  console.log('Doing the redirect thing witddddh href: ' + window.location.href );
  var issueUrl = 'https://' + host + '/' + repo + '/issues';
  var repoId = repo + 'issueFilter';
  browser.storage.local.get(repoId).then((item) => {
    if(item[repoId])
    {
      window.location.href = issueUrl + '?q='+ item[repoId];
    }
    else
    {
      needsRedirect && (window.location.href = issueUrl);
    }
  }).catch(() => {
    needsRedirect && (window.location.href = issueUrl);
  });
}


function redirectToPullUrl(needsRedirect)
{
  console.log('Doing the redirect thing witddddh href: ' + window.location.href );
  var pullUrl = 'https://' + host + '/' + repo + '/pulls';
  var repoId = repo + 'pullFilter';
  browser.storage.local.get(repoId).then((item) => {
    if(item[repoId])
    {
      window.location.href = pullUrl + '?q='+ item[repoId];
    }
    else
    {
      needsRedirect && (window.location.href = pullUrl);
    }
  }).catch(() => {
    needsRedirect && (window.location.href = pullUrl);
  });
}

$(document).on('click', 'a[href$=\''+repo+'/issues\']', function(e) {
  e.preventDefault();
  redirectToIssueUrl(true);
});
$(document).on('click', 'a[href$=\''+repo+'/pulls\']', function(e) {
  e.preventDefault();
  redirectToPullUrl(true);
});
