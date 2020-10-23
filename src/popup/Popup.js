import React from 'react';
import './Popup.css';
import * as browser from 'webextension-polyfill';
import helpers from '../helpers/helpers';

const Popup = () => {
  const [issueFilter, setIssueFilter] = React.useState('is:issue is:open');
  const [pullFilter, setPullFilter] = React.useState('is:pr is:open');
  const [loading, setLoading] = React.useState(true);
  const [repo, setRepo] = React.useState('');

  React.useEffect(() => {
    helpers.getCurrentTab().then(tab => {
      var _repo = helpers.getRepoFromUrl(tab.url);
      setRepo(_repo);
      var _issueFilter = _repo + 'issueFilter';
      var _pullFilter = _repo + 'pullFilter';
      browser.storage.local.get(_issueFilter).then((item) => {
        if(item[_issueFilter])
        {
          setIssueFilter(decodeURIComponent(item[_issueFilter]));
        }
      }).catch(() => {
        setIssueFilter('is:issue is:open');
      });
      browser.storage.local.get(_pullFilter).then((item) => {
        if(item[_pullFilter])
        {
          setPullFilter(decodeURIComponent(item[_pullFilter]));
        }
      }).catch(() => {
        setPullFilter('is:pr is:open');
      });
      setLoading(false);
    });
  }, []);

  const onSave = () => {
    helpers.getCurrentTab().then((tab) => {
      var _repo = helpers.getRepoFromUrl(tab.url);
      var uriFilter = encodeURIComponent(issueFilter);
      browser.storage.local.set({[_repo+'issueFilter']:uriFilter});
      browser.tabs.sendMessage(tab.id, { issueFilter: uriFilter });
    }).catch(err => console.log(err));
  };

  const onSavePullFilter = () => {
    helpers.getCurrentTab().then((tab) => {
      var _repo = helpers.getRepoFromUrl(tab.url);
      var uriFilter = encodeURIComponent(pullFilter);
      browser.storage.local.set({[_repo+'pullFilter']:uriFilter});
      browser.tabs.sendMessage(tab.id, { pullFilter: uriFilter });      
    }).catch(err => console.log(err));
  };

  if(loading)
  {
    return <div className="popup"><br />Loading...</div>;
  }

  return (
    <div className="popup">
      <h3>GitHub Default Filters</h3>
      {repo ? (
        <div>
          <h4>Repo: <b>{repo}</b> </h4>
          <div className="text">Set default issue filter</div>
          <input type="text" value={issueFilter} onChange={(ev)=>setIssueFilter(ev.target.value)} /><br />
          <button onClick={onSave}>Save Issue Filter</button>
          <br />
          <br />
          <div className="text">Set default pull request filter</div>
          <input type="text" value={pullFilter} onChange={(ev)=>setPullFilter(ev.target.value)} /><br />
          <button onClick={onSavePullFilter}>Save Pull Filter</button>
        </div>
      ) : (
        <div>
          <div className="text"><i>Current window/tab isn't a GitHub repo, open a GitHub repo in your browser to set the default issue filter</i></div>
        </div>
      )}
    </div>
  );
};


export default Popup;
